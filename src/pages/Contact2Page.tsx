import PageMeta from "@/seo/PageMeta";
import { ContactForm, ContactHero } from "@/shared/sections/contact/ContactSections";

export default function Contact2Page() {
  return (
    <>
      <PageMeta title="Muhammad Anees — Contact" />
      <ContactHero />
      <div className="container">
        <div className="border-bottom-100" />
      </div>
      <ContactForm />
    </>
  );
}
