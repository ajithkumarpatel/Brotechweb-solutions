

export interface Service {
  id: string;
  title: string;
  description: string;
  priceStart: string;
  icon: 'code' | 'layout' | 'database' | 'zap';
  longDescription?: string;
  features?: string[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  rating?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  // About Page Dynamic Content
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutStory?: string;
  aboutMission?: string;
  globalReachTitle?: string;
  globalReachDescription?: string;
}

// New Types
export interface Career {
  id: string;
  title: string;
  description: string;
  salary: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
}

export interface JobApplication {
  id?: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  message: string;
  submittedAt?: any;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  beforeImageUrl?: string; // For Before/After slider
  category: string;
  techStack: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  problem: string;
  solution: string;
  results: string;
  imageUrl: string;
  techStack: string[];
}

export interface EstimatorItem {
  id: string;
  label: string;
  price: number;
  category: 'project_type' | 'feature';
  icon: string;
}

export interface MeetingRequest {
  id?: string;
  name: string;
  email: string;
  topic: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  requestedAt?: any;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  order?: number;
}

export interface Announcement {
  text: string;
  link?: string;
  linkText?: string;
  enabled: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'page' | 'blog' | 'service' | 'project' | 'faq' | 'glossary';
  url: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
}

export interface ActiveProject {
  id: string;
  projectId: string; // The code the client enters, e.g. "PROJ-101"
  clientName: string;
  status: 'Discovery' | 'Design' | 'Development' | 'Testing' | 'Launch';
  progress: number; // 0-100
  lastUpdate: string;
  nextMilestone: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'E-Book' | 'Checklist' | 'Template';
  downloadUrl: string;
  imageUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Webinar' | 'Workshop' | 'Meetup';
  description: string;
  imageUrl?: string;
  registrationUrl?: string;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface BrandAsset {
  id: string;
  title: string;
  type: 'Logo' | 'Color' | 'Image' | 'Font';
  fileUrl: string;
  previewUrl?: string; // For images
  value?: string; // For hex codes
}

export interface OnboardingSubmission {
  id?: string;
  companyName: string;
  contactName: string;
  email: string;
  projectType: string;
  existingWebsite?: string;
  goals: string;
  driveLink?: string; // Link to their assets
  submittedAt?: any;
}

export interface StartupPackage {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
}

export interface StartupFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface WhiteLabelStep {
  id: string;
  title: string;
  description: string;
  stepNumber: number;
}

export interface DesignSystemColor {
  id: string;
  name: string;
  hex: string;
  bgClass?: string; // Optional helper for tailwind mapping if needed
}

export interface PartnerApplication {
  id?: string;
  name: string;
  email: string;
  role: string; // Developer, Designer, etc.
  portfolioUrl: string;
  hourlyRate: string;
  skills: string;
  submittedAt?: any;
}

export interface LocationData {
  id: string;
  citySlug: string; // e.g. 'new-york'
  cityName: string; // e.g. 'New York'
  heroTitle?: string;
  heroDescription?: string;
}

export interface TestimonialSubmission {
  id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageUrl?: string;
  submittedAt?: any;
}

export interface NewsletterIssue {
  id: string;
  subject: string;
  sentAt: string; // ISO date
  preview: string;
  contentUrl?: string; // Link to view online
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  downloadUrl?: string;
}

export interface ClientDocument {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'Image';
  date: string;
  downloadUrl: string;
  category?: 'Contract' | 'Scope' | 'Report';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  type?: string;
  createdAt: any; // Firestore Timestamp
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: any;
}

export type IconType = Service['icon'];