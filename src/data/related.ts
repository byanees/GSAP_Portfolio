// Which case studies and notes cover the same work. Both pages link across, so a
// crawler or reader landing on either one finds the other.

export const POST_CASE_STUDIES: Record<string, string[]> = {
  "one-api-per-dashboard-short-ttl": ["backend-aggregation-layer", "qualification-certificate-workflow"],
  "request-to-pay-idempotency": ["request-to-pay"],
  "build-once-promote-by-tag": ["preprod-image-promotion"],
  "redis-connection-pool-exhaustion": ["redis-connection-multiplexing"],
  "emv-qr-tlv-encoding": ["request-to-pay"],
  "bulk-push-notification-scheduler": ["bulk-push-notification-scheduler"],
};

export const caseStudiesForPost = (postSlug: string): string[] => POST_CASE_STUDIES[postSlug] ?? [];

export const postsForCaseStudy = (caseStudySlug: string): string[] =>
  Object.entries(POST_CASE_STUDIES)
    .filter(([, studies]) => studies.includes(caseStudySlug))
    .map(([post]) => post);
