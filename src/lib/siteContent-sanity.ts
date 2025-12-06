import { sanityClient } from './sanityClient';

type PortableText = unknown[];

interface SiteSettingsDoc {
  title?: string;
  heroIntro?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  homeTeaser?: PortableText;
}

interface AboutPageDoc {
  title: string;
  subtitle?: string;
  body?: PortableText;
}

export async function getSiteSettings(): Promise<SiteSettingsDoc | null> {
  const query = `*[_type == "siteSettings"][0]{
    title,
    heroIntro,
    heroTitle,
    heroSubtitle,
    heroDescription,
    homeTeaser
  }`;
  return sanityClient.fetch<SiteSettingsDoc | null>(query);
}

export async function getAboutPage(): Promise<AboutPageDoc | null> {
  const query = `*[_type == "aboutPage"][0]{
    title,
    subtitle,
    body
  }`;
  return sanityClient.fetch<AboutPageDoc | null>(query);
}

