import PageMeta from "@/seo/PageMeta";
import Section1 from "@/shared/sections/services-2/Section1";
import Section2 from "@/shared/sections/services-2/Section2";
import Section3 from "@/shared/sections/services-2/Section3";
import Recommendations from "@/shared/sections/dev/Recommendations";
import WorkWithMe from "@/shared/sections/dev/WorkWithMe";

export default function Services2Page() {
  return (
    <>
      <PageMeta title="Muhammad Anees — Work With Me" />
      <Section1 />
      <Section2 />
      <WorkWithMe />
      <Recommendations muted />
      <Section3 />
    </>
  );
}
