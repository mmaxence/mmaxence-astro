// Local first-review stories, 2026-10-10.
// Source: docs/reviews/2026-10-10-work-first-review.md and companion claim boundaries.
// Company figures and credits remain review material; no publication is implied.

export interface WorkLink { label: string; url: string }

export interface ProjectEvidence {
  type: 'image' | 'video';
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  poster?: string;
  preview?: string;
  displayWidth?: number;
  description?: string;
}

export interface InteractionFlow {
  title: string;
  steps: { actor: string; title: string; detail: string; judgment?: boolean }[];
  note: string;
}

export interface ProjectVisual {
  afterParagraph: number;
  ecosystem?: boolean;
  rewardJourney?: 'templates' | 'feed' | 'carousel' | 'migration';
  archive?: boolean;
  lockscreenPresentation?: 'overview' | 'halla';
  timeline?: { date: string; title: string; state: string; goal: string; achieved: string; next: string }[];
  metrics?: { value: string; label: string; context: string }[];
  frames?: { title: string; format: 'Screenshot' | 'Screen recording' | 'Comparison'; brief: string }[];
  media?: ProjectEvidence[];
  paired?: boolean;
  plate?: 'brand' | 'system' | 'shortcuts' | 'accessibility';
  detailPlate?: 'mark' | 'scale' | 'motion';
  showcase?: 'palette' | 'performance';
  table?: { title: string; columns: string[]; rows: string[][]; caption: string };
}

export interface ProjectReview {
  updated?: string;
  credit: string;
  figures: { value: string; context: string }[];
  questions: string[];
  sources: WorkLink[];
  boundaries: string[];
}

export interface WorkProject {
  opening?: string;
  readingPath?: { chapter: number; label: string }[];
  intro?: string;
  review?: ProjectReview;
  status: { label: string; value: string }[];
  sections: { title: string; takeaway?: { label: string; text: string }; paragraphs: string[]; links?: WorkLink[]; visuals?: ProjectVisual[]; plate?: 'brand' | 'system' | 'shortcuts' | 'accessibility'; detailPlate?: 'mark' | 'scale' | 'motion'; showcase?: 'palette' | 'work' | 'write' | 'performance'; mediaFirst?: boolean; details?: string[]; media?: ProjectEvidence[]; flow?: InteractionFlow; notes?: { title: string; paragraphs: string[] }[] }[];
}

export interface WorkEntry {
  project?: WorkProject;
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
    "slug": "buzzvil-mediums",
    "title": "The Buzzvil mediums",
    "kicker": "A consistent brand for Buzzvil’s IPO preparations, maintained through agents.",
    "years": "2026",
    "group": "company",
    "context": "Buzzvil · Brand systems & agent-driven publishing",
    "call": "As Buzzvil prepared for an IPO, its online presence needed to feel like one company. I brought its key web surfaces onto a shared brand foundation and built a repository workflow where agents prepare updates and people review what ships.",
    "foundation": "The brand became shared tokens, components and layouts. App instructions, content conventions and automated checks give agents the context to make updates that remain consistent, without CMS editing or manual page assembly.",
    "shipped": "The shared foundation now supports a refreshed technical blog and a much fuller corporate-site preview: interactive product demonstrations, a bilingual archive, and company and culture stories. December publication is the goal; content alignment and migration checks remain.",
    "links": [
      {
        "label": "Nobody Owned the Website. Now Everybody Does.",
        "url": "/blog/nobody-owned-the-website-now-everybody-does/"
      },
      {
        "label": "docs.buzzvil.com",
        "url": "https://docs.buzzvil.com"
      },
      {
        "label": "design.buzzvil.com",
        "url": "https://design.buzzvil.com"
      },
      {
        "label": "tech.buzzvil.com",
        "url": "https://tech.buzzvil.com"
      },
      {
        "label": "Buzzvil · live corporate website",
        "url": "https://www.buzzvil.com/"
      },
      {
        "label": "Buzzvil Docs · live SDK documentation",
        "url": "https://docs.buzzvil.com/"
      }
    ],
    "project": {
      "status": [],
      "sections": [
        {
          "title": "A public presence ready for the next chapter",
          "paragraphs": [
            "As Buzzvil prepared for an IPO, its public-facing surfaces needed to reflect the company it was becoming. Our website, technical blog, SDK documentation and design portal had accumulated across separate systems. Updating them meant finding someone with the right tools, access and time. Small changes became projects, and pages fell behind.",
            "My focus was shifting from Game UA’s hands-on product work toward the AI-native organization and this web foundation. I wanted design to own the quality of these surfaces and give the people closest to the content a practical way to improve them. In February 2026, I proposed a shared foundation, with agents helping implement changes and people reviewing what would ship.",
            "The work became buzzvil-mediums: a monorepo for the company’s web surfaces, with shared design rules and a contribution workflow built around code."
          ],
          "visuals": [
            {
              "afterParagraph": 3,
              "timeline": [
                {
                  "date": "February 2026",
                  "title": "One foundation, shared ownership",
                  "state": "Established",
                  "goal": "Bring separate web surfaces into a common design and contribution system.",
                  "achieved": "Proposed the shared foundation and agent-assisted contribution path.",
                  "next": "Prove it through real migrations and contributions."
                },
                {
                  "date": "April 2026",
                  "title": "Protect the readers already here",
                  "state": "Live",
                  "goal": "Move the technical blog without breaking its history.",
                  "achieved": "201 legacy URLs checked on April 6; tech blog moved to its production domain on April 12.",
                  "next": "Keep feeds, images and historical links working as content changes."
                },
                {
                  "date": "May 2026",
                  "title": "Make contribution work for someone else",
                  "state": "Live",
                  "goal": "Remove deployment access bottlenecks and launch SDK documentation.",
                  "achieved": "Edward implemented shared preview and production deployment. Eden tested a real release update; SDK docs launched May 15.",
                  "next": "Build repeated contribution habits beyond the initial migration."
                },
                {
                  "date": "October 12–16, 2026",
                  "title": "Make the platform visible through real experiences",
                  "state": "Preview + live updates",
                  "goal": "Explain products through interaction, make culture human, and improve bilingual discovery.",
                  "achieved": "Landing, product, company and culture updates merged; 15 bilingual interactive phone demos reported. Tech blog discovery refreshed.",
                  "next": "December publication is the goal. Finish content alignment and technical migration checks before corporate-domain cutover."
                }
              ]
            }
          ],
          "links": [
            {
              "label": "Earlier: proving Game UA, then handing it over to Mido",
              "url": "/work/game-ua-multi-mission/"
            }
          ]
        },
        {
          "title": "What is live, and what comes next",
          "paragraphs": [
            "The sites share a foundation, but their milestones are different. This is a dated progress snapshot: expand the timeline above for the goal, evidence and next step at each stage."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "table": {
                "title": "Delivery status · October 16, 2026",
                "columns": [
                  "Surface / work",
                  "Status",
                  "Evidence / next step"
                ],
                "rows": [
                  [
                    "Design portal",
                    "Live",
                    "Shared theme and navigation foundation."
                  ],
                  [
                    "Technical blog",
                    "Live; refreshed",
                    "October 12 relaunch; search, topic/contributor navigation and shared discovery controls."
                  ],
                  [
                    "SDK documentation",
                    "Live",
                    "May 15 launch; real release-update workflow tested."
                  ],
                  [
                    "Component catalog",
                    "Deployed",
                    "October 12 production deployment verified."
                  ],
                  [
                    "Corporate homepage",
                    "Preview; December publication goal",
                    "Content alignment and migration checks remain. Corporate-domain cutover not established."
                  ],
                  [
                    "Insights + culture archive",
                    "Merged into the preview",
                    "234 source articles and 194 AI translations, with labels and original links."
                  ],
                  [
                    "Landing + product experiences",
                    "Merged October 12–15",
                    "15 bilingual interactive phone demos reported; Prism and Game UA stories clarified."
                  ],
                  [
                    "Company + culture pages",
                    "Merged; content review continues",
                    "Photo-led culture, revised company story and illustration interactions."
                  ],
                  [
                    "Vendor retirement",
                    "Remaining",
                    "Verify form delivery, hosted-asset independence and cancellation before recording savings."
                  ]
                ],
                "caption": "Manually maintained snapshot, not a live deployment monitor. Production app deployments and public-domain launches are tracked separately."
              }
            }
          ]
        },
        {
          "title": "Put the brand into the material",
          "paragraphs": [
            "The first decision was to make the shared foundation executable. Colors, type, spacing, layouts and components live in packages consumed by the sites. The OKLCH token system defines both light and dark themes, so brand decisions survive beyond the first redesign.",
            "The repository is also the interface for maintaining the rebuilt platform. App-specific AGENTS.md instructions, page context and publishing rules guide an agent from a request to a reviewable change. The new content pipeline reads repository files instead of depending on CMS editing or manual page assembly.",
            "Next.js and shared TypeScript packages sit in a pnpm and Turborepo workspace. GitHub Actions distinguishes content changes from code changes, runs builds and tests for affected packages, and provides Vercel previews. Automated checks support the process; people still own the facts, editorial judgment and release.",
            "Bilingual publishing is checked against the source. Korean and English counterparts carry source fingerprints; a missing or stale edition fails the normal build. Translation checks also preserve code and link destinations. Translations are prepared before the build, so readers receive static pages rather than waiting for an LLM call."
          ],
          "visuals": [
            {
              "afterParagraph": 3,
              "media": [
                {
                  "type": "image",
                  "src": "/work/buzzvil-mediums/tech-discovery-oct14.webp",
                  "alt": "October tech blog review build with shared navigation, search, filters and article covers",
                  "caption": "Tech blog · Existing local review capture from October 14, 2026. Search and filters share controls with the homepage archives. The visible item count is a build snapshot, not a migration total.",
                  "width": 1126,
                  "height": 849,
                  "displayWidth": 900
                }
              ]
            }
          ]
        },
        {
          "title": "Performance is part of the brand",
          "paragraphs": [
            "In the August 13, 2026 overhaul, the redesign’s cold landing-page JavaScript transfer fell from 1,008 KB to 322 KB gzip, about 68%. Both measurements used local production builds. This is a historical payload comparison, not a current live-site speed or conversion claim.",
            "The work restored server-rendered content, removed duplicate motion dependencies and gated animation work by visibility and reduced-motion preference. The October product-demo system uses a related principle: load a lightweight WebP preview first, then load the sandboxed experience when someone opens it."
          ]
        },
        {
          "title": "The old links were part of the design",
          "paragraphs": [
            "The blog rebuild exposed how much a website carries beyond its visible pages. Historical URLs, feeds, image paths, and metadata all had to survive the move.",
            "Two pages passed local tests and then returned 404s on the Linux deployment. Their filenames used uppercase letters; my Mac had hidden the mismatch. We normalized the names and continued checking the old routes. Images needed another pass for the same reason.",
            "An old article also resurfaced as new in Feedly after its identifier changed during migration. I fixed the feed behavior and capped it to recent articles, but the item already stored in Feedly could not be removed. A clean-looking page had not been enough to protect the reader’s experience.",
            "By the April 6 verification pass, 201 legacy URLs returned successful responses after redirects. The tech blog moved to its production domain on April 12, following review with our CTO."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "frames": [
                {
                  "title": "A link through the migration",
                  "format": "Comparison",
                  "brief": "Show the old article URL and its destination, including the filename-casing failure that informed the fix."
                }
              ]
            }
          ]
        },
        {
          "title": "Open contribution met a deployment wall",
          "paragraphs": [
            "The first contribution workflow still depended on who was making the change. People outside the Vercel team could open a pull request and then get blocked at deployment. Repository access alone did not deliver the experience we had promised.",
            "I raised the problem and proposed moving deployment into GitHub Actions. Edward implemented the change across the monorepo: pull requests received preview links, and merges to main triggered production deployments. Contributors could review the result through the pull request instead of needing the Vercel dashboard.",
            "This was a useful correction to the original idea. Writing instructions for an agent was only part of opening the platform. The access model, preview environment, and review path had to work for the next person too."
          ],
          "flow": {
            "title": "From an idea to a published update",
            "steps": [
              {
                "actor": "Content owner",
                "title": "Describe the change",
                "detail": "Supply the source material, intended audience and facts that need to stay accurate."
              },
              {
                "actor": "Agent + shared foundation",
                "title": "Prepare the draft",
                "detail": "Work within the repository’s content structure, brand rules and reusable components."
              },
              {
                "actor": "Agent + build checks",
                "title": "Prepare both languages",
                "detail": "The homepage draft adds natural English/Korean counterparts and checks for missing or stale translations."
              },
              {
                "actor": "GitHub Actions",
                "title": "Make it reviewable",
                "detail": "A pull request gets a preview so the contributor can inspect the actual page."
              },
              {
                "actor": "Human reviewer",
                "title": "Make the judgment",
                "detail": "Review the story, claims, translation and presentation before approving the change.",
                "judgment": true
              },
              {
                "actor": "GitHub Actions",
                "title": "Publish on merge",
                "detail": "An approved merge to main triggers the production deployment workflow."
              }
            ],
            "note": "Preview and deployment are established. Automatic bilingual coverage is part of the homepage draft, not a claim that every live surface already uses it."
          }
        },
        {
          "title": "Documentation needed owners and a live update test",
          "paragraphs": [
            "The SDK documentation brought a different set of responsibilities. Content decisions belonged with the people responsible for the SDK. Deployment and search needed engineering ownership. I worked on the presentation and migration with those boundaries visible.",
            "Before cutover, Hugo caught a missing dependency: search indexing still ran from the old repository. Moving the pages without moving that job would leave search behind as new content was published. We rebuilt the selectors for the new page structure and connected indexing to the new deployment flow.",
            "The content review also simplified navigation, brought release notes and release news together, and moved older SDK versions out of the main path while preserving their URLs. Eden tested the AI-assisted update workflow with a real 6.7.x release-notes update. The docs launched on May 15.",
            "That was a more useful proof than a demo. Someone other than me used the new workflow for actual release work."
          ],
          "visuals": [
            {
              "afterParagraph": 3,
              "media": [
                {
                  "type": "image",
                  "src": "/blog/nobody-owned-the-website-now-everybody-does/docs.png",
                  "width": 1200,
                  "height": 765,
                  "alt": "Buzzvil SDK documentation landing page with SDK entry points and search",
                  "caption": "SDK documentation · Archival capture from the April 2026 article, before the May launch. Included as design evidence, not a current production screenshot.",
                  "displayWidth": 800
                }
              ]
            }
          ]
        },
        {
          "title": "Building the homepage was faster than agreeing on it",
          "paragraphs": [
            "The homepage became the longest part of the project. By May, the platform was ready enough to work in, but the content and information architecture still needed alignment across teams. I expected the original end-of-Q2 target to slip.",
            "The work widened into questions about the brand itself: what we wanted customers to understand, how to explain the products, and which information sales teams needed to keep using. Those decisions could not be settled by generating another page.",
            "In September, I revised the direction toward a more customer-focused message. The October 12–15 updates made that direction tangible: the landing connects a brand’s goal to an experience, product pages show participation rather than only describe technology, and company and culture pages put people into the story.",
            "By the October 16 alignment, December was the publication goal. Content still needed agreement with Ed, John, Judy and Earnest. Engineering support for migration was agreed, with a Frank sync and checks for redirects, analytics, real form delivery, mobile accessibility and rollback still ahead. The preview has moved forward; the corporate-domain launch is not complete."
          ],
          "visuals": [
            {
              "afterParagraph": 3,
              "media": [
                {
                  "type": "image",
                  "src": "/work/buzzvil-mediums/game-experience-oct15.webp",
                  "alt": "Illustrative Game UA scene with a reward-progress panel beside a fictional game world",
                  "caption": "Product storytelling · October 15 local review capture. A three-stage interactive Game UA scene makes entry, progress and rewards concrete. Lagoon and the points are illustrative, not a client campaign or performance result.",
                  "width": 1200,
                  "height": 576,
                  "displayWidth": 1000
                },
                {
                  "type": "image",
                  "src": "/work/buzzvil-mediums/culture-oct15.webp",
                  "alt": "Buzzvil culture hero surrounding Room to grow with photographs of colleagues",
                  "caption": "How we work · October 15 local review capture. A photo-led composition gives the shared system a more human tone; the page includes a motion pause control.",
                  "width": 1889,
                  "height": 1310,
                  "displayWidth": 1000
                }
              ]
            },
            {
              "afterParagraph": 4,
              "media": [
                {
                  "type": "image",
                  "src": "/work/buzzvil-mediums/homepage-context-oct19.webp",
                  "preview": "/work/buzzvil-mediums/homepage-context-oct19-1440.webp",
                  "width": 2880,
                  "height": 1800,
                  "alt": "The homepage introduces an illustrative skincare brand and its campaign goal.",
                  "caption": "Current local homepage build, October 19, 2026. Captured at 1440 × 900 CSS pixels with 2× device pixel ratio. Fictional brand and campaign."
                },
                {
                  "type": "image",
                  "src": "/work/buzzvil-mediums/homepage-experiences-oct19.webp",
                  "preview": "/work/buzzvil-mediums/homepage-experiences-oct19-1440.webp",
                  "width": 2880,
                  "height": 1800,
                  "alt": "Three phone previews show discovery, consideration and return experiences for the same illustrative skincare brand.",
                  "caption": "Current local homepage build, October 19, 2026. Actual rendered demonstration previews; not advertiser performance evidence."
                }
              ]
            }
          ],
          "details": [
            "The October 16 report records 15 bilingual interactive phone demos, including Game UA and Prism. These are website demonstrations, not fifteen new production advertising products.",
            "The demo contact flow can be completed, but end-to-end real submission handling remains a migration check. JotForm and Pardot dependencies must be confirmed before cutover."
          ]
        },
        {
          "title": "Less software to rent, one system to maintain",
          "paragraphs": [
            "The financial case is concrete, but conditional. The August invoice review identified ₩8.85 million in annual Contentful and JotForm subscription costs that the new website could eliminate once the cutover is complete.",
            "The new archive lives in the repository, and the shared contact experience replaces the old form overlay. Some contact and gated-resource pages still use JotForm, and imported articles still reference Contentful-hosted assets. Those dependencies need to be removed before we can call the full amount realized savings.",
            "This is gross annual subscription cost avoidance, not net savings: hosting, maintenance and any incremental tooling still need to be accounted for. Figma, Pardot and assumed staff-time savings are excluded."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "table": {
                "title": "Potential annual SG&A reduction",
                "columns": [
                  "Subscription",
                  "Annual cost basis",
                  "Condition"
                ],
                "rows": [
                  [
                    "Contentful",
                    "₩7,200,000",
                    "Complete CMS and hosted-asset independence; cancel subscription."
                  ],
                  [
                    "JotForm",
                    "₩1,650,000",
                    "Replace remaining forms; cancel subscription."
                  ],
                  [
                    "Total opportunity",
                    "₩8,850,000 / year",
                    "Full-year equivalent after both retirements."
                  ]
                ],
                "caption": "August 31, 2026 John 1:1 cost note in the Hanji knowledge corpus, citing the August 27 invoice review. JotForm: $1,200 at ₩1,375/USD. Historical planning basis; cancellation and realized savings not verified."
              }
            }
          ]
        },
        {
          "title": "What changed and what still needs proof",
          "paragraphs": [
            "The shared foundation now supports a refreshed technical blog and a much fuller corporate-site preview: interactive product demonstrations, a bilingual archive, and company and culture stories. December publication is the goal; content alignment and migration checks remain.",
            "The next measure is whether these surfaces stay current through other people’s contributions. A repository and a set of instructions create the possibility. Repeated use is the test.",
            "For me, the lasting work is the combination: a common design foundation, migration checks that protect existing readers, and a workflow other people can actually use."
          ]
        }
      ],
      "review": {
        "credit": "Max: direction, shared foundation, implementation and migration. Edward: shared deployment workflow. Hugo: deployment, indexing and cutover. Eden: release-update test. Hazel and Olivia: documentation structure and content ownership. Daniel and Zune: review and infrastructure decisions. Confirm exact credit wording.",
        "figures": [
          {
            "value": "201 legacy URLs",
            "context": "Successful final responses after redirects in the 6 Apr 2026 audit. A dated migration check, not an uptime guarantee or proof every historic URL was tested."
          },
          {
            "value": "200 migrated content items",
            "context": "13 Apr 2026 launch update: 93 blog posts, 83 seminars and 24 handbook entries. Do not call all 200 blog posts."
          },
          {
            "value": "5,293 → 1,859 files",
            "context": "Inventory reported 13 Apr 2026, about 65% fewer files. Confirm measured directory scope before a headline; this does not measure page speed."
          },
          {
            "value": "₩8.85M / year",
            "context": "Potential Contentful and JotForm subscription avoidance from the August 31 cost note. Gross annualized opportunity; not verified cancellations or net savings."
          },
          {
            "value": "1,008 KB to 322 KB",
            "context": "Landing-page JavaScript transferred, gzip, before and after the August 13 redesign overhaul. Production builds, cold cache, localhost. About 68% less JavaScript; not a current live-site performance score."
          }
        ],
        "questions": [
          "Confirm whether 2025 belongs in the project period as substantive work or only prior token groundwork.",
          "Resolve the migration inventory and conflicting retrospective cutover date. Contemporary CTO and launch posts support 12 April for the blog.",
          "Which post-launch contribution best proves the workflow worked beyond Design? Eden’s real release update is documented; broad adoption and time saved are not.",
          "Review the October 14–15 captures and confirm content alignment and migration readiness before the December publication goal.",
          "Confirm subscription cancellation dates, remaining hosting/tooling costs and permission to publish the internal cost figures."
        ],
        "sources": [
          {
            "label": "23 February function alignment",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/~296941078/pages/4943085598/26.02.23+2026+Function+alignment"
          },
          {
            "label": "27 March platform introduction",
            "url": "https://buzzvil.slack.com/archives/C051V6F36LR/p1774599750134649"
          },
          {
            "label": "Tech blog migration thread",
            "url": "https://buzzvil.slack.com/archives/C011G4Z4086/p1774597104126049"
          },
          {
            "label": "6 April audit",
            "url": "https://buzzvil.slack.com/archives/C011G4Z4086/p1775443741668889"
          },
          {
            "label": "13 April launch update",
            "url": "https://buzzvil.slack.com/archives/C051V6F36LR/p1776041484796199"
          },
          {
            "label": "6 May deployment implementation",
            "url": "https://buzzvil.slack.com/archives/C011G4Z4086/p1778057986193909"
          },
          {
            "label": "15 May SDK production update",
            "url": "https://buzzvil.slack.com/archives/C051V6F36LR/p1778824641951159"
          },
          {
            "label": "14 September Judy and Max notes",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/~296941078/pages/5226168738/Judy+Max+meeting+notes"
          },
          {
            "label": "Nobody owned the website",
            "url": "https://mmaxence.me/blog/nobody-owned-the-website-now-everybody-does/"
          },
          {
            "label": "October 12 shared production deployment",
            "url": "https://github.com/Buzzvil/buzzvil-mediums/actions/runs/38190126410"
          },
          {
            "label": "October 16 function alignment · publication goal and remaining checks",
            "url": "https://buzzvil.atlassian.net/wiki/pages/5264081198"
          },
          {
            "label": "October 16 team report · recent website updates",
            "url": "https://buzzvil.atlassian.net/wiki/pages/5260673175"
          }
        ],
        "boundaries": [
          "23 February function alignment. Internal. Problem and intended workflow. Proposed steps such as Slack publishing and Contentful removal are not treated as shipped.",
          "27 March platform introduction. Internal. Design portal live; blog review, SDK testing and homepage incomplete. Preview app count is not a production-launch count.",
          "Tech blog migration thread. Internal. April filename case errors, Feedly identifier problem, link checks and CTO production confirmation. Supports 12 April cutover over a conflicting later retrospective date.",
          "6 April audit. Internal. 201 legacy URLs ended in successful responses after redirects. Point-in-time audit only.",
          "13 April launch update. Internal. 93 posts, 83 seminars, 24 handbook entries; 5,293 to 1,859 files. Disk footprint and media compression measure different things. Credentials in the source have not been copied.",
          "6 May deployment implementation. Internal. Edward confirms preview comments and production on merge after Max’s proposal. Does not prove proposed content auto-approval shipped.",
          "15 May SDK production update. Internal. Search indexing, preserved URLs, simpler structure, old versions, real release-update test and collaborator credits. GitHub direct reads were blocked by organization IP policy; no current repository audit is implied.",
          "14 September Judy and Max notes. Internal. Customer-focused prototype and continuing brand alignment; later dates are plans, not completed launch milestones.",
          "Nobody owned the website. Public, April 2026. Background only where corroborated. The stated 71% image reduction does not reconcile with 1.0 GB to 325 MB; raw bytes are needed. No blanket cost saving or universal adoption claim is retained.",
          "12 October 2026: Max identifies IPO readiness and the AI-native organizational transition as the context for this work. This is preparation, not proof of a scheduled or completed IPO. The February proposal and Game UA handoff are not assigned an unsupported day-by-day order.",
          "October 12 repository review: five production app jobs succeeded. Homepage content PRs #109–111 remain drafts. This does not establish www.buzzvil.com cutover. The August 31 John 1:1 cost note is an internal planning source; no billing cancellation is asserted.",
          "October 18 refresh: October 16 alignment and team report read, local buzzvil-web history corroborates merged PRs #109–127 through October 15. Earlier draft-PR statuses are superseded. December is a goal, not a launch commitment. Reused October 14–15 local review screenshots are explicitly dated; they are not fresh production captures. No Buzzvil repository was modified.",
          "19 October 2026: Max identifies IPO preparation, a consistent brand across key online mediums and agent-driven repository updates as core project goals. This describes preparation, not a completed listing or a listing date.",
          "19 October local repository inspection: shared tokens, layouts, agent instructions, content/code CI classification, preview workflow and bilingual release checks are implemented in buzzvil-web. The rebuilt publishing pipeline reads repository content. Legacy hosted assets, forms and public-domain cutover are separate migration concerns; no subscription cancellation is implied.",
          "August 13 homepage comparison in head/notes/2026-08-13-homepage-perf-comparison.md supports the 1,008 KB to 322 KB gzip payload comparison. Both redesign measurements are local production builds with cold cache. The live-site network timing column was not used.",
          "October demo implementation: optimized WebP previews load before sandboxed interactive experiences. No new field performance, conversion, time-saving or organization-wide adoption figures are inferred.",
          "19 October 2026 visual refresh: homepage hero, advertiser-context and personalized-experience captures come from the running local buzzvil-web homepage on port 3001. Source pixels were inspected before responsive WebP export. The homepage is labeled a local preview, not an established public-domain launch. The culture capture remains a secondary brand example."
        ],
        "updated": "19 October 2026"
      },
      "opening": "Rebuilding the websites was only part of the job. The harder question was who could keep them moving afterward.",
      "readingPath": [
        {
          "chapter": 2,
          "label": "A brand that lives in the code"
        },
        {
          "chapter": 4,
          "label": "The deployment wall"
        },
        {
          "chapter": 6,
          "label": "The homepage that took longer"
        }
      ]
    }
  },
  {
    "slug": "game-ua-multi-mission",
    "title": "Game UA, multi-mission",
    "kicker": "Proving a rewarded game experience, then handing it over to grow.",
    "years": "2023 – 2026",
    "group": "company",
    "context": "Buzzvil · Early product design IC, then design leadership",
    "call": "My role as an individual contributor was to help prove the Game UA model: shape an experience that could bring people into a game, make progress understandable, and give them a reason to return.",
    "foundation": "I worked hands-on across discovery, onboarding, the mission page and return paths. That early product work helped establish the case for greater investment in 2025.",
    "shipped": "Mido took over the ongoing design work as Game UA entered its next phase. My focus moved toward Buzzvil’s AI-native organizational transition and preparing its web presence for an IPO.",
    "links": [
      {
        "label": "I Don't Like Ads",
        "url": "/blog/i-dont-like-ads/"
      },
      {
        "label": "UA Specialized · current Buzzvil product",
        "url": "https://www.buzzvil.com/en/advertise/ua_specialized"
      }
    ],
    "project": {
      "status": [
        {
          "label": "My IC role",
          "value": "Prove the model"
        },
        {
          "label": "Next phase",
          "value": "Mido · ongoing product design"
        },
        {
          "label": "My focus now",
          "value": "AI-native organization & web readiness"
        }
      ],
      "sections": [
        {
          "title": "My first job was to prove the model",
          "paragraphs": [
            "A game install leaves a lot unresolved. The player still has to understand the game, find something worth doing and decide to come back. Our multi-mission product extended the rewarded experience into that early period, with a sequence of in-game actions tied to progress and rewards.",
            "My contribution as an individual designer was to help turn that model into a product people could use. I worked across discovery, onboarding, the mission page and return paths with the Ad Product and Supply teams. The first success was establishing that this could become a business worth investing in.",
            "That required more than a convincing prototype. We had to make the effort and reward clear, remove friction at entry, and learn where people stopped. The early experiments below show the interaction work behind that proof and the limits of what each change could establish."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "media": [
                {
                  "type": "image",
                  "src": "/blog/i-dont-like-ads/ua.png",
                  "width": 1178,
                  "height": 1230,
                  "alt": "Illustrative mission-page screens connecting game installation to rewarded in-game progress",
                  "caption": "Illustrative mission-page example from “I Don’t Like Ads.” Sample game and campaign content; not a capture of the experiments described below.",
                  "displayWidth": 589
                }
              ]
            }
          ],
          "links": [
            {
              "label": "Earlier: building the supply SDK and offerwall",
              "url": "/work/offerwall/"
            }
          ]
        },
        {
          "title": "First remove the unnecessary step",
          "paragraphs": [
            "Before reaching the mission page, users encountered a separate explanation screen. The mission page already contained the necessary campaign information. I wrote the proposal to remove that bridge for our Web UA campaigns and coordinated the work across the teams responsible for campaign setup, platform logic, the client and QA. A campaign-level switch kept the change reversible.",
            "The two-week KakaoBank comparison showed more users reaching the experience. Unique mission-page visits rose from 35% to 67% of unique ad clicks. Unique installs rose from 7.8% to 10.4%.",
            "But advertiser conversion barely changed in that window. We had made entry easier. The harder work still sat inside the experience."
          ],
          "visuals": [
            {
              "afterParagraph": 3,
              "table": {
                "title": "Easier entry, a separate conversion question",
                "columns": [
                  "Measure",
                  "Before",
                  "After"
                ],
                "rows": [
                  [
                    "Unique mission-page visits / unique ad clicks",
                    "35%",
                    "67%"
                  ],
                  [
                    "Unique installs / unique ad clicks",
                    "7.8%",
                    "10.4%"
                  ],
                  [
                    "Advertiser conversion",
                    "Essentially flat",
                    "Essentially flat"
                  ]
                ],
                "caption": "KakaoBank · 11–25 August vs 26 August–9 September 2024. Before/after comparison, not randomized A/B; allocation changes may confound the result."
              }
            }
          ],
          "flow": {
            "title": "Entry experiment · reconstructed journey",
            "steps": [
              {
                "actor": "Before",
                "title": "Ad, bridge, mission",
                "detail": "An intermediate campaign page sat between the ad and the mission."
              },
              {
                "actor": "Change",
                "title": "Go straight to the mission",
                "detail": "Remove the bridge from the web UA entry path."
              },
              {
                "actor": "Learning",
                "title": "Access is not commitment",
                "detail": "Visits and installs increased in the before/after report; advertiser conversion stayed essentially flat."
              }
            ],
            "note": "A schematic of the tested change, not a reconstruction of the original screen design. The table above keeps the measures and comparison limits visible."
          }
        },
        {
          "title": "Listen beyond the headline score",
          "paragraphs": [
            "We also added an in-product feedback module. In its first two-week report, it collected 1,472 ratings, including 277 written comments. Those comments exposed concerns that an aggregate satisfaction number could hide: missing rewards, delayed rewards and uncertainty about when a completed mission would pay.",
            "That made the interaction problem more specific. Progress and celebration had to be backed by a reliable, understandable reward state. The product work included clearer feedback, fewer unnecessary actions, and paths back to ongoing missions. Not every iteration had a measurable effect, and our reviews recorded that explicitly."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "frames": [
                {
                  "title": "Where players lost the thread",
                  "format": "Screenshot",
                  "brief": "Annotate the relevant journey screens with anonymized research observations."
                }
              ]
            }
          ]
        },
        {
          "title": "2025: from proof to greater investment",
          "paragraphs": [
            "The early results gave the company a reason to invest more. The 2025 plan explicitly moved away from trying to launch Game UA while also maximizing its margin. It committed to using rewards more actively to grow participation, alongside better mission experiences, retention features and dedicated game-sales capacity.",
            "The year-end review recorded ₩3.209 billion in Game UA revenue, up from ₩788 million in 2024: 4.07 times the previous year, against a ₩5 billion target. These are results of the wider product, sales and engineering effort. My IC work shaped the early experience that the team could build on."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "metrics": [
                {
                  "value": "₩788M",
                  "label": "2024 Game UA revenue",
                  "context": "Early commercial base · Demand year-end review"
                },
                {
                  "value": "₩3.209B",
                  "label": "2025 Game UA revenue",
                  "context": "4.07× year over year · ₩5B target, not fully reached"
                }
              ]
            }
          ]
        },
        {
          "title": "Commitment: does choosing a path help?",
          "paragraphs": [
            "Another experiment let players choose a mission structure before starting: steady progression, larger rewards collected in fewer steps, or purchase-oriented missions. The hypothesis was that choosing a path would make people more committed to it.",
            "The later Mission Mode test challenged that idea. The first option dominated selection, and few people inspected the other paths. All three campaign-and-platform slices recorded lower advertiser-event conversion per install than their controls. Choice had added an interaction; it had not established stronger commitment."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "paired": true,
              "media": [
                {
                  "type": "image",
                  "src": "/work/game-ua/mission-mode-choice.webp",
                  "width": 383,
                  "height": 820,
                  "displayWidth": 360,
                  "alt": "Mission Mode design asking a player to choose a reward style",
                  "caption": "Mission Mode · Original fourth-iteration design, labeled after QA in Figma. A horizontally browsable choice introduces a decision before play."
                },
                {
                  "type": "image",
                  "src": "/work/game-ua/mission-mode-confirm.webp",
                  "width": 383,
                  "height": 820,
                  "displayWidth": 360,
                  "alt": "Mission Mode confirmation showing sample missions and rewards",
                  "caption": "Mission Mode · The selected path is reviewed before confirmation, with a warning that it cannot be changed afterward. Sample missions and rewards are prototype content."
                }
              ]
            },
            {
              "afterParagraph": 2,
              "metrics": [
                {
                  "value": "52.18%",
                  "label": "Control · one Android campaign",
                  "context": "824 advertiser events / 1,579 installs."
                },
                {
                  "value": "40.59%",
                  "label": "Mission Mode · same campaign",
                  "context": "772 advertiser events / 1,902 installs. Not a pooled result."
                }
              ]
            }
          ],
          "details": [
            "One Android campaign went from 52.18% to 40.59% install-to-advertiser-event conversion. The other two groups also declined. Purchase counts moved in the opposite direction in some groups, which needed further investigation. There was no clean success story in that result.",
            "The next proposal was to make mission sets more flexible and understand the purchasing behavior before treating the concept as proven. The dropped exploration remains useful to show: the interaction looked plausible, but the experiment challenged the assumption behind it."
          ],
          "links": [
            {
              "label": "Experiment source and other campaign slices",
              "url": "https://buzzvil.atlassian.net/wiki/spaces/DEM/pages/3919086115"
            },
            {
              "label": "Original choice frame",
              "url": "https://www.figma.com/design/rIjQudVP8g0K7ecLxG3yty?node-id=6222-154827"
            },
            {
              "label": "Original confirmation frame",
              "url": "https://www.figma.com/design/rIjQudVP8g0K7ecLxG3yty?node-id=6222-154839"
            }
          ]
        },
        {
          "title": "Engagement: make the next step feel reachable",
          "paragraphs": [
            "The experiments also worked at the level of returning to the product. The Ranking Board moved beyond a summary of past earnings: nearby positions and the gap to the next rank gave people a concrete next goal.",
            "The January 20–February 5, 2026 team A/B analysis reported more visitors opening RewardMon with the board. That tells us about engagement with the feature. It does not establish that people stayed longer, returned more often, or generated more revenue."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "media": [
                {
                  "type": "image",
                  "src": "/work/game-ua/ranking-board.webp",
                  "width": 383,
                  "height": 820,
                  "displayWidth": 360,
                  "alt": "RewardMon ranking design showing nearby ranks, a next-rank prompt, earning history and attendance entry",
                  "caption": "Ranking Board · Original design frame, with nearby ranks and a next-step prompt. Prototype values are retained as drawn; this is design evidence, not a screenshot from the measured A/B cohort."
                }
              ]
            },
            {
              "afterParagraph": 1,
              "metrics": [
                {
                  "value": "7.88%",
                  "label": "Without the board",
                  "context": "Unique RewardMon click DAU / unique hub entry DAU."
                },
                {
                  "value": "23.93%",
                  "label": "With the board",
                  "context": "Same participation measure. Raw cohort counts and assignment still need confirmation."
                }
              ]
            }
          ],
          "links": [
            {
              "label": "Original Ranking Board frame",
              "url": "https://www.figma.com/design/rIjQudVP8g0K7ecLxG3yty?node-id=13871-89246"
            }
          ]
        },
        {
          "title": "2026: growth needed a different route",
          "paragraphs": [
            "The model was working, but its existing distribution was reaching a limit. The 2026 direction paper reported that average monthly new users had fallen from about 42,000 in the first half of 2025 to 32,000 in the second half. It interpreted that decline as a sign that the reachable audience inside partner placements was becoming exhausted.",
            "The strategy changed from improving only the experience inside those placements to building routes beyond them: retarget people who had left a mission, introduce referral loops, and develop a standalone service. The design problem widened from a mission page to a product people could discover, join and return to independently.",
            "That direction was not a completed growth story. The first-half review said monthly revenue remained around ₩300–400 million and external retargeting had not progressed as intended. The second-half plan transferred Game UA to Frontier; a June business plan framed the next phase around connected B2B and B2C services across Korea, Japan and Taiwan."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "frames": [
                {
                  "title": "From a partner placement to an independent service",
                  "format": "Comparison",
                  "brief": "Show the original publisher-to-mission journey beside the proposed standalone journey. Date the flow and distinguish planned acquisition routes from those that shipped."
                }
              ]
            }
          ]
        },
        {
          "title": "Mido took the product forward",
          "paragraphs": [
            "I handed the ongoing product design work to Mido to nurture and grow Game UA. His scope included the hub, mission-page hierarchy, progress and reward feedback, retention experiments and the standalone service. This was a transfer of product responsibility, giving him room to make and test the next decisions.",
            "His iterations made the next phase tangible: bringing step-by-step rewards into the first view, clarifying cumulative cashback on a shared progress bar, and testing how new users discover games. He also began delivering changes directly in code. My role shifted toward guidance and review as he carried the day-to-day design work.",
            "The recorded build below shows how those layers meet: attendance, roulette and bingo sit beside ongoing game discovery. A genre picker asks for up to three preferences before finding games. It makes the interaction visible, but is not evidence of an uplift from genre selection."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "paired": true,
              "media": [
                {
                  "type": "video",
                  "src": "/work/game-ua/hub-discovery.mp4",
                  "poster": "/work/game-ua/hub.webp",
                  "width": 572,
                  "height": 1250,
                  "displayWidth": 360,
                  "alt": "Game UA recorded build opening a genre picker and finding games",
                  "caption": "Archival QA build · Recording from the July 2026 design presentation. Team product work; not a new production capture or a recording of the Ranking Board test.",
                  "description": "The hub shows attendance, weekly roulette and monthly bingo above the games. A picker offers six illustrated genres, allows up to three selections, and moves to a game-finding state."
                },
                {
                  "type": "image",
                  "src": "/work/game-ua/discovery.webp",
                  "alt": "Game genre picker offering six illustrated categories and up to three choices",
                  "caption": "Discovery detail · Native-resolution frame from the same QA recording. The interface labels the genre illustrations as AI-generated.",
                  "width": 572,
                  "height": 1250,
                  "displayWidth": 360
                }
              ]
            }
          ]
        },
        {
          "title": "My next work moved to the organization",
          "paragraphs": [
            "With Game UA’s ongoing design in Mido’s hands, my attention shifted toward Buzzvil’s transition to an AI-native organization: how people take work from intent to implementation, how teams review it, and what shared tools and principles make that practical.",
            "In parallel, I worked on getting Buzzvil’s web presence ready for the company’s IPO preparations. The website, technical blog, documentation and design portal needed a coherent identity and a reliable way to stay current. Buzzvil mediums became a concrete application of the same change: agents help people implement, while people retain responsibility for quality and what ships."
          ],
          "links": [
            {
              "label": "Continue with Buzzvil mediums: web readiness and shared ownership",
              "url": "/work/buzzvil-mediums/"
            },
            {
              "label": "The AI-native design playbook",
              "url": "/deepdives/ai-native-design-workflow-playbook/"
            },
            {
              "label": "Related: what the interaction composer research taught us",
              "url": "/work/interaction-composer/"
            }
          ]
        }
      ],
      "review": {
        "credit": "Max’s account: hands-on design to prove the initial Game UA model, followed by a handoff of ongoing design to Mido. Product, sales, Ad Product and Supply shared delivery and commercial outcomes. Mido owns the subsequent design iterations described here. Max’s later focus is organizational AI-native adoption and web readiness for IPO preparations.",
        "figures": [
          {
            "value": "35% → 67%",
            "context": "Unique mission-page visits / unique ad clicks. KakaoBank, 11–25 Aug versus 26 Aug–9 Sep 2024. Before/after comparison, not randomized A/B."
          },
          {
            "value": "7.8% → 10.4%",
            "context": "Unique installs / unique ad clicks, same periods and publisher. Advertiser conversion was essentially flat; allocation changes may confound the comparison."
          },
          {
            "value": "52.18% → 40.59%",
            "context": "Advertiser events / installs, Match Convenience Store Android. Control 824/1,579; experiment 772/1,902. Later Mission Mode test begins 1 Jun 2025; closing date and assignment need verification."
          },
          {
            "value": "9.12% → 7.67%; 13.10% → 8.06%",
            "context": "Other Mission Mode slices: Fantasy Town Android and iOS respectively. Same event/install measure; do not pool or generalize the rates."
          },
          {
            "value": "1,472 ratings and 277 comments",
            "context": "UA feedback report, 12–27 Sep 2024. Counts describe collected responses. The source’s NPS scoring needs clarification and is omitted."
          },
          {
            "value": "₩788M in 2024; ₩3.209B in 2025",
            "context": "Demand Group 2025 plan/year-end review, updated January 2026: 7.88억 and 32.09억 actual Game UA revenue. Reported growth 4.07×; 2025 target 50억 (₩5B), 64.18% achieved. Not Max-attributed revenue or the combined multimission/multiaction business."
          },
          {
            "value": "About 42,000 to 32,000 monthly new users",
            "context": "2026 Game UA direction paper: first-half vs second-half 2025 monthly averages. Source interprets this as partner-inventory audience saturation; no claim that a specific design caused the decline."
          }
        ],
        "questions": [
          "Confirm dated early screens that best show Max’s work establishing the first viable model.",
          "Choose dated Mido captures and review the handoff wording with the team before publication.",
          "Confirm exact experiment cohorts and ownership before publishing Mission Mode or Ranking Board results.",
          "Review internal business figures and IPO-preparation wording before publication; no IPO date or completed listing is asserted."
        ],
        "sources": [
          {
            "label": "I Don’t Like Ads",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/~296941078/pages/4728455227/I+Don+t+Like+Ads"
          },
          {
            "label": "2024 Design OKRs",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/DN/pages/3379397096/2024+OKR+-+Design"
          },
          {
            "label": "Removing the bridge page PRD",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/~296941078/pages/3606905160/PRD+Removing+the+bridge+page+for+all+UA+campaigns+on+Web+Products"
          },
          {
            "label": "Two week report",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/~296941078/pages/3645079773/Removing+the+bridge+page+-+2+weeks+report"
          },
          {
            "label": "Mission selection experiment",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/DEM/pages/3919086115"
          },
          {
            "label": "UA Mission Page NPS report",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/DN/pages/3666051565/UA+Mission+Page+NPS"
          },
          {
            "label": "Ranking Board experiment board",
            "url": "https://www.figma.com/board/1b5svTvbozaBzlDOkNpQTg?node-id=28-3455"
          },
          {
            "label": "2026 design team interview",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/B2B/pages/5148967063/AX+CDO+EN+KR"
          },
          {
            "label": "Mission Mode fourth iteration",
            "url": "https://www.figma.com/design/rIjQudVP8g0K7ecLxG3yty?node-id=6222-154826"
          },
          {
            "label": "Ranking Board third iteration",
            "url": "https://www.figma.com/design/rIjQudVP8g0K7ecLxG3yty?node-id=13871-89246"
          },
          {
            "label": "2025 Demand Product plan · reward investment",
            "url": "https://buzzvil.atlassian.net/wiki/pages/3725787200"
          },
          {
            "label": "2025 Demand Group plan and annual results",
            "url": "https://buzzvil.atlassian.net/wiki/pages/3725230268"
          },
          {
            "label": "2026 Game UA direction · beyond partner inventory",
            "url": "https://buzzvil.atlassian.net/wiki/pages/4654039057"
          },
          {
            "label": "2026 Demand Product plan · first-half review and strategic transfer",
            "url": "https://buzzvil.atlassian.net/wiki/pages/4554031449"
          },
          {
            "label": "June 2026 global action-ad business plan",
            "url": "https://buzzvil.atlassian.net/wiki/pages/5113905556"
          },
          {
            "label": "Mido / Max biweekly · ongoing product design",
            "url": "https://buzzvil.atlassian.net/wiki/pages/4950818972"
          },
          {
            "label": "AI-native organization · 2026 strategy workshop",
            "url": "https://buzzvil.atlassian.net/wiki/pages/5112563211"
          }
        ],
        "boundaries": [
          "I Don’t Like Ads. Internal, January 2026 version. Advertiser-defined meaningful event supports the opening. Broad completion figures are not specific enough to import.",
          "2024 Design OKRs. Internal, January 2025 final version. Names Max and Jia on different work. Some mission-page and booster iterations had no clear improvement; V4 redirects harmed mission performance.",
          "Removing the bridge page PRD. Internal. Max owned the proposal; campaign, platform, client and QA work was assigned across teams. Web UA scope only.",
          "Two week report. Internal. 11–25 August versus 26 August–9 September 2024, KakaoBank. Unique-click denominator for visits and installs. Before/after with possible allocation confound; advertiser conversion essentially flat.",
          "Mission selection experiment. Internal, updated 4 July 2025. Later queries begin 1 June. Three campaign/platform slices lowered advertiser-event per install conversion. Self-selected retention cohorts do not prove a mode caused retention.",
          "UA Mission Page NPS report. Internal. 1,472 ratings, 277 comments; 12–27 September 2024 dates corroborated in Max’s 2 October Slack post. Score labels need methodology, so only response counts and themes are used.",
          "Ranking Board experiment board. Internal, inspected original board. 20 January–5 February 2026; 7.88% versus 23.93% participation. Numerator: unique RewardMon click DAU. Denominator: unique hub entry DAU. Raw cohort counts and assignment not shown.",
          "2026 design team interview. Internal. Supports broader design-to-code practice and Mido’s substantial Game UA contribution. Does not assign individual causal KPI gains.",
          "12 October 2026: Max explicitly clarified his early IC role proving the model, its contribution to greater 2025 investment, the handoff to Mido, and his later AI-native organizational and IPO-readiness focus.",
          "2025 Demand Product and Demand Group plans read in full on 12 October 2026. More active reward investment and sales capacity are planned commitments; no precise investment budget or proof that every planned hire occurred is asserted. Annual actual revenue and target are separated.",
          "2026 Demand Product plan distinguishes the initial strategy from the first-half review and second-half transfer to Frontier. Open-internet retargeting, referral and standalone growth are strategic directions, not blanket claims of completed rollout or success.",
          "Mido biweekly notes document his mission-page, cashback, hub, retention and design-in-code work. Later team experiments must not be used as evidence of Max’s initial IC success.",
          "IPO preparation is supplied directly by Max; this local draft asserts neither an exchange-approved timetable nor a completed listing.",
          "October 18 visual pass: hub/discovery video and stills extracted from the existing July 13 all-hands asset q-fourth.mp4. QA marker preserved. This is archival team-build evidence, not proof of production release or a specific experiment outcome. Journey and choice diagrams are explicitly reconstructed summaries.",
          "18 October 2026 Figma visual research: original frames exported read-only, visually inspected and saved as lossless WebP at source resolution. Captions distinguish archival designs from production and experiment evidence. Source-frame links are included beside each comparison. See docs/reviews/2026-10-18-figma-visuals.md."
        ],
        "updated": "18 October 2026"
      },
      "opening": "An install is a beginning. What makes someone take the next step and then return?",
      "readingPath": [
        {
          "chapter": 1,
          "label": "The screen we removed"
        },
        {
          "chapter": 2,
          "label": "What the ratings did not explain"
        },
        {
          "chapter": 6,
          "label": "When growth needed another route"
        }
      ]
    }
  },
  {
    "slug": "interaction-composer",
    "title": "The interaction composer",
    "kicker": "Testing personalized experiences beyond views and clicks.",
    "years": "2025 – 2026",
    "group": "company",
    "context": "Buzzvil · Composer proposal, design research & prototyping",
    "call": "Since 2025, Buzzvil has been focusing on the experience after an impression. Strong targeting and retargeting already supported reach; the next goal was to use audience data to tailor experiences around advertisers’ actual KPIs, beyond views and clicks. Within the Mission team’s research, I proposed the Composer and UI Cooker to test one way of making those experiences.",
    "foundation": "My prototype brought common interaction patterns into one library, capable of generating dozens of different interactions. While I built the first experiments, a second track started inside the Mission team: prompts and a harness, without a UI library. It produced stronger, more flexible results, but took longer to generate each variation. Preparing and validating experiences per user segment on the ad platform’s server made that delay acceptable.",
    "shipped": "The Composer ran in a few campaigns, with real usage data driving dozens of small refinements. The team ultimately chose the prompt-and-harness approach for its flexibility and stronger results. Its slower generation was acceptable because interactions could be generated and validated per user segment on the ad platform’s server, before delivery.",
    "links": [
      {
        "label": "A Design System for an Agent",
        "url": "/blog/a-design-system-for-an-agent/"
      },
      {
        "label": "When the Interface Assembles Itself",
        "url": "/blog/when-the-interface-assembles-itself/"
      }
    ],
    "project": {
      "status": [
        {
          "label": "Purpose",
          "value": "Test personalized experiences against advertiser goals"
        },
        {
          "label": "My contribution",
          "value": "Composer proposal, UI Cooker and interaction research"
        },
        {
          "label": "Conclusion",
          "value": "Prompt-and-harness approach; no live generation required"
        }
      ],
      "sections": [
        {
          "title": "The problem: reach is only the beginning",
          "paragraphs": [
            "Since 2025, Buzzvil has been focusing on the experience after an impression. Targeting and retargeting already helped advertisers reach people. The next question was how the experience itself could support advertisers’ actual KPIs, beyond views and clicks.",
            "The Mission team owned this initiative. The goal was to use audience data to tailor what people experienced, then judge its value against the advertiser’s objectives. While I built the first Composer experiments, a second track began inside the team, exploring prompts and a harness without a UI library.",
            "I proposed the Composer and UI Cooker as one experiment within that research. Could an agent assemble a useful experience from coded components and interaction recipes? I built the proposal far enough to examine its strengths and limits."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "frames": [
                {
                  "title": "One recipe, different brands",
                  "format": "Comparison",
                  "brief": "Show the same interaction adapted through brand tokens, with the shared structure visible."
                }
              ]
            }
          ],
          "links": [
            {
              "label": "Background: the limits of the offerwall",
              "url": "/work/offerwall/"
            }
          ]
        },
        {
          "title": "My proposal: compose the experience from recipes",
          "paragraphs": [
            "I consolidated common interaction patterns into a single library an agent could compose, capable of generating dozens of different interactions. The six examples shown here are a selection from that system. It was one approach the team could compare with its parallel research.",
            "The library described how someone enters, what they need to do, how progress is shown, when a reward appears and how the experience ends. Components carried structured information about their purpose and place in a flow. Coded recipes described how those pieces could work together.",
            "The UI Cooker was the environment for trying that idea. It generated variations on the go, making it quick to compare treatments and brand contexts. I could inspect behavior and try another direction without rebuilding the experience from scratch.",
            "By mid-May, the library had 88 component manifests, 21 recipes and five brand examples. Sixty recipe-and-brand combinations had been validated. Those numbers described implementation coverage. They did not establish advertiser impact or make the recipe approach the right product choice."
          ],
          "visuals": [
            {
              "afterParagraph": 3,
              "media": [
                {
                  "type": "image",
                  "src": "/blog/a-design-system-for-an-agent/ox-quiz-skincare.jpg",
                  "width": 1600,
                  "height": 999,
                  "alt": "Cooker prototype showing the OX quiz with a skincare brand theme",
                  "caption": "Cooker prototype · The same OX recipe under a skincare theme. Existing proof-of-concept capture; not the final production campaign.",
                  "displayWidth": 800
                },
                {
                  "type": "image",
                  "src": "/blog/a-design-system-for-an-agent/ox-quiz-streetwear.jpg",
                  "width": 1600,
                  "height": 998,
                  "alt": "Cooker prototype showing the OX quiz with a streetwear brand theme",
                  "caption": "Cooker prototype · A second brand changes the content, color and shape while retaining the interaction structure. The screenshot’s internal “Prod” label is not release verification.",
                  "displayWidth": 800
                }
              ],
              "paired": true
            },
            {
              "afterParagraph": 1,
              "frames": [
                {
                  "title": "The anatomy of a recipe",
                  "format": "Screenshot",
                  "brief": "Use the actual manifest and its rendered interaction, with a few annotations connecting the two."
                }
              ]
            }
          ]
        },
        {
          "title": "Campaign data, dozens of small refinements",
          "paragraphs": [
            "The Composer ran in a few campaigns. Real usage data drove dozens of small refinements aimed at improving performance. An OX quiz trial on one advertiser line item in May 2026 shows one part of that work.",
            "The result exposed a problem. More than one in five users left without finishing the quiz. Mella's analysis pointed to the teasing screen as a possible source of friction. The flow was technically assembled, but users still needed to understand why they should continue.",
            "The progress gauge was one of those small refinements. The reward had appeared at the end; I made it visible throughout the interaction as a gauge that filled with each answer. I refined correct and incorrect feedback, transitions and the final product screen, and made the teasing screen optional."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "frames": [
                {
                  "title": "O/X campaign trial",
                  "format": "Screen recording",
                  "brief": "Show entry, quiz, reward and product handoff from the first trial build."
                }
              ]
            },
            {
              "afterParagraph": 3,
              "frames": [
                {
                  "title": "Making the reward visible",
                  "format": "Comparison",
                  "brief": "Pair the original reward feedback with the revised gauge and optional teasing screen. Label prototype and live states."
                }
              ]
            }
          ]
        },
        {
          "title": "The finding: more freedom, more generation time",
          "paragraphs": [
            "The Composer performed better for the hypothetical case of generating a fresh experience for every session. Its coded pieces and recipes suited live assembly. Live per-session generation remained a research scenario, separate from the campaign trials.",
            "The Mission team’s second track took a different route. Prompts and a harness let the LLM crawl brand details and compose UI from design guidelines, without relying on the Composer’s UI library. It produced much more flexible experiences and stronger results. Its drawback was the time needed to produce each variation.",
            "That delay turned out to be acceptable. We chose to generate and validate interactions per user segment on the ad platform’s server, before anyone encountered them. The Composer’s speed mattered less in that delivery model than the flexibility and quality of the prompt-and-harness approach. These were findings about generation, not a measured advertiser KPI uplift."
          ],
          "links": []
        },
        {
          "title": "The conclusion: use the stronger approach for prepared experiences",
          "paragraphs": [
            "The first Composer experiments and campaign trials helped us compare approaches. We chose the Mission team’s prompt-and-harness track: give the LLM tools to understand the brand and guidelines to compose an experience, then validate the result. Longer generation time was a workable tradeoff for its flexibility and quality.",
            "Generation and validation happen through the admin on the ad platform’s server, per user segment. Validated versions are branched on the server and assigned to those segments. A person sees the prepared version selected for them; generation happens before delivery.",
            "If a segment does not perform as expected, another version can be generated, reviewed and assigned. The goal remains to tailor the experience around advertiser objectives. This case describes the feasibility work and the choice of approach; it does not establish a conversion gain.",
            "The Mission team owned the wider initiative and researched other options in parallel. My contribution was proposing and testing the Composer approach through the design library, UI Cooker and interaction refinements. Product and engineering partners supported the campaign experiments and delivery work."
          ],
          "flow": {
            "title": "The approach chosen by the team · prepared before delivery",
            "steps": [
              {
                "actor": "LLM + research tools",
                "title": "Understand the brand",
                "detail": "Crawl brand details to build context for the experience."
              },
              {
                "actor": "Admin + model",
                "title": "Compose from guidelines",
                "detail": "Compose for the intended audience using brand context and design guidelines instead of the Composer’s coded recipes."
              },
              {
                "actor": "Human review",
                "title": "Choose a version",
                "detail": "Validate the generated interaction for its intended user segment before it becomes a server-side branch."
              },
              {
                "actor": "Server",
                "title": "Assign to a segment",
                "detail": "The ad platform delivers the validated, prepared version selected for that audience."
              },
              {
                "actor": "Team + model",
                "title": "Review and revise",
                "detail": "Review the segment’s performance against advertiser objectives; prepare and review another version when needed."
              }
            ],
            "note": "Approach and ownership described by Max, October 18, 2026. The Mission team owned the broader initiative; Composer was one research direction, tested in a few campaigns. Live per-session generation was hypothetical and not required. No quantified quality gain, conversion uplift or automatic optimization is asserted."
          },
          "links": [
            {
              "label": "Related: progression and reward in Game UA",
              "url": "/work/game-ua-multi-mission/"
            }
          ]
        },
        {
          "title": "What we learned: better context, less machinery",
          "paragraphs": [
            "In our experiments, a fixed UI kit made generation faster but limited the quality and range of the output. Matching the freedom of the model would require a much larger library. Building and maintaining that system made the value of the approach less convincing.",
            "Brand context, user data and the advertiser’s KPI proved more valuable inputs than a catalog of components. A clear prompt connected these factors to the goal. Giving the model richer context and room to compose produced stronger experiences, validated before delivery.",
            "As models improve, we are gradually removing layers of the harness that earlier models needed. The direction is a smaller core: user data, brand context, the KPI and a clear prompt that brings them together. The prompt logic remains proprietary. Human validation still happens before delivery."
          ]
        }
      ],
      "review": {
        "credit": "The Mission team owned the initiative and researched approaches in parallel. Max proposed and tested the Composer approach through the design library, UI Cooker and interaction refinements. Product and engineering partners supported campaign experiments and delivery work. The Composer ran in a few campaigns before the team selected the prompt-and-harness approach.",
        "figures": [
          {
            "value": "88 manifests and 21 recipes",
            "context": "Library inventory reported 18 May 2026. Manifests are not directly comparable with the earlier count of React components."
          },
          {
            "value": "60 of 60 validated combinations",
            "context": "Recipe and brand validation across five brands. Coverage of the implementation, not a conversion or user-success rate."
          },
          {
            "value": "23.5% in-quiz dropoff",
            "context": "Pre-revision OX diagnostic cited 2 June 2026. One campaign line item; exact event denominator, sample size and observation dates still need the full report. Do not use as a headline improvement."
          }
        ],
        "questions": [
          "Confirm the documented OX trial’s first production date and provide its final recording. The 4 May staging message conflicts with a retrospectively edited meeting note; 12 May is provisional. This one trial does not describe the full scope of the Composer’s campaigns.",
          "Approve the campaign metric for public use and recover its denominator and sample size. No measured benefit from the June revision is established."
        ],
        "sources": [
          {
            "label": "Interaction Library",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/DN/pages/5006819451/Interaction+Library"
          },
          {
            "label": "18 May 2026 biweekly",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/~139668156/pages/5068029954/2026-05-18+Max+John+Biweekly+Meeting+note"
          },
          {
            "label": "1 June analysis announcement",
            "url": "https://buzzvil.slack.com/archives/C0AJTB08THP/p1780293967536659"
          },
          {
            "label": "2 June revision",
            "url": "https://buzzvil.slack.com/archives/C0AJTB08THP/p1780380569138889"
          },
          {
            "label": "4 May staging clarification",
            "url": "https://buzzvil.slack.com/archives/C0AJTB08THP/p1777874257788089"
          },
          {
            "label": "30 April polish update",
            "url": "https://buzzvil.slack.com/archives/C087QNJP333/p1777515180086189"
          },
          {
            "label": "June reward-gauge preview",
            "url": "https://buzzvil.github.io/interaction-cooker/?recipe=ox-quiz-3"
          }
        ],
        "boundaries": [
          "18 October 2026, learning clarified by Max: in this project a UI-kit constraint improved generation speed but reduced output quality; a much larger kit would weaken the rationale for building it. Prompt quality and shared brand, user and KPI context were more valuable. Improving models now allow gradual removal of heavy harness layers. The prompt logic remains proprietary and must not be reproduced. These are project observations and the current direction, not a universal model benchmark or a claim that all harness layers have already been removed.",
          "18 October 2026, conclusion clarified by Max: while he built the first Composer experiments, a second track began inside the Mission team using prompts and a harness without a UI library. It showed much greater flexibility and strong results; producing each variation took longer. That delay was acceptable because the team chose to generate and validate interactions per user segment on the ad platform’s server. No quantitative generation-time or quality benchmark is supplied.",
          "18 October 2026, latest clarification from Max: the library consolidated common interaction patterns and could generate dozens of different interactions; the six portfolio specimens are a selection. The Composer ran in a few campaigns, gathering real data that drove dozens of small performance refinements. The progress gauge is one example. This supersedes earlier wording that implied the Composer had no campaign use. It does not establish exact campaign counts, per-session generation or measured uplift from any individual change.",
          "Interaction Library. Internal. Explains manifests, roles, recipes, documentation and Cooker. Earlier counts use different units and dates from May; do not merge them into a growth claim.",
          "18 May 2026 biweekly. Internal and retrospectively edited. Supports 88 manifests, 21 recipes, five brands, 60 validated combinations and one OX line item. Provisional first production date is 12 May.",
          "1 June analysis announcement. Internal. More than 20% incomplete quiz bounce; teasing-screen explanation is a hypothesis. Full report and denominator remain to be checked.",
          "2 June revision. Internal. Max cites 23.5% in-quiz dropoff and describes gauge, feedback and transitions. The metric precedes the revision; there is no established uplift.",
          "4 May staging clarification. Internal. Only OX was polished and only live in stagingqa; Cooker images were placeholders. Do not label these as final campaign visuals.",
          "30 April polish update. Internal. Design-library PR 6 and production-renderer handoff support personal craft and engineering collaboration, not final campaign release by themselves.",
          "18 October 2026: Max clarified that the Composer was a research direction tested in a few campaigns. The generation comparison distinguishes two settings: the recipe Composer performed better for hypothetical live, per-session generation; the LLM-driven approach produced better quality for prepared server-side experiences. Neither comparison is a quantified benchmark.",
          "18 October 2026: Max authorized new concept illustrations unconstrained by early screenshots. New fictional skincare and streetwear brands illustrate the shared interaction idea; they are not original research outputs, shipped campaigns or evidence of model performance. The documented OX analysis concerns one campaign line item. Later prompt-and-harness delivery is distinguished from the Composer’s campaign trials.",
          "18 October 2026: Max describes the replacement as an LLM-driven flow that can crawl brand details and compose UI using design guidelines instead of the Composer’s coded recipes. Current experiences are admin-generated, human-reviewed and server-assigned to segments. Per-session generation is a hypothetical comparison, not a shipped capability. No measured latency, quality score, conversion gain or automated optimization outcome is inferred.",
          "18 October 2026: Max clarified the strategic context and ownership. Since 2025 Buzzvil has focused on post-impression experiences, building on strong targeting and retargeting. The goal is to use audience data to tailor experiences toward actual advertiser KPIs beyond views and clicks. The Mission team owned the initiative and researched approaches in parallel; Max proposed and tested Composer and UI Cooker as one option. The team chose prompt-and-harness generation for better results with prepared experiences, since live generation was not required. These statements establish intent, research findings and contribution boundaries, not proven conversion uplift or overall initiative ownership by Max. The documented OX trial is one part of the campaign evidence, not a full inventory of the Composer’s use."
        ],
        "updated": "18 October 2026"
      },
      "opening": "The audience was already being reached. What experience would help them take the next step? I built a recipe-based system within the Mission team’s broader research, refined it through campaign data, then helped compare it with a more flexible LLM approach.",
      "readingPath": [
        {
          "chapter": 0,
          "label": "The problem"
        },
        {
          "chapter": 1,
          "label": "The Composer proposal"
        },
        {
          "chapter": 3,
          "label": "The finding and the pivot"
        }
      ]
    }
  },
  {
    "slug": "hanji",
    "title": "Hanji",
    "kicker": "Designing the tools I needed to read, direct and judge agent work.",
    "years": "Ongoing",
    "group": "independent",
    "context": "Independent lab · Product, interaction design & development",
    "call": "Hanji began with needs I had at Buzzvil. Agents were becoming part of how I made things, and I needed a better way to see their contributions, question them, and decide what should happen next.",
    "foundation": "I started with Write to read and review shared documents, then built Work to see and direct agent-led execution. Think came next: a canvas for the ideas that precede both, with their context carried into pages and issues.",
    "shipped": "I use Write and Work daily at Buzzvil. That gives me a close feedback loop: encounter friction, refine the interaction, and live with the change. Some of the most useful work has been small: preserving a reading position, keeping a shortcut out of a text field, putting an answer back beside its issue.",
    "project": {
      "status": [
        {
          "label": "Write",
          "value": "Closed beta"
        },
        {
          "label": "Work",
          "value": "Alpha"
        },
        {
          "label": "Think",
          "value": "Local prototype"
        }
      ],
      "sections": [
        {
          "title": "Three needs, one design practice",
          "paragraphs": [
            "Hanji began with needs I had at Buzzvil. Agents were becoming part of how I made things, and I needed a better way to see their contributions, question them, and decide what should happen next.",
            "I started with documents I needed to read and judge. Write put a shared reading and editing surface over the material agents already worked with. Work followed when I needed a picture of execution: what was happening, how it connected, and where to give direction.",
            "Think grew from the space before either: sketches, discussions and decisions that should not lose their context when they become work. These are successive responses to my own workflow, rather than three products planned together from the start."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "media": [
                {
                  "type": "image",
                  "src": "/work/hanji/tracker-canvas.webp",
                  "width": 1440,
                  "height": 960,
                  "displayWidth": 720,
                  "alt": "Work canvas arranging six fictional issues into a dependency graph with an agent composer below",
                  "caption": "Work · An earlier alpha capture, with fictional content. The dependency view makes the shape of the work visible; board and issue context give commands a scope."
                }
              ]
            }
          ]
        },
        {
          "title": "Keep review attached to the words",
          "paragraphs": [
            "Write was the first response. People needed a calm place to read, edit and discuss material that agents could already work with through files, Git and MCP. I kept those paths connected: shared documents for people, proposed changes for agents, and a visible review decision.",
            "An agent proposal arrives as a diff. Its author and the changed words sit beside Reject and Merge, so the decision concerns the actual edit. Human review can happen at a smaller scale: highlight a passage, question its meaning, and discuss it where the words live. If later edits break that connection, the discussion preserves the original quotation instead of silently pointing somewhere else.",
            "Multiplayer editing exposed a different problem. The first implementation announced another person's changes but only brought them into the editor at save time. The merge could be correct while the experience was still wrong: someone was continuing to write against an older version.",
            "The next iteration brings compatible changes in during a pause in typing and restores the caret. If typing resumes while the merge is being checked, that result is abandoned and checked again later. Overlapping changes still need a decision. Keeping a person in the judgment seat means preserving those decisions while letting compatible work move forward.",
            "That proposal path now also supports local repositories without a GitHub pull request. A person can inspect, reject or merge a proposed edit through Write, while their checked-out branch and uncommitted work remain protected. Think write-ups can use the same review boundary. The earlier proposal recording illustrates the review gesture, not this new local-folder connection."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "media": [
                {
                  "type": "image",
                  "src": "/work/hanji/write-inline-comments.webp",
                  "preview": "/work/hanji/write-inline-comments-1000.webp",
                  "width": 2660,
                  "height": 1840,
                  "displayWidth": 998,
                  "alt": "Write document with a highlighted passage and an anchored discussion between two reviewers",
                  "caption": "Write · Actual local-build interface with a seeded fictional review. A highlighted passage stays beside its quoted discussion, so people can question the same words and agree on a change."
                }
              ]
            },
            {
              "afterParagraph": 4,
              "media": [
                {
                  "type": "video",
                  "src": "/work/hanji/write-proposal.mp4",
                  "poster": "/work/hanji/write-proposal-poster.webp",
                  "width": 1080,
                  "height": 676,
                  "displayWidth": 540,
                  "alt": "Reviewing and merging an agent proposal in Write",
                  "caption": "Write · Review → inspect the diff → merge. Earlier build recording, fictional document; silent, 9 seconds.",
                  "description": "A pending agent proposal opens as a diff. The person inspects the added line, chooses Merge, and returns to the document with the accepted text."
                }
              ]
            },
            {
              "afterParagraph": 3,
              "frames": [
                {
                  "title": "People reviewing the same document",
                  "format": "Screen recording",
                  "brief": "Show two people discussing a passage inline, alongside an agent contribution awaiting judgment."
                }
              ]
            }
          ],
          "details": [
            "Permissions shape the path. A person with write access can edit directly; a contributor on a review-first path proposes changes. Agent proposals have their own review boundary. Shared work does not mean every edit needs approval."
          ]
        },
        {
          "title": "Put direction where the work lives",
          "paragraphs": [
            "Readable documents did not give me a clear picture of execution. I built Work around one person directing many agents: they create issues and views and carry work forward, while the interface makes that activity understandable enough to judge and redirect.",
            "Control follows the scale of the question. At workspace level, I can direct the broader effort. Inside an issue, I can give a specific instruction and follow the response alongside the task itself. The comment composer lets me address Claude or GPT. Their completed replies become attributed comments, keeping the reasoning beside the work.",
            "That location took several iterations. The first session plan put agents in terminal windows and reported progress back into the tracker. Moving to an in-app conversation reduced that distance, but still left another place to follow. Bringing the issue session into its comment thread made the instruction, response and next decision part of the same record.",
            "I also removed an earlier use of task labels to trigger agent requests. Organizing an issue should not quietly ask an agent to act. Giving a command deserves an explicit interaction.",
            "The workspace conductor now folds into a quiet presence and opens when needed. Its draft survives minimizing and reopening; focus returns to the composer. Session states distinguish activity, a requested decision and completed work. The aim is enough presence to stay informed without keeping a conversation permanently in the way."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "media": [
                {
                  "type": "image",
                  "src": "/work/hanji/work-agent-comments.webp",
                  "preview": "/work/hanji/work-agent-comments-1000.webp",
                  "width": 1736,
                  "height": 1640,
                  "displayWidth": 868,
                  "alt": "Work issue thread with attributed Claude and GPT answers, human direction, and agent recipient controls",
                  "caption": "Work · Actual local-build interface with a seeded fictional conversation showing successive Claude and GPT contributions. The person compares their reasoning and gives the next direction. These are demo replies, not a recorded agent run."
                }
              ]
            },
            {
              "afterParagraph": 4,
              "detailPlate": "scale"
            },
            {
              "afterParagraph": 3,
              "frames": [
                {
                  "title": "From board context to an agent action",
                  "format": "Screen recording",
                  "brief": "Capture selecting a board or issue, giving an instruction, and reviewing the resulting change."
                }
              ]
            },
            {
              "afterParagraph": 5,
              "media": [
                {
                  "type": "image",
                  "src": "/work/hanji/work-conductor.webp",
                  "width": 1440,
                  "height": 1000,
                  "displayWidth": 1100,
                  "alt": "Work local preview with a workspace conductor at lower left and an issue discussion open on the right",
                  "caption": "Work · The workspace conductor and an issue discussion share the same work surface. Actual local preview with a fictional workspace and seeded replies, not a recorded agent run."
                }
              ]
            }
          ],
          "details": [
            "Shrinking every card equally makes a busy canvas harder to read. Work changes what it shows with the viewing distance: project territory at the widest scale, issue identifiers and relationships in the middle, and titles and metadata close up.",
            "I rejected saved freeform positions for the work canvas: they become stale, and coordinates alone tell an agent little about the work. A stable computed layout and semantic zoom made relationships carry the meaning instead."
          ]
        },
        {
          "title": "Think: the gap before execution",
          "paragraphs": [
            "Figma and FigJam were part of my design workflow. In the setup I was using, FigJam’s MCP support did not give agents the control I needed, and carrying ideas into product management meant plugins and workarounds. Think is my attempt to make that handoff native to the work surface.",
            "Not every thought is ready to be a document or a task. Think adds a spatial layer: notes, connectors and sections that let people arrange ideas and discuss what deserves to move forward.",
            "The notes reuse Write’s editor. Comments and reactions stay with the object being discussed, so the conversation has a place on the canvas. Think uses the workspace’s people and access rules; agents work through its CLI and tools. The embedded agent conversation remains in Work.",
            "Think is an unreleased local prototype. The board and the new connections exist in code, but the full path across the three surfaces is still being tested. A shared canvas here is not a claim of production character-by-character coediting."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "media": [
                {
                  "type": "image",
                  "src": "/work/hanji/think-canvas.webp",
                  "preview": "/work/hanji/think-canvas-1000.webp",
                  "width": 2560,
                  "height": 1700,
                  "displayWidth": 1100,
                  "alt": "Think local prototype with connected fictional notes and a note being edited inline",
                  "caption": "Think · Actual local prototype with fictional notes. A shared canvas gives ideas room before they become a page or a task."
                },
                {
                  "type": "image",
                  "src": "/work/hanji/think-sections.webp",
                  "width": 2560,
                  "height": 1700,
                  "displayWidth": 1100,
                  "alt": "A selected section in Think groups two connected notes under Make something worth sharing",
                  "caption": "Think · A section gives a group of ideas a boundary. Actual local prototype, fictional content; this capture predates the new cross-product actions."
                }
              ]
            }
          ]
        },
        {
          "title": "The shape changes; the context stays",
          "paragraphs": [
            "A sticky or selected group in Think can become Work issues. The original thought remains on the board, with an issue chip that reflects its status. A short Undo window lets the person cancel a newly filed issue.",
            "A section or selection can also become a Write page. The person previews the content and destination first: create a new page, or propose that new page for review. The result retains a link to the board and section it came from.",
            "The reverse direction matters too. Selecting a passage in Write can create a Work issue, carrying the quotation and its page and heading. In Work, the source is visible beside the task. Moving between forms should preserve the reason for doing the work.",
            "These connections are implemented in the current local builds. The interactive study on this page illustrates their behavior; it is not a recording of a live end-to-end session."
          ]
        },
        {
          "title": "A quiet identity, precise interactions",
          "paragraphs": [
            "Hanji’s identity gives the work a quiet surface: the ㅎ mark, warm paper and editorial type. Think, Write and Work share that foundation. Write’s celadon and Work’s orchid distinguish controls and states, without requiring a different visual language for each.",
            "Color has to work at more than full strength. A passage highlight should leave the words readable. An agent tint should identify a contribution without competing with it. A focused control needs a clearer boundary. The palette is a set of relationships between paper, content, emphasis and action.",
            "Write generates those relationships from three seeds: background, text and accent. Its dark theme retains the background hue while adapting lightness and chroma. Work uses curated light and dark orchid palettes. Both separate accent text, fills and labels so that one recognizable color can serve different roles.",
            "The same care applies to time. Switching from reading to editing initially navigated away, flashed a placeholder and could lose the reader's position. I rebuilt it as a change of mode within the page. An early fix preloaded the editor for everyone; loading on hover or focus offered a better balance between a light reading path and a responsive editing gesture.",
            "Daily use also made the repeated actions impossible to ignore. Find an issue, open it, reach the comment, send an instruction. Shortcuts make that path shorter, but they must yield when someone is typing. Visible focus, textual status and reduced-motion handling are part of that interaction design, not a separate finish applied afterward.",
            "In Work, stepping between issues now updates the drawer without rebuilding the board underneath. Back and Forward replay already visited issues locally. Continuity is part of performance: the person keeps their place while inspecting individual pieces of work."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "plate": "brand"
            },
            {
              "afterParagraph": 2,
              "showcase": "palette"
            },
            {
              "afterParagraph": 4,
              "media": [
                {
                  "type": "video",
                  "src": "/work/hanji/write-formatting.mp4",
                  "poster": "/work/hanji/write-formatting-poster.webp",
                  "width": 800,
                  "height": 360,
                  "displayWidth": 600,
                  "alt": "Markdown shortcuts becoming formatted text in Write",
                  "caption": "Write · Input rules in an existing build. Silent, 13 seconds; shown at its original capture scale or smaller.",
                  "description": "Typing a heading marker changes the line into a heading. Markdown markers also produce bold text and a list as the person continues typing."
                }
              ]
            },
            {
              "afterParagraph": 5,
              "plate": "shortcuts"
            }
          ],
          "details": [
            "Write’s generator uses OKLCH and checks contrast on its sRGB projection. It targets 7:1 for body text, 4.5:1 for accent text and labels, and 3:1 for accent fills. The dark background retains the original hue and a restrained share of its chroma. These are palette-generation targets, not a whole-product accessibility certification.",
            "Visible focus, textual status, keyboard navigation and reduced-motion handling are implementation provisions to keep testing, not a claim of whole-product accessibility conformance."
          ]
        },
        {
          "title": "A lab in use, still being tested",
          "paragraphs": [
            "I use Write and Work daily at Buzzvil. That gives me a close feedback loop: encounter friction, refine the interaction, and live with the change. Some of the most useful work has been small: preserving a reading position, keeping a shortcut out of a text field, putting an answer back beside its issue.",
            "Write is in closed beta and Work is in alpha. The next step is to extend that same process to a small group of roughly five to ten people, whose ways of working can reveal what my own use misses. That is the intended scope of the feedback loop, not a measure of adoption. Think is a newer local prototype, with the connections across all three surfaces still being tested together.",
            "Both products are available by request. The lab website is live, and open source remains part of the direction. I am still refining how quickly someone can understand the situation, judge the contributions, and direct what happens next."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "frames": [
                {
                  "title": "One small friction, before and after",
                  "format": "Comparison",
                  "brief": "Choose a daily-use refinement and show the interaction before and after the fix."
                }
              ]
            }
          ]
        }
      ],
      "review": {
        "credit": "My account describes an independent lab, design and implementation across its surfaces, and daily use of Write and Work at Buzzvil. It does not claim sole authorship or import Buzzvil ownership into the project.",
        "figures": [
          {
            "value": "Think local prototype",
            "context": "Unreleased development preview, verified in the local Hanji repository on 18 October 2026. Cross-product implementations are present; owner restart and end-to-end checks remain pending."
          },
          {
            "value": "Write closed beta and Work alpha",
            "context": "Last explicit status supplied by Max. Access by request. Confirm current stage before publication; these are product stages, not audited October 2026 usage metrics."
          },
          {
            "value": "Daily personal use",
            "context": "Reported by Max for both products at Buzzvil. Describes dogfooding, not measured adoption or team-wide usage."
          },
          {
            "value": "Roughly 5 to 10 people",
            "context": "Intended scope of the next feedback group, not existing adoption. If active, distinguish invitations, onboarding and recurring use."
          }
        ],
        "questions": [
          "Are the closed-beta and alpha labels still correct, and has either product had a proper public-source release? Do not infer public release from a repository push.",
          "Is the five-to-ten-person group still planned or already active? Add a usage figure only with a clear definition and date.",
          "Does the terminal → chat → issue comments sequence match the turning point you want to emphasize, and which daily frustration made it matter?",
          "Which current recording can demonstrate reading-to-editing continuity or multiplayer merging? Existing captures do not show those behaviors.",
          "Can a real, non-confidential agent session replace the seeded thread, and should anyone else receive specific contribution credit?"
        ],
        "sources": [
          {
            "label": "Hanji",
            "url": "https://hanji.ink/"
          },
          {
            "label": "Write access",
            "url": "https://hanji.ink/projects/write/#get-started"
          },
          {
            "label": "Work access",
            "url": "https://hanji.ink/projects/work/#get-started"
          }
        ],
        "boundaries": [
          "The refresh was checked against the Hanji landing and local Hanji main at 7fcb688 on 18 October 2026. Think is not presented as a released third product.",
          "Think and conductor captures come from the local handbook’s fictional demonstration fixtures. Existing agent replies are seeded demonstrations, not live Claude/GPT evidence.",
          "The cross-product study illustrates implemented flows. Existing Think screenshots predate their controls; no current capture proves a complete live round trip.",
          "Local-folder proposal support, the workspace conductor and drawer continuity are implementation-backed details. No new speed, adoption or release metrics are asserted.",
          "The Write → Work → Think sequence follows the initial repository (10 August), tracker (18 September) and whiteboard (9 October) commits. Figma/FigJam friction is Max’s account of his own setup, supplied during this portfolio review."
        ],
        "updated": "18 October 2026"
      },
      "opening": "I could make more. I needed a better way to judge it.",
      "readingPath": [
        {
          "chapter": 1,
          "label": "Write: make contributions readable"
        },
        {
          "chapter": 2,
          "label": "Work: make execution legible"
        },
        {
          "chapter": 3,
          "label": "Think: connect ideas to execution"
        }
      ]
    },
    "links": [
      {
        "label": "Visit the Hanji lab",
        "url": "https://hanji.ink"
      },
      {
        "label": "Write · Request access",
        "url": "https://hanji.ink/projects/write/#get-started"
      },
      {
        "label": "Work · Request access",
        "url": "https://hanji.ink/projects/work/#get-started"
      }
    ]
  },
  {
    "slug": "offerwall",
    "title": "Offerwall / Feed / Hub",
    "kicker": "One feed for every entry point. A connected supply product.",
    "years": "2019 – 2022",
    "group": "company",
    "context": "Buzzvil · Design IC, then supply product ownership & management",
    "call": "I started with the interface. My role grew into roughly two years as PO and PM of the supply product: shaping the SDK, setting priorities, and making it work across publisher apps.",
    "foundation": "“1 feed 4 all” made the offerwall the central destination across our ad units. As PM and product designer, I connected placements to that shared feed and developed new ways into it, including the native carousel.",
    "shipped": "The connected entry points drove a substantial increase in feed impressions and gave the team an ecosystem to keep developing after I moved on. A scalable SDK made that logic reusable across publisher apps.",
    "links": [
      {
        "label": "BenefitHub (formerly Feed) · current Android guide",
        "url": "https://docs.buzzvil.com/docs/buzzbenefit-android/v6/benefithub"
      },
      {
        "label": "Native placements · current Android guide",
        "url": "https://docs.buzzvil.com/docs/buzzbenefit-android/v6/native"
      },
      {
        "label": "Honeyscreen · live rewards app",
        "url": "https://play.google.com/store/apps/details?id=com.buzzvil.adhours&hl=en_US"
      }
    ],
    "project": {
      "status": [
        {
          "label": "Early role",
          "value": "Design IC"
        },
        {
          "label": "Expanded role",
          "value": "Supply PO / PM · about 2 years"
        },
        {
          "label": "Product",
          "value": "Publisher SDK & reward surfaces"
        }
      ],
      "sections": [
        {
          "title": "From designing screens to owning the product",
          "paragraphs": [
            "The product’s name evolved: Offerwall, then Feed, then Hub. The central idea was a shared destination for rewards, connected to the ad units around it. I use the names from each period below.",
            "I began as a hands-on designer, working on the offerwall’s layout, user flows and reward experience. Over this period, I moved into product ownership and management of the supply product for about two years. The responsibility grew from how a screen worked to what the team should build, who it should serve, and how we would know it was working.",
            "I owned product strategy, the roadmap, KPIs and release priorities. That meant working across design, engineering, business development and publisher needs. The 2021–2022 team paired my PO role with Diane’s product management and Dio’s technical ownership; the product was a shared effort.",
            "Buzzvil builds rewarded experiences inside partner apps. Honeyscreen remained our own consumer app and a place to try new experiences. The company reported 10 million monthly active users in May 2019, then 20 million monthly users across more than 150 publishers in October 2021. These company-wide milestones establish the audience around the work; they are not Offerwall-only adoption figures.",
            "Public company revenue grew from ₩12.3 billion in Q3 2020 to ₩22.3 billion in Q3 2021, a reported 81% increase. These company totals are separate from the two-month Feed revenue totals and individual experiments later in this case."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "rewardJourney": "feed"
            }
          ]
        },
        {
          "title": "1 feed 4 all",
          "paragraphs": [
            "The offerwall was more than a list of ads. As PM and product designer, I was responsible for the “1 feed 4 all” logic: connect our ad units and give them a route into one shared feed. Each placement could fit its context, while the offerwall became the central piece that connected them.",
            "This changed the scope of the design problem. Alongside improving the destination, I had to create paths into it from the places people already encountered our ads. Those connections drove a substantial increase in feed impressions and established an ecosystem the team continued developing after I moved on."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "ecosystem": true
            }
          ],
          "details": [
            "The impression growth here describes the connected-entry strategy, based on my account. The dated product totals and the narrower carousel analysis below have different scopes; neither is presented as a causal measurement of the entire “1 feed 4 all” strategy."
          ],
          "takeaway": {
            "label": "The decision",
            "text": "Treat the Feed as the shared destination. Each placement should offer a clear route into it."
          }
        },
        {
          "title": "Customization without a separate product for every partner",
          "paragraphs": [
            "The offerwall brought rewards inside a publisher’s app. After the lockscreen policy disruption, this was a more flexible foundation: the host app supplied the context, brand and point system, and our SDK supplied the reward experience.",
            "The 2019 renewal offered list and card layouts with a coordinated accent color. The larger product challenge was to make customization scalable. By 2021, our roadmap covered configurable tabs, campaign allocation, reusable entry points and server-controlled behavior across Android, iOS and Web.",
            "I framed the work around three priorities: customization, reach and scalability. A partner needed meaningful control over its experience; our team needed a common system underneath it. Shared feedback, configuration and integration guidance mattered as much as the screens. I built much of these foundations and component systems; the most recent Hub systems belong to the team’s later work."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "table": {
                "title": "Bounded choices for a shared product",
                "columns": [
                  "Partner choice",
                  "Shared behavior"
                ],
                "rows": [
                  [
                    "List or card layout",
                    "Two presentation options"
                  ],
                  [
                    "One accent color",
                    "Toolbar, point values and icons"
                  ],
                  [
                    "SDK-delivered UI",
                    "No publisher UI implementation required in the renewal notice"
                  ]
                ],
                "caption": "Configuration summary from the September 2019 renewal notice. Describes the offered scope, not completion of every rollout phase. This is a summary, not a historical screenshot."
              }
            },
            {
              "afterParagraph": 3,
              "paired": true,
              "media": [
                {
                  "type": "image",
                  "src": "/work/offerwall/feed-2021.webp",
                  "width": 375,
                  "height": 812,
                  "displayWidth": 375,
                  "alt": "2021 Feed prototype with navigation tabs, filters, image and video ad cards",
                  "caption": "2021 Feed UI · Tabs, filters and image/video cards in the original prototype. Example creative and reward values are retained from Figma."
                },
                {
                  "type": "image",
                  "src": "/work/offerwall/feed-bottomsheet-2021.webp",
                  "width": 360,
                  "height": 740,
                  "displayWidth": 360,
                  "alt": "2021 Feed system adapted to a bottom-sheet container",
                  "caption": "2021 Feed UI · The same card hierarchy inside a bottom sheet. A shared system adapts to a different container; this is an archival design, not a measured experiment result."
                }
              ],
              "archive": true
            }
          ],
          "links": [
            {
              "label": "The lockscreen: why the distribution model had to change",
              "url": "/work/lockscreen/"
            },
            {
              "label": "Original Feed prototype",
              "url": "https://www.figma.com/design/x3tqXc804Z5iSVjSHDteoN?node-id=321-28138"
            },
            {
              "label": "Original bottom-sheet component",
              "url": "https://www.figma.com/design/x3tqXc804Z5iSVjSHDteoN?node-id=72-2365"
            },
            {
              "label": "BenefitHub (formerly Feed) · current Android guide",
              "url": "https://docs.buzzvil.com/docs/buzzbenefit-android/v6/benefithub"
            }
          ]
        },
        {
          "title": "The native carousel: an entry point with somewhere to go",
          "paragraphs": [
            "I created the native carousel as one of those new entry-point variants. It placed several native ads horizontally within the publisher’s app. A link opened the offerwall, and a final “see more” card gave someone browsing the carousel another route into the full feed.",
            "The placement did two jobs: surface relevant ads in the host app and connect that small selection to a larger reward experience. We also worked on buttons, other in-app entry points and a bottom sheet that expanded into rewards while keeping the publisher’s context visible.",
            "The delivery model changed during development. We initially considered bundling the carousel UI into the SDK, but publisher customization made that approach too heavy. Instead, we provided an integration guide and sample implementation, with SDK support for the final Feed-promotion card. The system defined the connection while leaving room for the publisher’s own UI.",
            "This changed what counted as a finished feature. A promising interaction inside Honeyscreen was only a first step. Publishers also needed clear integration instructions, useful reporting and a reason to adopt it. Our Q3 2021 review recorded strong engagement for some entry points that had not yet been adopted outside Honeyscreen."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "rewardJourney": "carousel"
            },
            {
              "afterParagraph": 1,
              "media": [
                {
                  "type": "image",
                  "src": "/work/offerwall/carousel-to-feed.webp",
                  "width": 837,
                  "height": 772,
                  "displayWidth": 837,
                  "alt": "Two original Honeyscreen mockups showing a native carousel ad and its final card opening the Feed",
                  "caption": "February 2022 Carousel UI · A native ad and the final Feed-promotion card in the same placement. The end card turns the carousel into a route toward more offers. Original design mockups; example points are not performance results."
                }
              ],
              "archive": true
            },
            {
              "afterParagraph": 2,
              "media": [
                {
                  "type": "image",
                  "src": "/work/offerwall/carousel-light-dark.webp",
                  "width": 783,
                  "height": 315,
                  "displayWidth": 783,
                  "alt": "Dark and light native carousel modules with the next card partially visible",
                  "caption": "2021 component system · The next card peeks into view to communicate horizontal browsing. Dark and light treatments keep the same structure. Yellow is the original Figma component-board background."
                }
              ],
              "archive": true
            },
            {
              "afterParagraph": 3,
              "media": [
                {
                  "type": "image",
                  "src": "/work/offerwall/native-light-dark.webp",
                  "width": 329,
                  "height": 444,
                  "displayWidth": 329,
                  "alt": "Native ad component in light and dark variants",
                  "caption": "Native card detail · Image, title, supporting copy and reward retain their hierarchy across both themes. Original component variants."
                }
              ],
              "archive": true
            }
          ],
          "details": [
            "Our adjacent Nucleus work tested rewarded advertising beyond the familiar lockscreen context. The early campaigns were receiving fewer clicks than expected.",
            "One hypothesis I contributed was that people simply did not notice the reward message. The advertiser's own promotion was already competing for attention. Adding another badge did not guarantee that someone understood the exchange.",
            "We documented ways to test that: separating the explanation of the service from the advertiser's message, trying clearer onboarding, and comparing paths through the funnel. The useful lesson was to examine whether the reward was understood before treating its amount as the only lever."
          ],
          "links": [
            {
              "label": "Original Carousel UI",
              "url": "https://www.figma.com/design/45kZV5TgUKYV5LURmTXrQO?node-id=1-2269"
            },
            {
              "label": "Native carousel system",
              "url": "https://www.figma.com/design/x3tqXc804Z5iSVjSHDteoN?node-id=356-30928"
            },
            {
              "label": "Native card variants",
              "url": "https://www.figma.com/design/x3tqXc804Z5iSVjSHDteoN?node-id=356-30849"
            },
            {
              "label": "Native placements · current Android guide",
              "url": "https://docs.buzzvil.com/docs/buzzbenefit-android/v6/native"
            }
          ],
          "takeaway": {
            "label": "What changed during development",
            "text": "A bundled carousel UI was too restrictive for publisher customization. We moved to integration guidance and a sample implementation, while keeping SDK support for the Feed-promotion card."
          }
        },
        {
          "title": "More impressions did not answer every question",
          "paragraphs": [
            "The supply product was operating at substantial volume. Our September 2021 review compared May–June with July–August across Android, iOS and Web. Feed page views rose from 392.0 million to 432.2 million, and feed revenue from ₩3.37 billion to ₩3.61 billion. These are two-month totals across the product; the review credited wider publisher adoption, rather than an isolated redesign.",
            "The 2022 feed experiment made the tradeoff more concrete. A compact layout exposed more offers and increased revenue per thousand visits, but clicks did not grow at the same pace. Making the CTA more prominent did not close that gap. Day-one and week-one retention showed no difference.",
            "A later, narrower carousel analysis exposed a useful distinction. Among Honeyscreen Android users on the carousel version, impressions per show rose from 1 to 2.73, while total native-to-feed visits stayed broadly flat. That result concerns one placement and cohort. It does not measure the broader impression growth from connecting the ecosystem, and it reminds us that more exposure in a carousel does not automatically mean more visits to the destination."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "metrics": [
                {
                  "value": "432.2M",
                  "label": "Feed page views",
                  "context": "July–August 2021 · 392.0M in May–June"
                },
                {
                  "value": "₩3.61B",
                  "label": "Feed revenue",
                  "context": "July–August 2021 · ₩3.37B in May–June"
                }
              ]
            },
            {
              "afterParagraph": 2,
              "frames": [
                {
                  "title": "A denser feed, a clearer CTA",
                  "format": "Comparison",
                  "brief": "Pair the old feed with the compact version and its revised CTA. Annotate spacing, visible offers and the action hierarchy."
                }
              ]
            },
            {
              "afterParagraph": 2,
              "table": {
                "title": "Feed UI A/B test · Honeyscreen Android",
                "columns": [
                  "Measure",
                  "Original",
                  "Revised",
                  "Relative change"
                ],
                "rows": [
                  [
                    "Impressions per visit",
                    "6.88",
                    "7.96",
                    "+15.69%"
                  ],
                  [
                    "Revenue per 1,000 visits (pRPM)",
                    "12.87",
                    "13.77",
                    "+6.99%"
                  ],
                  [
                    "Click-through rate",
                    "8.54%",
                    "7.49%",
                    "−12.30%"
                  ]
                ],
                "caption": "Reported averages, 21 February–31 March 2022. Revenue rose alongside exposure; CTR fell. Team experiment owned by Brice, Diane and Max, analyzed by Cathie."
              }
            }
          ],
          "takeaway": {
            "label": "The finding",
            "text": "Exposure, revenue and engagement did not move together. The Feed test increased pRPM while CTR fell; the separate carousel analysis increased impressions per show while native-to-Feed visits stayed broadly flat."
          }
        },
        {
          "title": "A scalable SDK still had a market boundary",
          "paragraphs": [
            "By early 2022, we had to question where the next growth would come from. Market research found little room to expand simply by replacing competitors’ offerwalls. Many publishers already carried action-based rewards, and switching was difficult.",
            "My monetization strategy proposal identified three constraints: publishers needed a meaningful point system, native SDK support limited Web and hybrid reach, and onboarding depended on the capacity of our business development team. Heavy customization for major partners and self-service for smaller publishers pulled the product in different directions. Choosing the next customer meant choosing what to simplify."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "frames": [
                {
                  "title": "One system, different integration needs",
                  "format": "Comparison",
                  "brief": "Show the shared SDK foundation, configurable feed and entry points. Contrast a standard integration with the parts that still required bespoke work."
                }
              ]
            }
          ]
        },
        {
          "title": "Later: the offerwall itself became the constraint",
          "paragraphs": [
            "By 2025–2026, the question was no longer only how to add inventory inside our partner apps. More formats were competing in the same scrolling feed. Products placed near the bottom could be available without ever being seen. Reordering sections often moved attention from one product to another.",
            "A June 2026 internal review made that limit visible across publishers. In KakaoBank’s April data, the bottom action section reached 18% of the audience exposed to the top section. For KB StarBanking, shopping reached 11% of hub impression users while the two upper sections reached 93–95%. These use different denominators, but both exposed the cost of burying a product in a long feed.",
            "There was a market boundary too. By August 2026, supply reviews again identified publisher-point rewards as a barrier to entering new sectors. The next work had to address both discovery inside the hub and the value of the experience beyond its list of offers. Game UA explores participation after installation; the interaction composer tested reusable brand journeys, then led us toward more freedom and brand context for generation. They are related directions in that broader shift, rather than a single replacement for the offerwall."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "frames": [
                {
                  "title": "What people actually reach",
                  "format": "Comparison",
                  "brief": "Add an annotated full-length hub capture with section reach from one dated publisher analysis. Keep its denominator visible."
                }
              ]
            }
          ],
          "links": [
            {
              "label": "Game UA: from an install to sustained participation",
              "url": "/work/game-ua-multi-mission/"
            },
            {
              "label": "The interaction composer: research that changed our direction",
              "url": "/work/interaction-composer/"
            }
          ]
        }
      ],
      "review": {
        "credit": "Max’s account establishes the transition from design IC to roughly two years of supply PO/PM responsibility. The 2021–2022 team charter names Max as PO, Diane as PM and Dio as technical owner. Experiment credits remain with the team; Cathie authored the cited analysis.",
        "figures": [
          {
            "value": "10 million monthly active users",
            "context": "Official company history, May 2019. Whole-company milestone. The October 2021 release uses monthly users and does not document deduplication; no precise like-for-like growth rate is inferred."
          },
          {
            "value": "150+ premium publishers",
            "context": "Buzzvil network-wide figure, company-reported October 2021. Not the number using this particular offerwall redesign."
          },
          {
            "value": "20 million monthly users",
            "context": "Buzzvil network-wide figure, company-reported October 2021. Unique-user methodology is not disclosed; do not use as a design-attributed growth curve."
          },
          {
            "value": "₩12.3B to ₩22.3B company revenue; +81% year over year",
            "context": "Public Buzzvil release, 28 October 2021: Q3 2020 versus Q3 2021, company-wide revenue. Not Feed revenue or causal evidence for an interface change. Gross/net and acquisition-adjustment basis are not specified."
          },
          {
            "value": "Two layout options",
            "context": "List and card in the September 2019 renewal notice. Product configuration scope, not experiment arms or measured winners."
          },
          {
            "value": "392.0M to 432.2M feed PVs; ₩3.37B to ₩3.61B revenue",
            "context": "Q3 2021 review: May–June vs July–August totals, all platforms. Wider publisher adoption is a documented contributor. Not annual totals or design-attributed uplift."
          },
          {
            "value": "+15.69% impressions/visit; +6.99% pRPM; −12.30% CTR",
            "context": "Honeyscreen Android feed A/B, 21 February–31 March 2022. No day-one/week-one retention difference. Report contains older year typos in its method; result dates and Q1 2022 OKRs agree."
          },
          {
            "value": "1 to 2.73 impressions per show",
            "context": "March 2022 Honeyscreen Android carousel before/after, carousel-version users only. Native-to-feed visits broadly flat; not a network-wide uplift."
          }
        ],
        "questions": [
          "Confirm the exact start and end months of the roughly two-year supply PO/PM remit.",
          "Choose archival captures for SDK customization, entry points and the 2022 feed experiment.",
          "Review internal aggregate revenue and partner-specific figures before any future publication."
        ],
        "sources": [
          {
            "label": "Buzzvil company history",
            "url": "https://www.buzzvil.com/company/about_us"
          },
          {
            "label": "20 September 2019 SDK UI notice",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/SUP/pages/1389428786/SDK+UI+2019.09.20"
          },
          {
            "label": "13 November 2019 iteration",
            "url": "https://buzzvil.slack.com/archives/DBMPBN858/p1573634275012800"
          },
          {
            "label": "Hypothesis of low CTR",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/MI/pages/551059819/Hypothesis+of+low+CTR"
          },
          {
            "label": "A B test management",
            "url": "https://buzzvil.atlassian.net/wiki/spaces/MI/pages/535855337/A+B+Test+Management+Document"
          },
          {
            "label": "28 June 2021 feed focus",
            "url": "https://buzzvil.slack.com/archives/C01J573LRG9/p1624856321175700"
          },
          {
            "label": "Buzzvil Q3 2021 release",
            "url": "https://www.newswire.co.kr/newsRead.php?no=933111"
          },
          {
            "label": "Maxence Mauduit resume",
            "url": "https://mmaxence.me/images/Maxence-Mauduit_Resume-2026.pdf"
          },
          {
            "label": "2020 Offerwall tabs exploration",
            "url": "https://www.figma.com/design/B3K5wARA1swOvdNvcN9gUG?node-id=717-137"
          },
          {
            "label": "Nucleus rough journey map",
            "url": "https://www.figma.com/design/A9IEzf28pnWKrSrfiNnumV?node-id=92-38"
          },
          {
            "label": "February 2021 bottom sheet",
            "url": "https://www.figma.com/design/kbxSbDoZ5iI9S4bXcqe5on?node-id=2-1663"
          },
          {
            "label": "Supply SDK team · 2021–2022 remit and strategy",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2197389336"
          },
          {
            "label": "Supply Product Roadmap · 2021",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2138079396"
          },
          {
            "label": "Supply Product QBR · Q3 2021",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2415362262"
          },
          {
            "label": "Feed UI A/B analysis · version 2",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2701525706"
          },
          {
            "label": "Carousel inventory analysis · 2022",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2748481537"
          },
          {
            "label": "Offerwall market penetration research · January 2022",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2627764323"
          },
          {
            "label": "Max’s monetization strategy proposal · February 2022",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2642641123"
          },
          {
            "label": "Limits of the single-level hub · June 2026",
            "url": "https://buzzvil.atlassian.net/wiki/pages/5100503176"
          },
          {
            "label": "Supply MBR · 28 August 2026",
            "url": "https://buzzvil.atlassian.net/wiki/pages/5197431002"
          },
          {
            "label": "Carousel Ad inventory PRD · delivery-model decision",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2597617699"
          },
          {
            "label": "Carousel integration guide",
            "url": "https://buzzvil.atlassian.net/wiki/pages/2690416838"
          },
          {
            "label": "Honeyscreen · current official app listing",
            "url": "https://play.google.com/store/apps/details?id=com.buzzvil.adhours&hl=en_US"
          },
          {
            "label": "Max’s story · Buzzvil, 30 August 2022",
            "url": "https://tech.buzzvil.com/en/blog/max-story"
          }
        ],
        "boundaries": [
          "Buzzvil company history. Public retrospective. In-app Buzzbenefit dates to April 2018. The 2019–2022 page is a focus period; it is not the invention date of the offerwall.",
          "20 September 2019 SDK UI notice. Internal archived notice, copied December 2020. List/card and coordinated accent color; no publisher UI implementation required. Supports offered/planned configuration, not completion of every rollout phase or sole authorship.",
          "13 November 2019 iteration. Internal. Max shared Offerwall Figma iteration for review. Surviving 2020 alternatives must not be called unchanged 2019 screens.",
          "Hypothesis of low CTR. Internal, January 2020. Lower-than-expected Nucleus CTR and Max’s hypothesis that reward communication went unnoticed. A hypothesis, not a proven cause or fixed outcome.",
          "A B test management. Internal, March 2020. Credits Max’s sign-in versus redirect UX; warns that small samples are date-sensitive. Numerical improvement is not established.",
          "28 June 2021 feed focus. Internal. Supports the move toward feed and Benefit SDK. The inspected February bottom-sheet deck is a presentation with placeholder creatives, and Max said he had no figures.",
          "Buzzvil Q3 2021 release. Public, company-supplied, 28 October 2021. 150+ publishers and 20M monthly users describe the whole network. Revenue, even when public, cannot prove UI impact.",
          "Maxence Mauduit resume. Public first-person context. PM and Head of Design dates differ from the portfolio timeline; review before publication.",
          "12 October 2026: role transition and approximate two-year duration supplied directly by Max. Do not imply Max was the sole PM throughout; the team charter explicitly names Diane as PM.",
          "New Confluence sources read in full on 12 October 2026. QBR totals and experiment results have distinct scopes. The 2026 inventory findings are a later coda, not results of the 2019–2022 work.",
          "The June 2026 format-limit document is an internal synthesis. Its publisher reach denominators differ. The August 2026 MBR describes a strategic problem, not a completed product pivot.",
          "18 October 2026: Max identifies PM and PD responsibility for “1 feed 4 all,” connecting ad units to a central offerwall, and creation of the horizontal native carousel with a feed link and final see-more card. Substantial feed-impression growth and continued ecosystem development are first-person qualitative claims; no causal percentage is supplied. The visual is a newly drawn schematic, not an archival product screen.",
          "18 October 2026 Figma visual research: original frames exported read-only, visually inspected and saved as lossless WebP at source resolution. Captions distinguish archival designs from production and experiment evidence. Source-frame links are included beside each comparison. See docs/reviews/2026-10-18-figma-visuals.md.",
          "18 October 2026: exported the 2021 Output Feed improvements file and February 2022 Carousel UI file shared by Max. Original example ads, point values and component-board backgrounds retained. Native carousel entry points are distinct from cards inside the Feed. The carousel PRD records the change from a bundled SDK UI to an integration guide/sample implementation with Feed-promotion support; no new performance attribution is inferred.",
          "19 October 2026: verified the public company history and 28 October 2021 release. Network audience and quarterly company revenue are now visible business context. Product totals and experiments retain their original scopes. Honeyscreen remains linked as Buzzvil’s own consumer rewards app; the broader SDK serves other publishers."
        ],
        "updated": "19 October 2026"
      },
      "opening": "The next step was not another ad unit. It was making the ones we already had lead somewhere together.",
      "readingPath": [
        {
          "chapter": 1,
          "label": "One feed for every entry point"
        },
        {
          "chapter": 3,
          "label": "The last card has a different job"
        },
        {
          "chapter": 4,
          "label": "More exposure. A more complicated result."
        }
      ]
    }
  },
  {
    "slug": "lockscreen",
    "title": "The lockscreen",
    "kicker": "Scaling the first screen of the phone, from creative production to a lasting system.",
    "years": "2014 – 2019",
    "group": "company",
    "context": "Buzzvil · Interaction design, creative systems & partner experience",
    "call": "The lockscreen was the first product I worked on at Buzzvil. People could discover content, engage with an ad, and collect points from the first screen of their phone. A familiar gesture had to carry a new value exchange without making the phone harder to use.",
    "foundation": "Templates and advertiser guidelines replaced repetitive creative production. Native-ad templates then extended the same logic to ad networks: one system could turn incoming assets into lockscreen experiences at scale.",
    "shipped": "The team eventually stopped adapting creatives by hand and redirected marketing design resources toward brand and product design. The native-ad template system continued to evolve; nearly eight years later, those templates still serve the lockscreen.",
    "project": {
      "status": [],
      "sections": [
        {
          "title": "A small interaction repeated all day",
          "paragraphs": [
            "The lockscreen was the first product I worked on at Buzzvil. People could discover content, engage with an ad, and collect points from the first screen of their phone. A familiar gesture had to carry a new value exchange without making the phone harder to use.",
            "I joined in late 2014, when the company was still focused on Honeyscreen, its consumer app. Over the following years, my work expanded from that app to the interaction patterns and partner experiences behind our lockscreen SDK.",
            "Scaling that product was also an operational design problem. Each campaign needed a creative that worked on the lockscreen. At first, that meant our own designers adapting the artwork by hand.",
            "The company’s public history records 2.5 million Korean users in November 2014 and the lockscreen SDK launch in May 2015. By August 2018, Buzzvil reported more than 50 publishing partners and 5.4 billion monthly ad impressions. These are different measures of company scale: the early user figure does not specify monthly activity, and impressions count ad deliveries."
          ]
        },
        {
          "title": "Make room for the user’s original intention",
          "paragraphs": [
            "Someone picking up their phone already has something to do. The interface had to let them continue, while making content and rewards understandable at a glance.",
            "That tension shaped the work at the gesture level. In our 2016 research preparation, I asked whether people had difficulty unlocking their phone, opening a campaign, or reading content. These were different jobs, even when they started on the same screen. The design needed to make each path predictable."
          ]
        },
        {
          "title": "Stop redesigning every ad",
          "paragraphs": [
            "When I joined, two marketing designers were transforming incoming creatives into lockscreen ads. The work was heavy and repetitive. Growing campaign volume meant more production work for the same small team.",
            "I introduced templates and creative guidelines advertisers could follow themselves. The aim was to help them represent their brand and product well on the lockscreen, while moving the recurring adaptation work out of our team. Design became the system that made good creative possible, rather than a production step every campaign had to pass through.",
            "Over time, we stopped doing that adaptation work entirely. We redirected our marketing design resources toward brand and product design. The change was not just a faster way to make ads; it changed what our designers could spend their time on."
          ],
          "visuals": [
            {
              "afterParagraph": 2,
              "rewardJourney": "templates"
            }
          ],
          "takeaway": {
            "label": "The decision",
            "text": "Move repeated production into templates and advertiser guidance, so the team can spend its time on brand and product design."
          }
        },
        {
          "title": "From advertiser guidelines to automated creative",
          "paragraphs": [
            "Later, the business expanded beyond direct sales to ad networks. We could not ask a designer to adapt every incoming network ad. The same principle had to become automatic.",
            "We built templates that assembled lockscreen creatives from native ads. Instead of preparing each campaign separately, we designed multiple reusable treatments and refined them over several iterations. The work moved from producing individual assets to deciding how incoming advertising material should become a coherent lockscreen.",
            "Those templates still run on the lockscreen nearly eight years later. They have been updated along the way. Their longevity comes from a repeatable system that the team could maintain, rather than one finished campaign."
          ],
          "flow": {
            "title": "Native ad to lockscreen · reconstructed system",
            "steps": [
              {
                "actor": "Ad network",
                "title": "Supply the native ad",
                "detail": "Incoming advertising material becomes the input, without a manual lockscreen adaptation for every creative."
              },
              {
                "actor": "Template system",
                "title": "Build the creative",
                "detail": "Reusable treatments assemble that material into a lockscreen creative."
              },
              {
                "actor": "Lockscreen",
                "title": "Deliver the experience",
                "detail": "The template carries the layout; the incoming ad carries the brand and product."
              }
            ],
            "note": "A schematic of the operating model, not a screenshot or a specification of the current rendering implementation. Multiple templates and later revisions are part of the story."
          },
          "visuals": [
            {
              "afterParagraph": 2,
              "paired": true,
              "media": [
                {
                  "type": "image",
                  "src": "/work/lockscreen/native-square.webp",
                  "width": 360,
                  "height": 640,
                  "displayWidth": 360,
                  "alt": "Archived square-image native creative with title and sponsored label on a lockscreen",
                  "caption": "Archived template · Square image, headline and sponsorship. Original example creative retained; the precise revision date and production status of this frame are unverified."
                },
                {
                  "type": "image",
                  "src": "/work/lockscreen/native-landscape.webp",
                  "width": 360,
                  "height": 640,
                  "displayWidth": 360,
                  "alt": "Archived wide-image native creative with headline, description and sponsored label",
                  "caption": "Archived template · Landscape image with headline and description. This is a different input format, not a before/after result."
                }
              ],
              "archive": true
            }
          ],
          "links": [
            {
              "label": "Original square-image template",
              "url": "https://www.figma.com/design/MlqPPWob7yeVqxCZSHO4onjm?node-id=219-426"
            },
            {
              "label": "Original landscape-image template",
              "url": "https://www.figma.com/design/MlqPPWob7yeVqxCZSHO4onjm?node-id=219-141"
            }
          ],
          "details": [
            "The archive records the practical rules behind the variations: wide-device coverage, text line limits and an explored crop of roughly 8% from the top and bottom of an image. These are documented design considerations, not evidence that every rule shipped unchanged."
          ],
          "takeaway": {
            "label": "The next problem",
            "text": "Ad-network supply made the same idea an automation problem: assemble the incoming material without a designer adapting each ad."
          }
        },
        {
          "title": "From one app to many publishers",
          "paragraphs": [
            "As Buzzvil moved into B2B, the same interaction had to work inside different partner relationships. Publishers brought their own brands and point systems. We needed a shared product that could carry those differences without becoming a separate design project every time.",
            "My role combined early concepts, complete flows, and wireframes with design direction for the team. Other designers refined the interface and prepared assets for integration. The work was both hands-on and organizational: deciding what should stay consistent, what could change, and how the team would deliver it repeatedly."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "frames": [
                {
                  "title": "One foundation, several publishers",
                  "format": "Comparison",
                  "brief": "Place representative partner lockscreens together to show shared behavior and allowed variation."
                }
              ]
            }
          ]
        },
        {
          "title": "Two months to change the model",
          "paragraphs": [
            "At the end of 2017, Google changed its lockscreen policy. We had two months before it took effect. A surface we had spent years building around could no longer be distributed through partner apps in the same way.",
            "We had to change the product’s distribution model within that window. The response was a dedicated lockscreen app alongside each partner’s main app. I worked on migration scenarios and coordinated the design response: installation, opt-in, first use, partner assets and guidance all had to make sense as one journey.",
            "The four migration states came from two practical questions: had the user updated the main app, and was the lockscreen enabled? What had been a familiar interaction now depended on getting people safely through a new app relationship."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "rewardJourney": "migration"
            },
            {
              "afterParagraph": 2,
              "table": {
                "title": "Four starting states to design for",
                "columns": [
                  "Main app",
                  "Lockscreen"
                ],
                "rows": [
                  [
                    "Updated",
                    "Enabled"
                  ],
                  [
                    "Updated",
                    "Disabled"
                  ],
                  [
                    "Not updated",
                    "Enabled"
                  ],
                  [
                    "Not updated",
                    "Disabled"
                  ]
                ],
                "caption": "Reconstructed from the December 2017 migration notes. These are starting conditions, not verified final migration screens or success rates."
              }
            },
            {
              "afterParagraph": 2,
              "frames": [
                {
                  "title": "Guiding the migration",
                  "format": "Screenshot",
                  "brief": "Add the actual migration prompts and destination screens beside the four-state model."
                }
              ]
            }
          ],
          "takeaway": {
            "label": "The pivot",
            "text": "The familiar lockscreen now depended on a new app relationship. Installation, opt-in and first use became part of the core design problem."
          },
          "links": [
            {
              "label": "BuzzScreen · live SDK documentation",
              "url": "https://buzzvil.atlassian.net/wiki/spaces/BDG/pages/717422763/BuzzScreen"
            }
          ]
        },
        {
          "title": "Apply the same discipline to partner migration",
          "paragraphs": [
            "The migration created another kind of production burden: bundles of first-use and marketing assets for each partner, while the product itself was changing. I pushed toward a more consistent asset system here too, so that every partner would not restart the same work.",
            "This was a tradeoff. More local customization gave partners flexibility, but increased the work of keeping the experience coherent. The migration forced us to make that boundary explicit."
          ],
          "visuals": [
            {
              "afterParagraph": 1,
              "frames": [
                {
                  "title": "A consistent installation journey",
                  "format": "Comparison",
                  "brief": "Show the refined store assets and in-app guidance that followed the first migration."
                }
              ]
            }
          ]
        },
        {
          "title": "Save the lockscreen. Build beyond it.",
          "paragraphs": [
            "The immediate pivot kept the lockscreen alive through companion apps. It also changed the question for the next product: how could we deliver rewards without relying on that one platform-controlled surface?",
            "In-app rewards opened another path. The company dates Buzzbenefit’s launch to April 2018; the lockscreen continued alongside it. My work moved toward the offerwall and then ownership of the wider supply product. The partner adaptations we had learned to deliver under pressure became a different design problem: turn customization into a scalable SDK."
          ],
          "links": [
            {
              "label": "Continue with the Offerwall: from designer to supply product owner",
              "url": "/work/offerwall/"
            }
          ]
        }
      ],
      "review": {
        "credit": "My documented contribution spans concepts, complete flows, wireframes and coordination. Derek refined interface mockups; Ahreumong led migration asset production, with other design support. Company scale reflects many teams. Max also introduced advertiser templates and creative guidelines that replaced internal campaign adaptation. Native-ad template delivery and subsequent iterations were a team effort.",
        "figures": [
          {
            "value": "2.5 million Korean users",
            "context": "Official company history, November 2014, during the Honeyscreen era. Reported users; not specified as MAU. Do not compare as a growth rate with later network monthly-user counts."
          },
          {
            "value": "50+ publishing partners",
            "context": "Company-wide network reported August 2018, not integrations personally shipped by Max."
          },
          {
            "value": "5.4 billion monthly impressions",
            "context": "Company-reported August 2018. Served impressions, not unique people; the observation month is not specified."
          },
          {
            "value": "30 countries",
            "context": "Company distribution footprint reported August 2018. Not 30 localized versions or an individual design outcome."
          },
          {
            "value": "Four migration scenarios",
            "context": "Design scope from December 2017 notes: main app updated or not, lockscreen enabled or not. A state model, not a success rate."
          },
          {
            "value": "Two months",
            "context": "Google policy lead time, supplied by Max. Do not infer exact notice/enforcement days or a complete in-app migration from this duration."
          }
        ],
        "questions": [
          "Confirm that 2014–2019 is the portfolio focus period. Honeyscreen predated your arrival and the lockscreen continued afterward.",
          "Which gesture or onboarding decision is most distinctly yours, and which original early screen can represent 2014 honestly?",
          "Which customization boundary actually shipped after migration? The surviving January 2018 message records the proposal.",
          "Do you have a period-specific migration, usability or integration-time measure with dates and denominators? Current metrics establish company scale only."
        ],
        "sources": [
          {
            "label": "Max’s story from design to product leadership",
            "url": "https://medium.com/design-bootcamp/maxs-story-from-design-to-product-leadership-d9007dbe3a1d"
          },
          {
            "label": "14 July 2016 research preparation",
            "url": "https://buzzvil.slack.com/archives/D086KP5UJ/p1468478409000009"
          },
          {
            "label": "18 December 2017 design coordination",
            "url": "https://buzzvil.slack.com/archives/D086KP5UJ/p1513561692000086"
          },
          {
            "label": "21 December 2017 four scenarios",
            "url": "https://buzzvil.slack.com/archives/D033CLXRZ/p1513852226000283"
          },
          {
            "label": "18 January 2018 division of work",
            "url": "https://buzzvil.slack.com/archives/D033CLXRZ/p1516241906000161"
          },
          {
            "label": "Buzzvil rebounds after suspension",
            "url": "https://appdevelopermagazine.com/buzzvil-rebounds-after-google-play-store-suspended-their-app/"
          },
          {
            "label": "August 2018 company release",
            "url": "https://www.prnewswire.com/news-releases/largest-lockscreen-media-platform-buzzvil-acquires-india-and-pakistans-slideapp-300703902.html"
          },
          {
            "label": "Halla onboarding tutorial",
            "url": "https://www.figma.com/design/aXJP6LW8Xb2N1TAAWI4w57Al?node-id=112-2"
          },
          {
            "label": "Archived Sketch-era template",
            "url": "https://www.figma.com/design/MlqPPWob7yeVqxCZSHO4onjm?node-id=1-61"
          },
          {
            "label": "Halla 2.1 · detailed design feedback",
            "url": "https://buzzvil.atlassian.net/wiki/pages/388202800"
          },
          {
            "label": "Channel · December 2018 concept based on Halla 2.1",
            "url": "https://buzzvil.atlassian.net/wiki/pages/282329344"
          },
          {
            "label": "Honeyscreen · current official app listing",
            "url": "https://play.google.com/store/apps/details?id=com.buzzvil.adhours&hl=en_US"
          },
          {
            "label": "Max’s story · Buzzvil, 30 August 2022",
            "url": "https://tech.buzzvil.com/en/blog/max-story"
          },
          {
            "label": "Buzzvil company history · Honeyscreen and SDK milestones",
            "url": "https://www.buzzvil.com/en/company/about_us"
          }
        ],
        "boundaries": [
          "Max’s story from design to product leadership. Public first-person article, 5 September 2022; only accessible introduction used. Supports late-2014 arrival and Honeyscreen focus. Product existed before Max joined.",
          "14 July 2016 research preparation. Internal. Max asks about unlocking, engaging campaigns and reading content. Questions are not measured usability findings.",
          "18 December 2017 design coordination. Internal. Standalone app migration and production support. Max coordinates; Ahreumong leads asset production. Not sole ownership of the recovery.",
          "21 December 2017 four scenarios. Internal. Main-app update and lockscreen-enabled conditions support a four-state reconstruction. Final screen content requires original approved exports.",
          "18 January 2018 division of work. Internal. Max’s concept, flows and wireframes; Derek’s refined mockups. Consistent marketing assets and limits on customization are proposed; full rollout is not established.",
          "Buzzvil rebounds after suspension. Public secondary report, 23 May 2018; internal messages corroborate the migration. Dedicated lockscreen apps remained possible. Ambiguous migration percentages and historical revenue are excluded.",
          "August 2018 company release. Public, company-supplied, 30 August 2018. 50+ publishing partners, 5.4B monthly impressions, 30 countries. Scale context with date and attribution, not design causality.",
          "Max supplied the two-month Google policy window on 12 October 2026. This describes the urgent distribution pivot to companion apps. The separate April 2018 in-app launch must not be described as completed inside that same window.",
          "18 October 2026: Max describes two marketing designers adapting each creative when he joined; his introduction of advertiser templates and guidelines; eventual retirement of internal adaptation and reassignment of marketing design resources to brand and product design. He also describes native-ad templates for ad-network supply, multiple treatments and revisions, and continued lockscreen use nearly eight years later. These are first-person historical claims, not independently audited staffing, throughput or current production-code measurements. No exact launch year, template count or quantified efficiency gain is inferred.",
          "18 October 2026 Figma visual research: original frames exported read-only, visually inspected and saved as lossless WebP at source resolution. Captions distinguish archival designs from production and experiment evidence. Source-frame links are included beside each comparison. See docs/reviews/2026-10-18-figma-visuals.md.",
          "18 October 2026 Halla research: inspected full UI Instances page in Halla Layout and read the Channel proposal and Halla 2.1 detailed feedback. Feed, Favorites, Explore, utility overlays and persistent unlock are visible design scope. Exact release dates and adoption are not established. Halla is presented as a later evolution; Max identifies it as possibly the most advanced lockscreen UI. The checkerboard-heavy Feed and Explore exports were replaced with intact original theme and Lab Features frames. Main feed imagery remains missing in the available export; no replacement imagery was invented. Team review suggestions are not asserted as all shipped or solely Max-authored.",
          "18 October 2026: user requested improved reconstructed product imagery. Added resolution-independent HTML/SVG presentation studies for the lockscreen and Halla. New illustrative artwork, typography and sample content are explicitly labeled; original archival exports remain for comparison. Demonstration buttons explain gesture intentions rather than simulate a production product.",
          "18 October 2026 narrative revision: removed the Halla feature chapter and archive screens from the case, at Max’s request. Its source narrative is preserved in docs/reviews/2026-10-18-lockscreen-halla-archive.json. Reconstructed lockscreen specimens reuse fictional FORME and FIELDWORK campaign assets; these advertisers, campaign copy and refreshed layouts are illustrative, not historic Buzzvil clients or shipped screens. The primary arc is creative operations, advertiser guidelines, native-ad automation, the 2017 companion-app pivot and the separate April 2018 move into in-app rewards.",
          "19 October 2026: verified the public company history and August 2018 company release. Visible scale figures describe the whole business, not Max-attributed results. Honeyscreen is linked to its official Buzzvil Google Play listing; the current app is not presented as unchanged historical UI."
        ],
        "updated": "19 October 2026"
      },
      "opening": "A simple lockscreen depended on a much larger system: creative production, advertiser input and partner distribution.",
      "readingPath": [
        {
          "chapter": 2,
          "label": "The work we stopped doing"
        },
        {
          "chapter": 3,
          "label": "Let the system assemble the ad"
        },
        {
          "chapter": 5,
          "label": "Two months to change the way in"
        }
      ]
    },
    "links": [
      {
        "label": "BuzzScreen · live SDK documentation",
        "url": "https://buzzvil.atlassian.net/wiki/spaces/BDG/pages/717422763/BuzzScreen"
      },
      {
        "label": "Buzzvil · current SDK and product guides",
        "url": "https://docs.buzzvil.com/"
      },
      {
        "label": "Honeyscreen · live rewards app",
        "url": "https://play.google.com/store/apps/details?id=com.buzzvil.adhours&hl=en_US"
      }
    ]
  }
];
