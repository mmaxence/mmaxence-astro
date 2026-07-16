export interface PressItem {
  title: string; // original-language headline, verbatim
  titleEn?: string; // English gloss, only when the original is not English
  outlet: string;
  date: string; // ISO yyyy-mm-dd
  url: string;
  type: 'article' | 'interview' | 'podcast' | 'talk';
  note?: string; // one line: why it's here / what it covers
}

export const pressItems: PressItem[] = [
  {
    title: '버즈빌 AI 네이티브 반년 디자이너가 코드를 짠다',
    titleEn: 'Six months into AI-native at Buzzvil, designers write the code',
    outlet: 'Economic Review (이코노믹리뷰)',
    date: '2026-07-14',
    url: 'https://www.econovill.com/news/articleView.html?idxno=745129',
    type: 'article',
    note: "News feature on Buzzvil's AI-native transition — designers shipping code directly, with the design team's pull requests growing from 10 to 177 in a quarter.",
  },
  {
    title: "버즈빌 'AI 네이티브' 전환 6개월… 디자이너가 코드 만지고 엔지니어가 CRM 구축",
    titleEn: "Six months into Buzzvil's AI-native shift — designers touch code, an engineer builds the CRM",
    outlet: 'Platum (플래텀)',
    date: '2026-07-14',
    url: 'https://platum.kr/archives/290856',
    type: 'article',
    note: "Coverage of the AI-native transition, leading with the design team's move into direct code changes.",
  },
  {
    title: '버즈빌, AI 네이티브 전환 6개월만 업무 전반 재편',
    titleEn: 'Buzzvil reshapes how it works, six months into going AI-native',
    outlet: 'Digital Daily (디지털데일리)',
    date: '2026-07-14',
    url: 'https://www.ddaily.co.kr/page/view/2026071410253046288',
    type: 'article',
    note: "Covers the design team's 18x quarter-over-quarter growth in shipped pull requests.",
  },
  {
    title: '버즈빌, AI 네이티브 전환 6개월…직군 경계 허문 AI 협업 확산',
    titleEn: 'Six months AI-native at Buzzvil — AI collaboration across role boundaries',
    outlet: 'MADTimes (매드타임스)',
    date: '2026-07-14',
    url: 'https://www.madtimes.co.kr/news/articleView.html?idxno=28330',
    type: 'article',
    note: 'Ad-industry coverage of the transition, including designers reviewing and shipping code.',
  },
  {
    title: '버즈빌, AI 네이티브 전환 6개월… 직군 경계 허문 AI 협업 확산',
    titleEn: 'Six months AI-native at Buzzvil — AI collaboration across role boundaries',
    outlet: 'Brand Brief (브랜드브리프)',
    date: '2026-07-14',
    url: 'https://www.brandbrief.co.kr/news/articleView.html?idxno=10094',
    type: 'article',
    note: 'Brand-industry coverage of the transition and the design team’s role in it.',
  },
  {
    title: 'How a semester abroad turned into an 11-year journey as a design leader in Korea',
    outlet: 'Dev Korea',
    date: '2026-01-05',
    url: 'https://dev-korea.com/blog/semester-abroad-11-year-design-leader-career-korea',
    type: 'interview',
    note: 'Career interview — from a semester abroad at Hongik University to leading design at Buzzvil in Seoul.',
  },
];
