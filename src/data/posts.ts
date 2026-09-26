// Blog posts, written directly into the site (no database).
//
// A post can place a figure with an empty marker in its body:
//   <figure data-figure="ttl-timeline"></figure>
// BlogPost swaps the marker for the matching PostFigure.

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // YYYY-MM-DD
  readTime: string;
  tags: string[];
  bodyHtml: string;
};

export const POSTS: Post[] = [
  {
    slug: "one-api-per-dashboard-short-ttl",
    title: "One API per dashboard, and why a short TTL beats a long one",
    excerpt:
      "Nine dashboards, data owned by another system, and a frontend that shouldn't have to care. Here's how an aggregation endpoint and a short-lived cache keep them fast and current.",
    category: "Architecture",
    date: "2026-09-22",
    readTime: "6 min read",
    tags: [".NET", "ABP.io", "Caching"],
    bodyHtml: `
<p>At Systems Limited I worked on the Visa by Package dashboards: four for investors and five for admins. None of their data is ours. It lives in another system, which exposes it through its own APIs. Our job was to put those numbers on screen quickly, and keep them honest.</p>

<h2>Why not call their APIs from the frontend</h2>
<p>The quickest version is to let each dashboard call the APIs it needs straight from the browser. It works in a demo, and it costs you in four ways:</p>
<ul>
  <li><strong>Round trips.</strong> A dashboard that needs data from several endpoints makes several requests, each over the visitor's own network.</li>
  <li><strong>Coupling.</strong> Every screen now depends on another team's contracts. When those change, the frontend changes too.</li>
  <li><strong>Exposure.</strong> Whatever the browser can call, anyone can call, with whatever credentials that takes.</li>
  <li><strong>No shared cache.</strong> Each visitor fetches the same data again.</li>
</ul>

<h2>One endpoint per dashboard</h2>
<p>Instead, our ABP.io backend centralises the calls to the other system and exposes a single API per dashboard. The endpoint is shaped for its screen: it fans out to the external APIs in parallel, combines the answers, and returns exactly what the dashboard renders. The frontend makes one call and knows nothing about where the data came from.</p>
<p>Here is the shape of one of them, simplified and with the names changed:</p>
<pre><code>public async Task&lt;InvestorOverviewDto&gt; GetInvestorOverviewAsync(Guid investorId)
{
    return await _cache.GetOrAddAsync(
        $"investor-overview:{investorId}",
        async () =&gt;
        {
            // Fan out to the external system in parallel, not one call after another.
            var applications = _external.GetApplicationsAsync(investorId);
            var summary      = _external.GetSummaryAsync(investorId);
            var payments     = _external.GetPaymentsAsync(investorId);
            await Task.WhenAll(applications, summary, payments);

            return InvestorOverviewDto.From(applications.Result, summary.Result, payments.Result);
        },
        () =&gt; new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(60)
        });
}</code></pre>

<h2>Why the TTL is short on purpose</h2>
<p>A cache can go stale in two ways, and you have to pick one. Either you invalidate entries when the data changes, or you let them expire. Invalidation needs to know when the data changes, and here the data belongs to another system that doesn't tell us. So expiry is the only honest option, and the TTL becomes the promise you make to the person looking at the screen: <em>this is never more than one TTL old</em>.</p>
<figure data-figure="ttl-timeline"></figure>
<p>A long TTL makes that promise meaningless. A short one, seconds to a minute rather than hours, keeps the numbers close to live while still collapsing a burst of loads into a single round of upstream calls. Pick the number from the screen, not from the cache: how stale can this dashboard be before someone makes a wrong decision from it?</p>

<h2>Key by what the screen shows</h2>
<ul>
  <li><strong>Include the viewer in the key</strong> when the data is theirs. An investor's dashboard must never be served from another investor's entry.</li>
  <li><strong>Include the filters</strong> that change the result, and nothing that doesn't, or every entry becomes a miss.</li>
  <li><strong>Cache the shaped response</strong>, not the raw external payloads. That's what the screen asks for, so that's what a hit should return.</li>
</ul>

<h2>Mind the moment it expires</h2>
<p>When a popular entry expires, every load that arrives before it's rebuilt is a miss. ABP's <code>GetOrAddAsync</code> already serialises the factory for a key within an instance, which covers most of it. If you run many instances against a slow upstream, that's the point to look at a distributed lock or serving the stale value while one caller refreshes it.</p>

<h2>The takeaway</h2>
<p>Put an endpoint between your screens and someone else's system, shape it for the screen, and cache it for about as long as the screen can afford to be wrong. The frontend gets one fast call, the other system gets far fewer, and the data stays within a known distance of the truth.</p>
`,
  },
  {
    slug: "request-to-pay-idempotency",
    title: "Two ways to pay, one payment: idempotency in Request to Pay",
    excerpt:
      "A request that reaches the customer as a push notification and a USSD prompt at the same time needs one rule above all the others: it can only be paid once.",
    category: "Fintech",
    date: "2026-09-15",
    readTime: "7 min read",
    tags: [".NET", "Payments", "Idempotency"],
    bodyHtml: `
<p>At DPL I led delivery of Request to Pay, which 4,000+ merchants went on to adopt. The merchant enters the customer's MSISDN, a name-check API confirms who it is, they set the amount and send. The customer then receives the request twice: as a push notification in the app, and as a USSD prompt.</p>
<p>Sending it down both channels is the point. The push is convenient on a smartphone; the USSD prompt reaches phones without data. But two channels are also two chances to pay, and the whole feature rests on one of them always losing.</p>

<h2>The failure you're designing against</h2>
<p>A customer opens the notification and pays in the app. The USSD prompt is still on their phone, so they answer that too. Or the network is slow, and they try again. Either way, two payment attempts for the same request arrive close together, and the obvious code lets both through:</p>
<pre><code>var request = await db.PaymentRequests.FindAsync(requestId);
if (request.Status != RequestStatus.Pending)       // both callers see Pending...
    throw new BusinessException("REQUEST_ALREADY_PAID");

request.Status = RequestStatus.Paid;               // ...and both pay
await db.SaveChangesAsync();</code></pre>
<p>This is check-then-act. Between the read and the write there is a window, and under real traffic someone will land in it.</p>

<h2>Make the state change the check</h2>
<p>The fix is to stop asking whether the request is still pending and then acting on the answer. Ask the database to move it from <code>Pending</code> to <code>Paid</code> only if it is still <code>Pending</code>, in one statement, and look at how many rows changed. One row: this caller won. Zero rows: someone already paid.</p>
<pre><code>public async Task PayAsync(Guid requestId, PaymentChannel channel, CancellationToken ct)
{
    await using var tx = await db.Database.BeginTransactionAsync(ct);

    // The check and the state change are one statement, so only one caller can win.
    var claimed = await db.PaymentRequests
        .Where(r =&gt; r.Id == requestId &amp;&amp; r.Status == RequestStatus.Pending)
        .ExecuteUpdateAsync(s =&gt; s
            .SetProperty(r =&gt; r.Status, RequestStatus.Paid)
            .SetProperty(r =&gt; r.PaidVia, channel), ct);

    if (claimed == 0)
        throw new BusinessException("REQUEST_ALREADY_PAID");

    await wallet.DebitAsync(requestId, ct);   // inside the same transaction as the claim
    await tx.CommitAsync(ct);
}</code></pre>
<figure data-figure="r2p-sequence"></figure>
<p>That sketch assumes the debit and the request live in the same database, so one transaction covers both. When the money moves in another system, claim the request first (<code>Pending</code> to <code>Processing</code>), make the payment, then finish it (<code>Processing</code> to <code>Paid</code>), and release the claim if the payment fails. The rule doesn't change: the transition itself is the lock.</p>

<h2>"Already paid" is an answer, not an error</h2>
<p>The losing attempt isn't a bug, and it shouldn't look like one. It's a business exception with a clear message: this request has already been paid. The customer who paid in the app and then answered the USSD prompt should be told exactly that, not shown a generic failure that makes them wonder whether they paid twice.</p>

<h2>The callback is a second writer</h2>
<p>USSD payments finish asynchronously. Once the customer confirms, a callback arrives and updates the request record in the database. That makes the callback a writer too, and callbacks get retried: timeouts, redeliveries, a gateway being careful. So the callback uses the same conditional transition. A repeated callback finds nothing left to update, and should still answer with success, because from the gateway's point of view the job is done.</p>

<h2>What to take from it</h2>
<ul>
  <li><strong>Every channel goes through one transition.</strong> App, USSD, and callback all use the same conditional update, never their own copy of the rules.</li>
  <li><strong>Let the database arbitrate.</strong> A conditional update or a unique constraint beats any check you do in application code.</li>
  <li><strong>Design the loser's experience.</strong> "Already paid" is the most reassuring thing you can tell someone who tried twice.</li>
  <li><strong>Assume every callback arrives more than once.</strong></li>
</ul>
`,
  },
  {
    slug: "build-once-promote-by-tag",
    title: "Build once, promote by tag: how we cut deployment errors by 99%",
    excerpt:
      "If production runs an image that UAT never saw, you are testing one thing and shipping another. Here's the pipeline change that fixed it for the telco agent apps.",
    category: "DevOps",
    date: "2026-09-01",
    readTime: "6 min read",
    tags: ["Docker", "Jenkins", "CI/CD"],
    bodyHtml: `
<p>On the telco agent apps at DPL, releases were where things went wrong. Deployments failed, took too long, and sometimes shipped issues that had never appeared in testing and only surfaced at runtime in production. I automated the pipeline with Docker and Jenkins, and the change that mattered most was simple to state: the image that passes UAT is the image that goes to production. Deployment errors fell by 99%.</p>

<h2>Rebuilding is the bug</h2>
<p>If every environment gets its own build, every environment gets its own artifact. Even from the same commit, a rebuild can pull a newer base image, resolve a dependency differently, or bake in a different setting. The build that UAT signed off and the build that reached production were never the same thing, and "it worked in PreProd" stopped meaning anything.</p>
<figure data-figure="build-once"></figure>

<h2>Make PreProd a replica of production</h2>
<p>Promoting an image only works if the place it was tested looks like the place it's going. Our PreProd was a replica of production, so a UAT sign-off there was a sign-off for production too. If PreProd drifts, UAT is testing a different system, and promotion just moves the surprise later.</p>

<h2>Promote, don't rebuild</h2>
<p>The pipeline builds once and pushes the image with an identity that never changes. After UAT is signed off on PreProd, promotion is only a new tag on that same image:</p>
<pre><code># Build stage: build and push once, tagged with the build number
docker build -t registry.example.com/agent-api:build-$BUILD_NUMBER .
docker push registry.example.com/agent-api:build-$BUILD_NUMBER

# Promotion stage, after UAT sign-off on PreProd: no build, just a new tag
docker pull registry.example.com/agent-api:build-$BUILD_NUMBER
docker tag  registry.example.com/agent-api:build-$BUILD_NUMBER \\
            registry.example.com/agent-api:release-$RELEASE_VERSION
docker push registry.example.com/agent-api:release-$RELEASE_VERSION</code></pre>
<p>Production then deploys <code>release-$RELEASE_VERSION</code>, which points at exactly the bytes UAT tested. Nothing is compiled between sign-off and release, so nothing new can sneak in.</p>

<h2>Tags are the release record</h2>
<ul>
  <li><strong>One immutable identity per build.</strong> The build tag is written once and never moved.</li>
  <li><strong>Release tags are names, not new builds.</strong> They make it obvious what's running, and rolling back is deploying the previous release tag.</li>
  <li><strong>Never reuse a tag.</strong> Moving a tag to a different image quietly rewrites history, which is the problem this whole setup exists to prevent.</li>
</ul>

<h2>Keep configuration out of the image</h2>
<p>Build-once has one precondition: nothing environment-specific can be baked into the image. Connection strings, endpoints, and feature settings come from the environment at deploy time. If a setting forces a rebuild per environment, you're back to shipping untested artifacts.</p>

<h2>What changed</h2>
<p>Deployment errors dropped by 99%. Releases got faster, because there was nothing left to build at release time. And the runtime issues that used to appear only in production mostly stopped, because production was finally running the thing we had tested.</p>
`,
  },
  {
    slug: "redis-connection-pool-exhaustion",
    title: "What 600k concurrent sessions taught me about Redis connections",
    excerpt:
      "Our Redis outages looked like a capacity problem. They weren't: every request was opening its own connection. Here's the multiplexing fix that kept the Mixx Tanzania app up at peak.",
    category: "Backend",
    date: "2026-08-18",
    readTime: "6 min read",
    tags: [".NET", "Redis", "Performance"],
    bodyHtml: `
<p>During peak traffic on the Mixx Tanzania app at DPL, the Redis layer started failing in a way that looked like a capacity problem: timeouts, runtime errors, and eventually downtime. It wasn't capacity. Every request to Redis was creating a new connection, so with 600k+ concurrent sessions the application went past the connection limit long before Redis ran out of headroom.</p>

<h2>Why connections run out</h2>
<p>Redis clients are cheap to call and expensive to connect. Every new TCP connection costs a handshake, authentication, and a slot on the server. When connections scale with traffic instead of staying flat, nobody notices at normal load. At peak, requests queue for a connection, time out, and retry, which makes the queue longer still.</p>
<figure data-figure="redis-connections"></figure>
<p>The usual ways an application ends up here:</p>
<ul>
  <li>Creating a client per request, or per scoped service</li>
  <li>Blocking calls like <code>.Result</code> and <code>.Wait()</code> that hold threads while they wait on Redis</li>
  <li>Heavy, long-running commands sharing connections with hot-path reads</li>
</ul>

<h2>Multiplexing instead of connecting</h2>
<p>In .NET, <code>StackExchange.Redis</code> is built around a multiplexer: one long-lived connection object shared by every concurrent operation. Commands are pipelined over the same connection, so thousands of callers don't need thousands of connections. The fix is less about tuning and more about treating the connection as application-wide infrastructure.</p>
<pre><code>// Program.cs: one multiplexer for the whole app, created at startup
builder.Services.AddSingleton&lt;IConnectionMultiplexer&gt;(_ =&gt;
    ConnectionMultiplexer.Connect(builder.Configuration["Redis:ConnectionString"]!));

// Anywhere else: borrow a lightweight database handle
public sealed class SessionStore(IConnectionMultiplexer redis)
{
    private readonly IDatabase _db = redis.GetDatabase();

    public Task&lt;RedisValue&gt; GetAsync(string sessionId) =&gt;
        _db.StringGetAsync($"session:{sessionId}");
}</code></pre>

<h2>The principles behind the fix</h2>
<ul>
  <li><strong>One multiplexer per process</strong>, registered as a singleton and created at startup rather than on the first request.</li>
  <li><strong>Async all the way down</strong>, so a slow round trip never holds a thread hostage.</li>
  <li><strong>Keep heavy work off the hot path</strong>, so bulk operations can't starve session reads.</li>
  <li><strong>Watch connection counts, not just latency.</strong> A flat connection graph through a traffic spike is the sign the fix is working.</li>
</ul>

<h2>The takeaway</h2>
<p>After the change, the timeout errors at peak disappeared and the app stayed up through its busiest periods. When a cache falls over under load, look at how the application talks to it before you scale the cache. The answer is often not a bigger Redis, but fewer, shared connections, used asynchronously.</p>
`,
  },
  {
    slug: "emv-qr-tlv-encoding",
    title: "Encoding EMV QR payloads with TLV, step by step",
    excerpt:
      "An EMV QR code is a string of tag-length-value fields with a checksum at the end. Here's how the format works, static and dynamic, and how to build one in C#.",
    category: "Fintech",
    date: "2026-07-21",
    readTime: "7 min read",
    tags: ["EMV QR", "C#", "Payments"],
    bodyHtml: `
<p>When I built a P2P QR payment system at DPL, with both static and dynamic codes, the first requirement was the standard: follow the EMV® QR Code specification, so any compliant scanner can read the code. Under the pixels, the payload is a plain string of TLV fields, and scanning one parses those fields back into a transaction.</p>

<h2>Tag, length, value</h2>
<p>Every field has three parts: a two-digit ID, a two-digit length, and the value. The ID <code>59</code> with the value <code>ANEES STORE</code> (11 characters) becomes <code>5911ANEES STORE</code>. Some fields are templates that contain TLV fields of their own, like merchant account information.</p>
<figure data-figure="tlv-anatomy"></figure>
<p>The fields you'll use most:</p>
<ul>
  <li><code>00</code> Payload format indicator, always <code>01</code></li>
  <li><code>01</code> Point of initiation: <code>11</code> for static, <code>12</code> for dynamic</li>
  <li><code>26</code>-<code>51</code> Merchant account information (nested TLV)</li>
  <li><code>52</code> Merchant category code</li>
  <li><code>53</code> Transaction currency, ISO 4217 numeric (for example <code>834</code> for TZS)</li>
  <li><code>54</code> Transaction amount, used in dynamic codes</li>
  <li><code>58</code> Country code, <code>59</code> merchant name, <code>60</code> merchant city</li>
  <li><code>63</code> CRC, always the last field</li>
</ul>

<h2>Static vs dynamic</h2>
<p>A static code (<code>01</code> = <code>11</code>) says who to pay; it's generated once and reused, and the payer enters the amount. A dynamic code (<code>01</code> = <code>12</code>) is generated for one transaction and also says how much, in field <code>54</code>.</p>

<h2>The checksum</h2>
<p>Field <code>63</code> holds a CRC-16/CCITT-FALSE checksum (polynomial <code>0x1021</code>, initial value <code>0xFFFF</code>). It's calculated over the whole payload, including the <code>6304</code> ID and length of the CRC field itself, and written as four uppercase hex characters.</p>
<pre><code>static string Tlv(string id, string value) =&gt;
    $"{id}{value.Length:D2}{value}";

static string Crc16(string payload)
{
    ushort crc = 0xFFFF;
    foreach (var b in Encoding.ASCII.GetBytes(payload))
    {
        crc ^= (ushort)(b &lt;&lt; 8);
        for (var i = 0; i &lt; 8; i++)
            crc = (crc &amp; 0x8000) != 0
                ? (ushort)((crc &lt;&lt; 1) ^ 0x1021)
                : (ushort)(crc &lt;&lt; 1);
    }
    return crc.ToString("X4");
}

var payload =
    Tlv("00", "01") +
    Tlv("01", "12") +
    Tlv("26", Tlv("00", "com.example.wallet") + Tlv("01", "MERCHANT-001")) +
    Tlv("52", "5411") +
    Tlv("53", "834") +
    Tlv("54", "25000.00") +
    Tlv("58", "TZ") +
    Tlv("59", "ANEES STORE") +
    Tlv("60", "DAR ES SALAAM") +
    "6304";

payload += Crc16(payload);</code></pre>

<h2>What bites in production</h2>
<ul>
  <li><strong>Lengths are character counts.</strong> Validate names and cities before encoding, and keep them within the spec's limits.</li>
  <li><strong>Parse, don't split.</strong> Read the ID and length, then consume exactly that many characters. Values can contain digits that look like tags.</li>
  <li><strong>Verify the CRC first</strong> when scanning, before trusting any field in the payload.</li>
  <li><strong>Treat templates as their own TLV strings</strong>, with their own lengths.</li>
</ul>
<p>Once the encoder and parser are solid and well tested, everything built on top of them, from generating a code to starting a transfer from a scan, gets simpler.</p>
`,
  },
  {
    slug: "bulk-push-notification-scheduler",
    title: "Sending 800k push notifications without loading 800k rows",
    excerpt:
      "Chunked reads, a semaphore of two, and one retry pass at the end: the design behind a scheduler that sends 700-800k notifications per run in 6-8 minutes.",
    category: "Architecture",
    date: "2026-06-16",
    readTime: "7 min read",
    tags: [".NET", "Messaging", "Scalability"],
    bodyHtml: `
<p>At DPL I built the scheduler behind bulk push campaigns. An admin imports a file of MSISDNs in the back office and sets the notification's body, type, and send time. The scheduler then delivers it to Android (FCM) and Huawei devices: 700-800k notifications per run, in 6-8 minutes.</p>
<p>Sending one notification is easy. The interesting part is sending 800k without holding 800k of anything in memory, and without one bad device slowing everybody else down.</p>

<h2>The naive version</h2>
<p>Load every recipient, loop, send. It works in testing and falls over in production: the whole list sits in memory at once, one slow provider call holds up the rest, and a crash halfway means starting again with no idea who already got the message.</p>

<h2>Two tables and a scheduler</h2>
<p>The import writes the notification to one table and its MSISDNs to another, both marked unprocessed. The scheduler picks up unprocessed notifications, then works through the MSISDNs stored against each one. Keeping "what to send" and "who to send it to" apart is what makes the rest possible: the recipient list can be read piece by piece, and progress is recorded per recipient.</p>

<h2>Read in chunks</h2>
<p>Holding 800k+ records in memory at once is how a scheduler takes a server down with it. So recipients are read in fixed-size chunks, and only a chunk at a time is ever in flight per worker. A keyset query (<code>WHERE Id &gt; @lastId ORDER BY Id</code>) is the simplest way to page through them; it stays fast however deep into the list you are, where <code>OFFSET</code> gets slower with every page.</p>

<h2>A semaphore of two</h2>
<p>Chunks run in parallel, but not unboundedly. A semaphore set to 2 means two workers each process one chunk at a time. That number is a deliberate ceiling: memory stays at two chunks, the database sees two readers instead of dozens, and the push providers see a steady rate rather than bursts that invite throttling.</p>
<figure data-figure="push-chunks"></figure>
<p>A simplified sketch of the loop:</p>
<pre><code>var gate = new SemaphoreSlim(2);          // at most two chunks in flight
var sends = new List&lt;Task&gt;();

await foreach (var chunk in recipients.ReadChunksAsync(notification.Id, ChunkSize, ct))
{
    await gate.WaitAsync(ct);
    sends.Add(Task.Run(async () =&gt;
    {
        try { await SendChunkAsync(notification, chunk, ct); }
        finally { gate.Release(); }
    }, ct));
}

await Task.WhenAll(sends);
await RetryFailedAsync(notification, ct);  // one pass, after every chunk is delivered</code></pre>

<h2>Look up the device, then send</h2>
<p>An MSISDN isn't an address a push service understands. For each chunk the worker looks up the device information, which says whether it's an FCM (Android) or Huawei device, and the notification content, then sends each group through the right provider.</p>
<pre><code>async Task SendChunkAsync(Notification n, IReadOnlyList&lt;Recipient&gt; chunk, CancellationToken ct)
{
    var devices = await deviceStore.GetAsync(chunk.Select(r =&gt; r.Msisdn), ct);

    foreach (var platform in devices.GroupBy(d =&gt; d.Platform))    // Fcm or Huawei
    {
        var result = await senders[platform.Key].SendAsync(n.Content, platform, ct);
        await recipients.MarkProcessedAsync(result.Delivered, ct); // failures stay unprocessed
    }
}</code></pre>

<h2>Mark as you go, retry at the end</h2>
<ul>
  <li><strong>Sent records are marked processed straight away</strong>, so a crashed run resumes from what's left instead of starting over, and nobody gets the message twice.</li>
  <li><strong>Failures stay unprocessed</strong> and are retried once every chunk has been delivered. Retrying inline would let a handful of bad devices slow down everyone else's delivery.</li>
</ul>

<h2>Check the arithmetic</h2>
<p>800k messages in 8 minutes is about 1,700 per second, sustained. That number is what the chunk size and the parallelism have to deliver, and it's worth working out before choosing either. When a run gets slower, time each stage: reading recipients, looking up devices, or the push providers themselves. The fix is different for each.</p>
`,
  },
];

export function formatPostDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
