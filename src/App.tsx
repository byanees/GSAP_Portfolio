import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ScrollToTop from "@/shared/effects/ScrollToTop";
import About3Page from "@/pages/About3Page";
import Archive4Page from "@/pages/Archive4Page";
import BlogDetailsPage from "@/pages/BlogDetailsPage";
import Contact2Page from "@/pages/Contact2Page";
import Home16Page from "@/pages/Home16Page";
import Portfolio3Page from "@/pages/Portfolio3Page";
import PortfolioDetails3Page from "@/pages/PortfolioDetails3Page";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout headerStyle={1} footerStyle={1} />}>
          <Route path="/" element={<Home16Page />} />
        </Route>
        <Route element={<MainLayout headerStyle={2} footerStyle={2} />}>
          <Route path="/about" element={<About3Page />} />
          <Route path="/services" element={<Navigate to="/about" replace />} />
          <Route path="/portfolio" element={<Portfolio3Page />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetails3Page />} />
          <Route path="/blog" element={<Archive4Page />} />
          <Route path="/blog/:slug" element={<BlogDetailsPage />} />
          <Route path="/contact" element={<Contact2Page />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
