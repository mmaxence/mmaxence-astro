// Work page entries. Use public facts or information explicitly supplied by Max.
// Lines marked TODO(Max) need his wording or a public source before this ships.

export interface WorkLink { label: string; url: string }

export interface WorkEntry {
  slug: string;
  title: string;
  kicker: string; // the angle, one line under the title
  years: string;
  context: string;
  group: 'independent' | 'company';
  imageCaption?: string;
  imageWidth?: number;
  imageHeight?: number;
  imagePairAlt?: string;
  imagePairHeight?: number;
  call: string; // what deserved to exist, and why then
  foundation: string; // the system, format or tool built so it could exist more than once
  shipped: string; // what shipped on it, by whom
  image?: string; // public path; omitted = a text-led entry
  imageAlt?: string;
  imagePair?: string; // optional second image (v1 next to current, or two brands on one recipe)
  links?: WorkLink[];
  sections?: { title: string; paragraphs: string[] }[];
}

export const workEntries: WorkEntry[] = [
  {
    slug: 'hanji',
    title: 'Hanji',
    kicker: 'A thin surface between people and agents',
    years: 'Ongoing',
    group: 'independent',
    context: 'Independent lab · Product & interaction design',
    call: 'Agents can produce documents and move work forward. People still need a clear way to read, question and shape what happens. Hanji is my experimental lab for that surface.',
    foundation: 'A lab that adapts its shape to different kinds of collaboration. Knowledge gives agent-created documents and shared knowledge a human-friendly home. Tracker explores a visual task canvas and conversations with agents.',
    shipped: 'Knowledge is in closed beta; Tracker is in alpha. Both are available by contacting me for access. Open source is the direction, with public releases still ahead.',
    sections: [
      { title: 'Knowledge: a place to read', paragraphs: ['The first experiment focuses on the documents agents create. Knowledge gives that material a surface people can read and share, so collaboration can continue around the work itself.'] },
      { title: 'Tracker: a place to work together', paragraphs: ['The second experiment moves from shared knowledge to shared work. A visual task canvas makes the work visible, while agent conversations give people a way to discuss and shape it.'] },
    ],
    image: '/work/hanji/tracker-canvas.webp',
    imageAlt: 'Hanji Tracker canvas showing task dependencies above an agent conversation input',
    imageWidth: 1440,
    imageHeight: 960,
    imageCaption: 'Tracker · An illustrative workspace, with fictional tasks and people.',
    links: [{ label: 'Explore Hanji', url: 'https://hanji.ink' }],
  },
  {
    slug: 'interaction-composer',
    title: 'The interaction composer',
    kicker: 'An agent assembling ads from a library it can read',
    // TODO(Max): explain why the model was retired using public wording.
    years: '2025 – 2026',
    group: 'company',
    context: 'Buzzvil · Design systems',
    call: 'One creative per campaign could not scale to one experience per person. The composing had to move from a designer per screen to a system an agent reads.',
    foundation: 'A design library structured for an agent: tokens, components, recipes and the manifests that describe them, with one brand seed theming the whole set. The composer turns a chosen recipe into a rendered, on-brand interaction.',
    shipped: 'The first agent-assembled campaign went live in May 2026.',
    image: '/blog/a-design-system-for-an-agent/ox-quiz-skincare.jpg',
    imagePair: '/blog/a-design-system-for-an-agent/ox-quiz-streetwear.jpg',
    imageAlt: 'O/X quiz recipe rendered for a skincare brand',
    imagePairAlt: 'The same O/X quiz recipe rendered for a streetwear brand',
    imageWidth: 1600,
    imageHeight: 999,
    imagePairHeight: 998,
    imageCaption: 'One recipe, two brands. The same interaction takes on a different visual identity.',
    links: [
      { label: 'A Design System for an Agent', url: '/blog/a-design-system-for-an-agent/' },
      { label: 'When the Interface Assembles Itself', url: '/blog/when-the-interface-assembles-itself/' },
    ],
  },
  {
    slug: 'game-ua-multi-mission',
    title: 'Game UA, multi-mission',
    kicker: 'The proof that an ad can start where most user acquisition stops',
    years: '2023 – 2026',
    group: 'company',
    context: 'Buzzvil · Product & interaction design',
    call: 'Traditional game UA pays for the install and disengages at the point where most players churn. Installation should be the beginning of the experience, not the end of the ad.',
    foundation: 'Multi-step rewarded missions, shipped as a server-driven format: each mission surfaces a slice of the game and paces the player toward the advertiser-defined Aha moment, tuned against retention rather than installs.',
    // TODO(Max): the roadmap claim, kept to what Buzzvil has said publicly.
    shipped: 'Live across the publisher network as a standard format.',
    image: '/blog/i-dont-like-ads/ua.png',
    imageAlt: 'Game UA activation flow, from install to the Aha moment',
    imageWidth: 1178,
    imageHeight: 1230,
    links: [{ label: "I Don't Like Ads", url: '/blog/i-dont-like-ads/' }],
  },
  {
    slug: 'buzzvil-mediums',
    title: 'The Buzzvil mediums',
    kicker: 'How design took control of the entire company medium fleet in a single move',
    years: '2025 – 2026',
    group: 'company',
    context: 'Buzzvil · Design infrastructure',
    call: 'Nobody owned the website, so every external medium drifted on its own. Design should own all of them at once, with a door open for everyone else.',
    foundation: 'One monorepo and one token system under every web property, made AI-native so any team can contribute on-system work and design keeps the review gate.',
    shipped: 'The homepage, SDK docs, tech blog, design portal and culture blog, rebuilt and shipped by the design team, with PMs and engineers now opening design PRs.',
    image: '/blog/nobody-owned-the-website-now-everybody-does/cover.png',
    imageAlt: 'Every Buzzvil web property under one system',
    imageWidth: 1200,
    imageHeight: 681,
    links: [
      { label: 'Nobody Owned the Website. Now Everybody Does.', url: '/blog/nobody-owned-the-website-now-everybody-does/' },
      { label: 'docs.buzzvil.com', url: 'https://docs.buzzvil.com' },
      { label: 'design.buzzvil.com', url: 'https://design.buzzvil.com' },
      { label: 'tech.buzzvil.com', url: 'https://tech.buzzvil.com' },
    ],
  },
  {
    slug: 'offerwall',
    title: 'The Offerwall',
    kicker: 'The answer to a platform policy change that took away the surface the business ran on',
    years: '2019 – 2022',
    group: 'company',
    context: 'Buzzvil · Product platform',
    call: 'A platform policy change removed the lockscreen surface that carried the company. The answer had to be a new product publishers would embed, not a workaround on the old one.',
    foundation: 'The Offerwall and the SDK that carries it into partner apps: a reward surface a publisher embeds, with the monetization model rebuilt around it.',
    // TODO(Max): screen (v1 and current), and revenue phrasing kept to public wording.
    shipped: 'The pivot the company runs on today, inside banking, commerce and telecom apps.',
    links: [{ label: 'Buzzvil Docs, the SDK', url: 'https://docs.buzzvil.com' }],
  },
  {
    slug: 'lockscreen',
    title: 'The lockscreen',
    kicker: 'An early proof that there is a better way to deliver ads to people, carried mostly by the system behind it',
    years: '2014 – 2019',
    group: 'company',
    context: 'Buzzvil · Product platform',
    call: 'Ads could be delivered on the user’s terms: a chosen moment, a clear exchange, and a reward for attention rather than an interruption.',
    foundation: 'A lockscreen that paid for attention with points, and the ad-serving and reward system behind it. Early proof, mostly system.',
    // TODO(Max): screen, and public figures if any.
    shipped: 'Buzzvil’s first product, and the model every later format inherits.',
  },
];
