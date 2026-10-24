import { WORK_SLUGS } from '../data/work-order';
export { WORK_SLUGS } from '../data/work-order';

export const WORK_PROGRESS_KEY = 'mmaxence:work-progress:v1';
export type WorkSlug = (typeof WORK_SLUGS)[number];
export type WorkProgress = Record<string, number>;
export type WorkProgressSummary = { xp: number; level: number; completed: number; total: number };
export type WorkProgressDetail = { progress: WorkProgress; summary: WorkProgressSummary };

const emptyProgress = (): WorkProgress => Object.fromEntries(WORK_SLUGS.map(slug => [slug, 0]));
let memory = emptyProgress();
export type WorkReward = {slug:string;from:number;to:number};
const REWARD_KEY='mmaxence:work-rewards:v1';
let pendingRewards:WorkReward[]=[];
function readRewards():WorkReward[]{
  try{const value=JSON.parse(sessionStorage.getItem(REWARD_KEY)||'[]');return Array.isArray(value)?value.filter(r=>WORK_SLUGS.includes(r.slug)&&Number.isFinite(r.from)&&Number.isFinite(r.to)&&r.from>=0&&r.to<=100&&r.to>r.from):[];}catch{return pendingRewards;}
}
export function takeWorkRewards():WorkReward[]{const result=readRewards();pendingRewards=[];try{sessionStorage.removeItem(REWARD_KEY);}catch{}return result;}
function queueReward(slug:string,from:number,to:number){
  const rewards=readRewards(),existing=rewards.find(r=>r.slug===slug);
  if(existing)existing.to=to;else rewards.push({slug,from,to});
  pendingRewards=rewards;try{sessionStorage.setItem(REWARD_KEY,JSON.stringify(rewards));}catch{}
}

function validate(value: unknown): WorkProgress {
  const progress = emptyProgress();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return progress;
  for (const slug of WORK_SLUGS) {
    const percent = (value as Record<string, unknown>)[slug];
    if (typeof percent === 'number' && Number.isFinite(percent)) {
      progress[slug] = Math.min(100, Math.max(0, Math.floor(percent)));
    }
  }
  return progress;
}

function readStorage(): WorkProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(WORK_PROGRESS_KEY);
    return stored === null ? null : validate(JSON.parse(stored));
  } catch {
    // Storage can be unavailable in a private or restricted browser. Keep this visit usable.
    return null;
  }
}

export function getProgress(): WorkProgress {
  const stored = readStorage();
  if (stored) for (const slug of WORK_SLUGS) memory[slug] = Math.max(memory[slug], stored[slug]);
  return { ...memory };
}

function summarize(progress: WorkProgress): WorkProgressSummary {
  const xp = WORK_SLUGS.reduce((sum, slug) => sum + progress[slug], 0);
  const completed=WORK_SLUGS.filter(slug => progress[slug] === 100).length;
  return {
    xp,
    level: completed,
    completed,
    total: WORK_SLUGS.length,
  };
}

export function getSummary(): WorkProgressSummary {
  return summarize(getProgress());
}

function announce() {
  if (typeof window === 'undefined') return;
  const progress = { ...memory };
  window.dispatchEvent(new CustomEvent<WorkProgressDetail>('work-progress', {
    detail: { progress, summary: summarize(progress) },
  }));
}

function persist() {
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(WORK_PROGRESS_KEY, JSON.stringify(memory)); }
    catch { /* The in-memory fallback still updates the path for this visit. */ }
  }
  announce();
}

export function saveProgress(slug: string, percent: number): void {
  if (!WORK_SLUGS.includes(slug as WorkSlug) || !Number.isFinite(percent)) return;
  const current = getProgress();
  const next = Math.min(100, Math.max(0, Math.floor(percent)));
  if (next <= current[slug]) return;
  queueReward(slug,current[slug],next);
  memory[slug] = next;
  persist();
}

export function resetProgress(): void {
  memory = emptyProgress();
  takeWorkRewards();
  persist();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key !== WORK_PROGRESS_KEY && event.key !== null) return;
    // An explicit reset in another tab must also clear this tab's in-memory copy.
    try { memory = event.newValue === null ? emptyProgress() : validate(JSON.parse(event.newValue)); }
    catch { return; }
    announce();
  });
}
