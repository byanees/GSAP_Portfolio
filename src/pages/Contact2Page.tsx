import PageMeta from "@/seo/PageMeta";
import { ContactForm, ContactHero } from "@/shared/sections/contact/ContactSections";

export default function Contact2Page() {
  return (
    <>
      <PageMeta title="Muhammad Anees — Contact" />
      <ContactHero />
      <div className="at-banner-thumb overflow-hidden scale-up-img">
        <img className="img-cover scale-up" data-speed=".4" src="/assets/imgs/pages/img-119.webp" alt="Muhammad Anees" width={1920} height={800} loading="lazy" />
      </div>
      <ContactForm />
    </>
  );
}
