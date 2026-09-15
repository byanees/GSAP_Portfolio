import { Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import About3Page from "@/pages/About3Page";
import Archive4Page from "@/pages/Archive4Page";
import BlogDetailsPage from "@/pages/BlogDetailsPage";
import Contact2Page from "@/pages/Contact2Page";
import Home16Page from "@/pages/Home16Page";
import Portfolio3Page from "@/pages/Portfolio3Page";
import PortfolioDetails3Page from "@/pages/PortfolioDetails3Page";
import Services2Page from "@/pages/Services2Page";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout headerStyle={1} footerStyle={1} />}>
        <Route path="/" element={<Home16Page />} />
        <Route path="/index-16" element={<Home16Page />} />
      </Route>
      <Route element={<MainLayout headerStyle={2} footerStyle={2} />}>
        <Route path="/about-3" element={<About3Page />} />
        <Route path="/services-2" element={<Services2Page />} />
        <Route path="/portfolio-3" element={<Portfolio3Page />} />
        <Route path="/portfolio-details-3" element={<PortfolioDetails3Page />} />
        <Route path="/portfolio-details-3/:slug" element={<PortfolioDetails3Page />} />
        <Route path="/archive-4" element={<Archive4Page />} />
        <Route path="/blog-details" element={<BlogDetailsPage />} />
        <Route path="/blog-details/:slug" element={<BlogDetailsPage />} />
        <Route path="/contact-2" element={<Contact2Page />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
