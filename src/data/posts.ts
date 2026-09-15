// Blog posts, written directly into the site (no database).

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
    slug: "redis-connection-pool-exhaustion",
    title: "What 600k concurrent sessions taught me about Redis connections",
    excerpt:
      "Pool exhaustion rarely starts in Redis itself. It starts in how the application opens connections. Here's the multiplexing approach behind keeping agent apps up at peak.",
    category: "Backend",
    date: "2026-08-18",
    readTime: "6 min read",
    tags: [".NET", "Redis", "Performance"],
    bodyHtml: `
<p>During peak traffic on the telecom agent apps I worked on at DPL, the Redis layer started failing in a way that looked like a capacity problem. It wasn't. With 600k+ concurrent sessions, the application was running out of connections long before Redis ran out of headroom.</p>

<h2>Why connection pools run dry</h2>
<p>Most Redis clients are cheap to call and expensive to connect. Every new TCP connection costs a handshake, authentication, and a slot on the server. When connections scale with traffic instead of staying flat, nobody notices at normal load. At peak, requests queue for a connection, time out, and retry, which makes the queue even longer. The usual culprits:</p>
<ul>
  <li>Creating a client per request, or per scoped service</li>
  <li>Blocking calls like <code>.Result</code> and <code>.Wait()</code> that pin threads while they wait on Redis</li>
  <li>Heavy, long-running commands sharing connections with hot-path reads</li>
</ul>

<h2>Multiplexing instead of pooling</h2>
<p>In .NET, <code>StackExchange.Redis</code> is built around a multiplexer: one long-lived connection object shared by many concurrent operations. Commands are pipelined over the same socket, so thousands of callers don't need thousands of connections. The fix is less about tuning a pool and more about treating the connection as application-wide infrastructure.</p>
<pre><code>// Program.cs: one multiplexer for the whole app
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
  <li><strong>Watch connection counts, not just latency.</strong> A flat connection graph during a traffic spike is the signal that the fix is working.</li>
</ul>

<h2>The takeaway</h2>
<p>When a cache falls over under load, look at how the application talks to it before scaling the cache. The answer is often not a bigger Redis, but fewer, shared connections, used asynchronously.</p>
`,
  },
  {
    slug: "emv-qr-tlv-encoding",
    title: "Encoding EMV QR payloads with TLV, step by step",
    excerpt:
      "An EMV merchant QR code is a string of tag-length-value fields with a checksum at the end. Here's how the format works, and how to build one in C#.",
    category: "Fintech",
    date: "2026-07-21",
    readTime: "7 min read",
    tags: ["EMV QR", "C#", "Payments"],
    bodyHtml: `
<p>When I designed a P2P QR payment system at DPL, the first requirement was interoperability: any compliant app should be able to read any compliant code. That's what the EMVCo QR Code specification is for. Under the pixels, the payload is a plain string built from TLV fields.</p>

<h2>Tag, length, value</h2>
<p>Every field has three parts: a two-digit ID, a two-digit length, and the value. The ID <code>59</code> with the value <code>ANEES STORE</code> (11 characters) becomes <code>5911ANEES STORE</code>. Some fields contain nested TLV fields of their own, like merchant account information. The ones you'll use most:</p>
<ul>
  <li><code>00</code> Payload format indicator, always <code>01</code></li>
  <li><code>01</code> Point of initiation: <code>11</code> for static, <code>12</code> for dynamic</li>
  <li><code>26</code>–<code>51</code> Merchant account information (nested TLV)</li>
  <li><code>52</code> Merchant category code</li>
  <li><code>53</code> Transaction currency, ISO 4217 numeric (for example <code>834</code> for TZS)</li>
  <li><code>54</code> Transaction amount, used in dynamic codes</li>
  <li><code>58</code> Country code, <code>59</code> merchant name, <code>60</code> merchant city</li>
  <li><code>63</code> CRC, always the last field</li>
</ul>

<h2>Static vs dynamic</h2>
<p>A static code (<code>01</code> = <code>11</code>) is printed once and reused, and the payer enters the amount. A dynamic code (<code>01</code> = <code>12</code>) is generated per transaction and carries the amount in field <code>54</code>, which is what checkout flows and payment requests need.</p>

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
  <li><strong>Lengths are character counts.</strong> Validate merchant names and cities before encoding, and keep them within the spec's limits.</li>
  <li><strong>Parse, don't split.</strong> Read the ID and length, then consume exactly that many characters. Values can contain digits that look like tags.</li>
  <li><strong>Verify the CRC first</strong> when scanning, before trusting any field in the payload.</li>
  <li><strong>Treat nested templates as their own TLV strings</strong>, with their own lengths.</li>
</ul>
<p>Once the encoder and parser are solid and well tested, everything built on top of them, from merchant onboarding to request-to-pay flows, gets simpler.</p>
`,
  },
  {
    slug: "bulk-push-notification-scheduler",
    title: "Sending 800k push notifications in under 8 minutes",
    excerpt:
      "A bulk notification job is a throughput problem with a deadline. Here's how I think about batching, platform targeting, and multilingual payloads.",
    category: "Architecture",
    date: "2026-06-16",
    readTime: "6 min read",
    tags: [".NET", "Messaging", "Scalability"],
    bodyHtml: `
<p>At DPL I built a scheduler that dispatches 700–800k push notifications per run in 6–8 minutes, to Android and Huawei (HMS) devices, in multiple languages. Sending one notification is easy. Sending hundreds of thousands without falling over, and without anyone receiving the same message twice, is the interesting part.</p>

<h2>Start from the deadline</h2>
<p>800k messages in 8 minutes is roughly 1,700 per second, sustained. That one number drives most of the design: batch size, how many workers run in parallel, and how much headroom is left for retries. Doing the arithmetic first saves a lot of guessing later.</p>

<h2>Split the audience before sending</h2>
<ul>
  <li><strong>By platform.</strong> Android and HMS devices go through different push services with different payload shapes and limits, so each gets its own path.</li>
  <li><strong>By language.</strong> Resolve each recipient's language up front and render one payload per language, instead of templating every message individually.</li>
  <li><strong>Into batches.</strong> Page through recipients in fixed-size chunks rather than loading the whole audience into memory.</li>
</ul>

<h2>Keep workers boring</h2>
<p>A worker takes a batch, sends it, records the outcome, and moves on. Stateless workers are easy to scale out and safe to restart mid-run.</p>
<pre><code>await Parallel.ForEachAsync(
    recipientBatches,                       // IAsyncEnumerable&lt;Batch&gt;
    new ParallelOptions { MaxDegreeOfParallelism = workerCount },
    async (batch, ct) =&gt;
    {
        var payload = templates.For(batch.Platform, batch.Language);
        var result = await senders[batch.Platform].SendAsync(batch.Tokens, payload, ct);
        await outcomes.RecordAsync(batch.Id, result, ct);
    });</code></pre>

<h2>Plan for partial failure</h2>
<ul>
  <li><strong>Record progress per batch</strong>, so a crashed run can resume where it stopped instead of starting over.</li>
  <li><strong>Retry transient errors with backoff</strong>, and drop tokens the push service reports as invalid so the next run is faster.</li>
  <li><strong>Respect provider limits.</strong> Throttling yourself is cheaper than being throttled.</li>
</ul>

<h2>Measure the run, not just the send</h2>
<p>The numbers that matter are end to end: total duration, messages per second over time, failure rate by platform, and time spent on retries. When run time creeps up, they show whether the bottleneck is reading recipients, rendering payloads, or the push services themselves.</p>
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
