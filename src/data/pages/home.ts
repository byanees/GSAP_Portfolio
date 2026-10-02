// Home page copy. The lead paragraph is PROFILE.heroLead, the expertise cards
// are EXPERTISE, and the case study cards are CASE_STUDIES.

import { METRICS } from "../metrics";
import { PROFILE } from "../profile";

export const HOME = {
    hero: {
        tagline: `${PROFILE.role}, based in ${PROFILE.city}`,
        headline: "I build payment platforms and backend systems that hold up under real traffic.",
        /** Under each number: a link to the case study that backs it. */
        proofCue: "Read the case study",
        /** The three numbers worth leading with. Rendered as-is, never counted
         *  up: a range and a floor would show a wrong number on every frame. */
        proof: [
            {
                figure: METRICS.notificationsPerRun,
                label: `push notifications dispatched per run, in ${METRICS.runMinutes} minutes`,
                slug: "bulk-push-notification-scheduler",
            },
            {
                figure: METRICS.concurrentSessions,
                label: "concurrent sessions held after moving Redis to one multiplexed connection",
                slug: "redis-connection-multiplexing",
            },
            {
                figure: METRICS.merchants,
                label: "merchants adopted Request to Pay, over app and USSD",
                slug: "request-to-pay",
            },
        ],
    },
    whatIDo: {
        title: "Building scalable backends, modern frontends, and reliable fintech systems.",
        lead: "Clean, testable systems built to scale, from the API contract to the dashboard.",
        tagsLabel: "Tools I use",
    },
    caseStudies: {
        eyebrow: "case studies",
        title: "Production systems, with the numbers to show for it",
        lead: (total: number) => `Three of ${total}. The rest are on the work page.`,
        cta: "All work",
        moreLabel: "More case studies",
    },
    notes: {
        eyebrow: "notes",
        title: "Latest from the blog",
        cta: "All notes",
    },
    recommendations: {
        title: "What colleagues say",
        cta: "Read them on LinkedIn",
    },
    /** Also closes the portfolio page. The availability line is AVAILABILITY. */
    cta: {
        title: "Building something that has to work on the first attempt?",
    },
    /** The intro reel. Its headline words are choreographed to the music in
     *  ReelPlayer and stay there; the figures come from METRICS. */
    reel: {
        hookCaption: `push notifications · one run · ${METRICS.runMinutes} min`,
        stats: [
            { value: METRICS.concurrentSessions, label: "concurrent sessions on one Redis connection" },
            { value: METRICS.merchants, label: "merchants paid through Request to Pay" },
            { value: METRICS.agents, label: "telco agents across Tanzania" },
        ],
    },
};
