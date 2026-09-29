// src/config/MetaConfig.ts
import { BUSINESS_CONFIG } from "./BusinessConfig";

export interface PageMetadata {
  title: string;
  description: string;
  robots?: string;
}

export const META_CONFIG = {
  defaultTitle: BUSINESS_CONFIG.brandName,
  titleTemplate: `%s | ${BUSINESS_CONFIG.brandName}`,
  defaultDescription: `Find your dream home with ${BUSINESS_CONFIG.brandName}. Expert real estate services and exclusive property listings.`,

  pages: {
    home: {
      title: "Home",
      description:
        "Discover the best properties for buy and rent. Expert real estate services, property management, and investment insights all in one place.",
    },
    properties: {
      title: "Available Properties",
      description:
        "Find your dream home, lot, or commercial space. Browse our updated list of properties available for sale and rent in the most sought-after locations.",
    },
    team: {
      title: "Our Expert Team",
      description:
        "Meet our dedicated real estate professionals committed to helping you navigate the market with ease and expertise.",
    },

    contact: {
      title: "Work With Us & Contact",
      description:
        "Ready to collaborate? Whether you are a homeowner selling, a landlord listing a rental, or an agent joining our network, get in touch for expert partnership and support.",
    },

    loan: {
      title: "Loan & Financing Services",
      description:
        "Explore flexible home loan options and financial assistance. We help you secure the best mortgage rates to make your property ownership dreams a reality.",
    },
    content: {
      title: "Blog & Insights",
      description:
        "Stay updated with the latest real estate trends, market insights, and community news from our expert contributors.",
    },
    admin: {
      title: "Admin Portal",
      description: "Secure management login for authorized personnel only.",
      robots: "noindex, nofollow",
    },
    adminDashboard: {
      title: "Management Dashboard",
      description: "Internal property and team management system.",
      robots: "noindex, nofollow",
    },
    notFound: {
      title: "404 - Page Not Found",
      description:
        "The page you are looking for does not exist or has been moved.",
      robots: "noindex, nofollow",
    },
  },
};
