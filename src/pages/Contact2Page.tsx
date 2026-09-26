import PageMeta from "@/seo/PageMeta";
import { ROUTE_META } from "@/seo/siteConfig";
import { breadcrumbSchema, contactPageSchema, graph } from "@/seo/schema";
import { ContactForm, ContactHero } from "@/shared/sections/contact/ContactSections";

export default function Contact2Page() {
  return (
    <>
      <PageMeta
        title={ROUTE_META["/contact"].title}
        description={ROUTE_META["/contact"].description}
        path="/contact"
        jsonLd={graph(contactPageSchema(), breadcrumbSchema([{ name: "Contact", path: "/contact" }]))}
      />
      <ContactHero />
      <div className="at-banner-thumb overflow-hidden scale-up-img">
        <img className="img-cover scale-up" src="/assets/imgs/pages/img-119.webp" alt="" width={1920} height={800} loading="lazy" />
      </div>
      <ContactForm />
    </>
  );
}
