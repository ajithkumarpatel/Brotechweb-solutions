

import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, addDoc, serverTimestamp, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Service, PricingTier, Testimonial, BlogPost, SiteContent, Career, Project, FAQ, TeamMember, CaseStudy, EstimatorItem, MeetingRequest, Stat, Announcement, GlossaryTerm, ActiveProject, Resource, Event, Industry, BrandAsset, StartupPackage, StartupFAQ, WhiteLabelStep, DesignSystemColor, PartnerApplication, LocationData, TestimonialSubmission, NewsletterIssue, Invoice, ClientDocument } from '../types';

const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: "Brotech WebSolutions",
  heroSubtitle: "Building the Future of the Web",
  heroTagline: "Fast. Reliable. Scalable.",
  contactEmail: "hello@brotech.com",
  contactPhone: "+1 (555) 123-4567",
  contactAddress: "123 Tech Avenue, Silicon Valley, CA",
  // Default About Page Content
  aboutTitle: "We Are Brotech",
  aboutSubtitle: "A passionate team of developers, designers, and strategists dedicated to building the future of the web.",
  aboutStory: "Founded in 2018, Brotech WebSolutions started with a simple mission: to make high-quality web technology accessible to businesses of all sizes. What began as a small freelance operation has grown into a full-service agency with clients across the globe.",
  aboutMission: "We believe in transparency, speed, and code quality. We don't just build websites; we build digital infrastructures that scale with your business.",
  globalReachTitle: "Global Reach",
  globalReachDescription: "Serving clients remotely from Silicon Valley to Singapore."
};

// Generic hook to fetch a collection real-time
export function useCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError("Access denied. Please check Firestore Rules.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}

// Hook for singleton document (site_content/main)
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'site_content', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Map potential field variations to the SiteContent interface
          setContent({
            heroTitle: data.heroTitle || DEFAULT_SITE_CONTENT.heroTitle,
            heroSubtitle: data.heroSubtitle || DEFAULT_SITE_CONTENT.heroSubtitle,
            heroTagline: data.heroTagline || DEFAULT_SITE_CONTENT.heroTagline,
            contactEmail: data.contactEmail || data.email || DEFAULT_SITE_CONTENT.contactEmail,
            contactPhone: data.contactPhone || data.phone || DEFAULT_SITE_CONTENT.contactPhone,
            contactAddress: data.contactAddress || data.address || data.location || DEFAULT_SITE_CONTENT.contactAddress,
            
            // About Page Mappings
            aboutTitle: data.aboutTitle || DEFAULT_SITE_CONTENT.aboutTitle,
            aboutSubtitle: data.aboutSubtitle || DEFAULT_SITE_CONTENT.aboutSubtitle,
            aboutStory: data.aboutStory || DEFAULT_SITE_CONTENT.aboutStory,
            aboutMission: data.aboutMission || DEFAULT_SITE_CONTENT.aboutMission,
            globalReachTitle: data.globalReachTitle || DEFAULT_SITE_CONTENT.globalReachTitle,
            globalReachDescription: data.globalReachDescription || DEFAULT_SITE_CONTENT.globalReachDescription
          });
        } else {
          setContent(DEFAULT_SITE_CONTENT);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching site content (using default):", err);
        setContent(DEFAULT_SITE_CONTENT);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { content, loading };
}

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'site_content', 'announcement'),
      (docSnap) => {
        if (docSnap.exists()) {
          setAnnouncement(docSnap.data() as Announcement);
        } else {
          setAnnouncement(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching announcement:", err);
        setAnnouncement(null);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { announcement, loading };
}

// Write functions
export const submitJobApplication = async (data: any) => {
  try {
    await addDoc(collection(db, 'jobApplications'), {
      ...data,
      submittedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting application", error);
    return { success: false, error };
  }
};

export const subscribeNewsletter = async (email: string) => {
  try {
    await addDoc(collection(db, 'subscribers'), {
      email,
      subscribedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const sendChatMessage = async (message: string, userId: string) => {
  try {
    await addDoc(collection(db, 'messages'), {
      text: message,
      userId,
      createdAt: serverTimestamp(),
      isAdmin: false
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// Reuse messages collection for contact form since it has open create permissions
export const submitContactMessage = async (data: any) => {
  try {
    await addDoc(collection(db, 'messages'), {
      ...data,
      type: 'contact_form_submission', 
      createdAt: serverTimestamp(),
      isAdmin: false
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form", error);
    return { success: false, error };
  }
};

export const requestMeeting = async (data: Omit<MeetingRequest, 'id' | 'status'>) => {
  try {
    await addDoc(collection(db, 'meeting_requests'), {
      ...data,
      status: 'pending',
      requestedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error requesting meeting", error);
    return { success: false, error };
  }
};

export const submitReferral = async (data: any) => {
  try {
    await addDoc(collection(db, 'messages'), {
      ...data,
      type: 'referral',
      submittedAt: serverTimestamp(),
      isAdmin: false
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting referral", error);
    return { success: false, error };
  }
};

export const submitOnboarding = async (data: any) => {
  try {
    await addDoc(collection(db, 'onboarding'), {
      ...data,
      submittedAt: serverTimestamp(),
      status: 'new'
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting onboarding", error);
    return { success: false, error };
  }
};

export const submitPartnerApplication = async (data: PartnerApplication) => {
  try {
    await addDoc(collection(db, 'partner_applications'), {
      ...data,
      submittedAt: serverTimestamp(),
      status: 'new'
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting partner app", error);
    return { success: false, error };
  }
};

export const submitTestimonial = async (data: TestimonialSubmission) => {
  try {
    await addDoc(collection(db, 'testimonial_submissions'), {
      ...data,
      submittedAt: serverTimestamp(),
      status: 'pending'
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting testimonial", error);
    return { success: false, error };
  }
};

export const getProjectStatus = async (projectId: string) => {
  // 1. Check for Demo ID immediately to avoid DB calls/Permissions for the demo
  if (projectId === "DEMO-123") {
    return {
      success: true,
      data: {
        id: "demo",
        projectId: "DEMO-123",
        clientName: "Demo Client",
        status: "Development",
        progress: 65,
        lastUpdate: "Frontend implementation 80% complete. Moving to API integration.",
        nextMilestone: "User Acceptance Testing (UAT)"
      } as ActiveProject
    };
  }

  try {
    const q = query(collection(db, 'active_projects'), where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: true, data: null };
    }
    
    // Return the first match
    const doc = querySnapshot.docs[0];
    return { success: true, data: { id: doc.id, ...doc.data() } as ActiveProject };
  } catch (error: any) {
    console.error("Error fetching project status", error);
    return { success: false, error: error.message || "Unknown error" };
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting doc", error);
    return { success: false, error };
  }
};

export function useLocationData(citySlug: string) {
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Try to fetch specific location data
    const fetchLocation = async () => {
      try {
        const q = query(collection(db, 'locations'), where("citySlug", "==", citySlug.toLowerCase()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setData({ id: doc.id, ...doc.data() } as LocationData);
        } else {
          // If no specific data in DB, use smart fallback based on URL
          // This ensures the page works even without Admin input
          const formattedCity = citySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          setData({
            id: 'fallback',
            citySlug: citySlug,
            cityName: formattedCity,
            heroTitle: `Web Design & Development in ${formattedCity}`,
            heroDescription: `Brotech WebSolutions provides top-tier digital services for businesses in ${formattedCity}. Local expertise, global standards.`
          });
        }
      } catch (e) {
        console.error("Error fetching location", e);
        // Fallback on error too
        const formattedCity = citySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        setData({
            id: 'fallback',
            citySlug: citySlug,
            cityName: formattedCity,
            heroTitle: `Web Design & Development in ${formattedCity}`,
            heroDescription: `Brotech WebSolutions provides top-tier digital services for businesses in ${formattedCity}.`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [citySlug]);

  return { data, loading };
}

// Existing Hooks
export function useServices() { return useCollection<Service>('services'); }
export function usePricing() { return useCollection<PricingTier>('pricing'); }
export function useTestimonials() { return useCollection<Testimonial>('testimonials'); }
export function usePosts() { return useCollection<BlogPost>('posts'); }

// New Hooks
export function useCareers() { return useCollection<Career>('careers'); }
export function useProjects() { return useCollection<Project>('projects'); }
export function useFAQs() { return useCollection<FAQ>('faqs'); }
export function useCaseStudies() { return useCollection<CaseStudy>('caseStudies'); }
export function useEstimatorItems() { return useCollection<EstimatorItem>('estimator_items'); }
export function useStats() { return useCollection<Stat>('stats'); }

export function useTeam() { 
  const { data, loading, error } = useCollection<TeamMember>('team');
  const defaultTeam: TeamMember[] = [
    { id: '1', name: 'Sarah Johnson', role: 'CEO & Founder', bio: 'Visionary leader with 15 years of tech experience.', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
    { id: '2', name: 'Michael Chen', role: 'CTO', bio: 'Full-stack expert obsessed with scalable architecture.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
    { id: '3', name: 'Emily Davis', role: 'Lead Designer', bio: 'Creating beautiful, intuitive user experiences.', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400' },
    { id: '4', name: 'David Wilson', role: 'Head of Marketing', bio: 'Growth hacker connecting brands with audiences.', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
  ];
  return { data: data.length > 0 ? data : defaultTeam, loading, error }; 
}

export function useGlossary() { 
  const { data, loading, error } = useCollection<GlossaryTerm>('glossary');
  const defaultGlossary: GlossaryTerm[] = [
    { id: '1', term: 'API', definition: 'Application Programming Interface - allows different software to talk to each other.', category: 'Development' },
    { id: '2', term: 'SEO', definition: 'Search Engine Optimization - the practice of increasing traffic to your website via organic search results.', category: 'Marketing' },
    { id: '3', term: 'React', definition: 'A JavaScript library for building user interfaces, maintained by Meta.', category: 'Frontend' },
  ];
  return { data: data.length > 0 ? data : defaultGlossary, loading, error }; 
}

export function useResources() {
  const { data, loading, error } = useCollection<Resource>('resources');
  
  const defaultResources: Resource[] = [
    { id: '1', title: 'The Ultimate SEO Checklist 2024', description: 'Ensure your website ranks #1 on Google with our comprehensive 50-point checklist.', type: 'Checklist', downloadUrl: '#' },
    { id: '2', title: 'Web Development Cost Guide', description: 'How to budget for your next big project without getting ripped off.', type: 'E-Book', downloadUrl: '#' },
    { id: '3', title: 'Security Best Practices', description: 'Keep your customer data safe with these mandatory protocols.', type: 'PDF', downloadUrl: '#' },
  ];
  return { data: data.length > 0 ? data : defaultResources, loading, error }; 
}

export function useEvents() {
  const { data, loading, error } = useCollection<Event>('events');

  const defaultEvents: Event[] = [
    { id: '1', title: 'Modern Web Architecture Summit', date: '2024-06-15', time: '14:00 EST', type: 'Webinar', description: 'Learn how to scale applications using Next.js and Firebase.', imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400' },
    { id: '2', title: 'SEO Masterclass', date: '2024-06-22', time: '10:00 EST', type: 'Workshop', description: 'Practical tips to double your organic traffic in 30 days.', imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=400' },
  ];
  return { data: data.length > 0 ? data : defaultEvents, loading, error };
}

export function useIndustries() {
  const { data, loading, error } = useCollection<Industry>('industries');
  const defaultIndustries: Industry[] = [
      { id: '1', name: 'Healthcare', description: 'HIPAA-compliant platforms for hospitals and clinics.', icon: 'activity' },
      { id: '2', name: 'Real Estate', description: 'High-conversion listings and property management portals.', icon: 'home' },
      { id: '3', name: 'E-Commerce', description: 'Scalable online stores built on Shopify and Custom stacks.', icon: 'shopping-bag' }
  ];
  return { data: data.length > 0 ? data : defaultIndustries, loading, error };
}

export function useBrandAssets() {
  const { data, loading, error } = useCollection<BrandAsset>('brand_assets');
  const defaultAssets: BrandAsset[] = [
      { id: '1', title: 'Primary Logo', type: 'Logo', fileUrl: '#', previewUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Logo' },
      { id: '2', title: 'Brand Blue', type: 'Color', fileUrl: '#', value: '#2563EB' },
  ];
  return { data: data.length > 0 ? data : defaultAssets, loading, error };
}

// New Dynamic Hooks for Startups & Design System
export function useStartupPackages() {
  const { data, loading, error } = useCollection<StartupPackage>('startup_packages');
  const defaultPackages: StartupPackage[] = [
    {
      id: '1', name: 'Clickable Prototype', subtitle: 'For fundraising & validation', price: '$2,500', priceSuffix: '/ one-time',
      features: ['High-fidelity Figma Design', 'Interactive Click-flow', 'User Journey Map', '1 Week Delivery'], isPopular: false, ctaText: 'Select Plan'
    },
    {
      id: '2', name: 'MVP Launch', subtitle: 'Get to market fast', price: '$8,000', priceSuffix: '/ starting',
      features: ['Core Feature Development', 'Auth & Database Setup', 'Payment Integration (Stripe)', 'Admin Dashboard', '4 Week Delivery'], isPopular: true, ctaText: 'Start Building'
    },
    {
      id: '3', name: 'Scale-Up', subtitle: 'Post-launch growth', price: '$15k+', priceSuffix: '/ custom',
      features: ['Advanced Features', 'Mobile App (iOS/Android)', 'AI Integration', 'Dedicated Team'], isPopular: false, ctaText: 'Talk to Us'
    }
  ];
  return { data: data.length > 0 ? data : defaultPackages, loading, error };
}

export function useStartupFAQs() {
  const { data, loading, error } = useCollection<StartupFAQ>('startup_faqs');
  const defaultFAQs: StartupFAQ[] = [
    { id: '1', question: 'Do you take equity?', answer: 'No. We are a service provider. You own 100% of the code and IP from day one.' },
    { id: '2', question: 'What tech stack do you use?', answer: 'We stick to industry standards: React, Node.js, Firebase/Postgres, and Tailwind CSS.' },
    { id: '3', question: 'Can you sign an NDA?', answer: 'Absolutely. We are happy to sign an NDA before you share your idea.' },
  ];
  return { data: data.length > 0 ? data : defaultFAQs, loading, error };
}

export function useWhiteLabelSteps() {
  const { data, loading, error } = useCollection<WhiteLabelStep>('white_label_steps');
  const defaultSteps: WhiteLabelStep[] = [
    { id: '1', stepNumber: 1, title: 'You Sell It', description: 'You handle the client relationship, sales, and strategy. You close the deal.' },
    { id: '2', stepNumber: 2, title: 'We Build It', description: 'We develop the project using modern tech stacks. We provide weekly white-label updates you can forward to your client.' },
    { id: '3', stepNumber: 3, title: 'You Take Credit', description: 'We hand over the code and credentials. You launch the project and look like a rockstar.' },
  ];
  return { data: data.length > 0 ? data.sort((a,b) => a.stepNumber - b.stepNumber) : defaultSteps, loading, error };
}

export function useDesignColors() {
  const { data, loading, error } = useCollection<DesignSystemColor>('design_system_colors');
  const defaultColors: DesignSystemColor[] = [
    { id: '1', name: 'Blue 600', hex: '#2563EB', bgClass: 'bg-blue-600' },
    { id: '2', name: 'Blue 700', hex: '#1D4ED8', bgClass: 'bg-blue-700' },
    { id: '3', name: 'Slate 900', hex: '#0F172A', bgClass: 'bg-slate-900' },
    { id: '4', name: 'Slate 800', hex: '#1E293B', bgClass: 'bg-slate-800' },
    { id: '5', name: 'Green 500', hex: '#22C55E', bgClass: 'bg-green-500' },
    { id: '6', name: 'Red 500', hex: '#EF4444', bgClass: 'bg-red-500' },
    { id: '7', name: 'Orange 500', hex: '#F97316', bgClass: 'bg-orange-500' },
    { id: '8', name: 'Purple 600', hex: '#9333EA', bgClass: 'bg-purple-600' },
  ];
  return { data: data.length > 0 ? data : defaultColors, loading, error };
}

export function useNewsletters() {
  const { data, loading, error } = useCollection<NewsletterIssue>('newsletters');
  // Fallback data
  const defaultNewsletters: NewsletterIssue[] = [
      { id: '1', subject: 'October Product Update: AI Tools', sentAt: '2023-10-15', preview: 'Discover how we are integrating AI into our workflow to speed up delivery times by 40%.', contentUrl: '#' },
      { id: '2', subject: 'The Future of Headless CMS', sentAt: '2023-09-01', preview: 'Why we are moving all new enterprise projects to Sanity and Contentful.', contentUrl: '#' },
      { id: '3', subject: 'Client Success: Scaling to 1M Users', sentAt: '2023-08-12', preview: 'A deep dive into the infrastructure changes required to handle massive traffic spikes.', contentUrl: '#' }
  ];
  return { data: data.length > 0 ? data.sort((a,b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()) : defaultNewsletters, loading, error };
}

export function useInvoices() {
  const { data, loading, error } = useCollection<Invoice>('invoices');
  const defaultInvoices: Invoice[] = [
    { id: '1', invoiceNumber: 'INV-2024-001', description: 'Website Deposit (50%)', amount: '$2,500.00', status: 'Paid', date: '2024-10-15', downloadUrl: '#' },
    { id: '2', invoiceNumber: 'INV-2024-002', description: 'Hosting Setup', amount: '$150.00', status: 'Paid', date: '2024-10-20', downloadUrl: '#' },
    { id: '3', invoiceNumber: 'INV-2024-003', description: 'Milestone 2: Design Approval', amount: '$2,500.00', status: 'Pending', date: '2024-11-01', downloadUrl: '#' }
  ];
  return { data: data.length > 0 ? data : defaultInvoices, loading, error };
}

export function useClientDocuments() {
  const { data, loading, error } = useCollection<ClientDocument>('client_docs');
  const defaultDocs: ClientDocument[] = [
    { id: '1', title: 'Master Services Agreement', type: 'PDF', category: 'Contract', date: '2024-10-10', downloadUrl: '#' },
    { id: '2', title: 'Project Scope - Phase 1', type: 'PDF', category: 'Scope', date: '2024-10-12', downloadUrl: '#' },
    { id: '3', title: 'Brand Guidelines', type: 'PDF', category: 'Report', date: '2024-10-25', downloadUrl: '#' },
    { id: '4', title: 'NDA', type: 'PDF', category: 'Contract', date: '2024-10-01', downloadUrl: '#' }
  ];
  return { data: data.length > 0 ? data : defaultDocs, loading, error };
}