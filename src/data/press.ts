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
];
