

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import PricingPage from './pages/PricingPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CareersPage from './pages/CareersPage';
import JobDetailPage from './pages/JobDetailPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import EstimatorPage from './pages/EstimatorPage';
import TechStackPage from './pages/TechStackPage';
import SchedulePage from './pages/SchedulePage';
import LinkInBioPage from './pages/LinkInBioPage';
import ReferralPage from './pages/ReferralPage';
import GlossaryPage from './pages/GlossaryPage';
import NotFoundPage from './pages/NotFoundPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';
import ComparisonPage from './pages/ComparisonPage';
import MaintenancePage from './pages/MaintenancePage';
import WallOfLovePage from './pages/WallOfLovePage';
import ProcessPage from './pages/ProcessPage';
import StatusTrackerPage from './pages/StatusTrackerPage';
import ROICalculatorPage from './pages/ROICalculatorPage';
import ResourcesPage from './pages/ResourcesPage';
import QuizPage from './pages/QuizPage';
import SystemStatusPage from './pages/SystemStatusPage';
import EventsPage from './pages/EventsPage';
import OnboardingPage from './pages/OnboardingPage';
import IndustriesPage from './pages/IndustriesPage';
import PressKitPage from './pages/PressKitPage';
import TransformationsPage from './pages/TransformationsPage';
import StartupsPage from './pages/StartupsPage';
import WhiteLabelPage from './pages/WhiteLabelPage';
import DesignSystemPage from './pages/DesignSystemPage';
import LocationPage from './pages/LocationPage';
import ClientPortalPage from './pages/ClientPortalPage';
import PartnerApplicationPage from './pages/PartnerApplicationPage';
import TimelineGeneratorPage from './pages/TimelineGeneratorPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import NewsletterArchivePage from './pages/NewsletterArchivePage';
import InvoicesPage from './pages/InvoicesPage';
import DocumentsPage from './pages/DocumentsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:id" element={<JobDetailPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/estimator" element={<EstimatorPage />} />
            <Route path="/technologies" element={<TechStackPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/links" element={<LinkInBioPage />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/why-custom" element={<ComparisonPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/reviews" element={<WallOfLovePage />} />
            <Route path="/tracker" element={<StatusTrackerPage />} />
            <Route path="/roi-calculator" element={<ROICalculatorPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/status" element={<SystemStatusPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/press-kit" element={<PressKitPage />} />
            <Route path="/transformations" element={<TransformationsPage />} />
            <Route path="/startups" element={<StartupsPage />} />
            <Route path="/white-label" element={<WhiteLabelPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            
            {/* New Routes */}
            <Route path="/locations/:city" element={<LocationPage />} />
            <Route path="/portal" element={<ClientPortalPage />} />
            <Route path="/portal/invoices" element={<InvoicesPage />} />
            <Route path="/portal/documents" element={<DocumentsPage />} />
            <Route path="/partners/join" element={<PartnerApplicationPage />} />
            <Route path="/tools/timeline" element={<TimelineGeneratorPage />} />
            <Route path="/reviews/submit" element={<SubmitReviewPage />} />
            <Route path="/newsletter" element={<NewsletterArchivePage />} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;