export interface TimelineEntry {
  title: string;
  date: Date | string; // Can be Date for sorting or string for period display
  description?: string;
  tags?: string[];
  content: string;
}

export const timelineEntries: TimelineEntry[] = [
  {
    title: "Buzzvil — Product & Experience Executive",
    date: "2014 – Present",
    description: "Seoul, South Korea",
    tags: [],
    content: `#### IPO & Platform Readiness (2022–Present)
• Led the organization's preparation for public listing by institutionalizing execution standards that maintain experience quality at scale.
• Reduced dependency on individual contributors by clarifying ownership, decision frameworks, and shared interaction primitives across teams.
• Improved UI delivery efficiency by aligning design intent more closely with engineering constraints and code-level abstractions.
• Shaped and launched new monetization experiences based on multi-mission rewarded interactions, supporting long-term engagement and retention.
• Strengthened senior design leadership and succession to ensure continuity, autonomy, and organizational resilience.

#### Product Pivot & Monetization Strategy (2019–2022)
• Led a critical company-wide pivot following a major platform policy change, transitioning the business from consumer-facing products to a diversified Offerwall and SDK-based monetization model.
• Owned product strategy end-to-end, from discovery through delivery, during a period of high execution pressure and strategic uncertainty.
• Designed and shipped server-driven UI capabilities that reduced engineering overhead and significantly accelerated partner integrations.
• Maintained experience quality as a competitive advantage while scaling delivery across multiple mission teams.
• Scaled and led distributed design teams during a fully remote operating period, with a focus on accountability and clarity over process.

#### Early Scaling & Foundation Building (2014–2018)
• Built the design function from the ground up as one of the company's earliest members.
• Redesigned the flagship consumer product and leveraged its success to create the first lockscreen SDK, enabling Buzzvil's entry into the B2B ecosystem.
• Established shared interaction standards, hiring principles, and execution practices that supported rapid growth without fragmentation.
• Identified and removed operational bottlenecks in creative production by designing automated review and validation workflows, allowing the team to shift focus from asset production to product innovation.
• Expanded design capabilities internationally, including hiring and supporting teams in Taiwan while maintaining system-level consistency across markets.`
  },
  {
    title: "CMS Group (3S Informatique) — UX Design Lead",
    date: "2011 – 2014",
    description: "Paris, France",
    tags: [],
    content: `• Embedded within a research lab at Arts et Métiers ParisTech, translating academic research into a commercial SaaS EdTech platform.
• Built a systemic UI foundation tightly aligned with production code to ensure consistency, speed, and maintainability across a complex learning management system.
• Co-authored and presented research at IASDR Tokyo on co-design and scenario validation methods, bridging academic frameworks with applied product development.`
  },
  {
    title: "Early Career & Education",
    date: "2005 – 2010",
    description: "",
    tags: [],
    content: `• Master's in Hypermedia Design (Interaction Design) — L'École de design Nantes Atlantique
• Research Master's in Virtual Reality & Innovation — Arts et Métiers ParisTech
• Founded an independent design practice while studying, delivering brand identities and web products for early-stage startups and learning client, technical, and delivery constraints firsthand.`
  }
].sort((a, b) => {
  // Extract year for sorting - use start year from period string or date
  const getYear = (entry: TimelineEntry): number => {
    if (typeof entry.date === 'string') {
      const match = entry.date.match(/\d{4}/);
      return match ? parseInt(match[0]) : 0;
    }
    return entry.date.getFullYear();
  };
  return getYear(b) - getYear(a);
});
