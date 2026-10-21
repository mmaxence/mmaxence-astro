// Public PR facts verified against GitHub on 2026-10-07.
// Keep private planning and unsubmitted ideas out of this portfolio record.
export interface ContributionProject {
  name: string;
  repository: string;
  contributions: { number: number; title: string; status: 'Merged' | 'Open' }[];
}
export const contributionsChecked = '2026-10-07';
export const contributionProjects: ContributionProject[] = [
  { name: 'Base UI', repository: 'mui/base-ui', contributions: [
    { number: 5246, title: 'Accessible loading-state announcements in the button demo', status: 'Merged' },
    { number: 5245, title: 'Persistent search icon in the command palette demo', status: 'Merged' },
    { number: 5247, title: 'Clearer TypeScript inference documentation for autocomplete', status: 'Merged' },
  ] },
  { name: 'React Email', repository: 'resend/react-email', contributions: [
    { number: 3704, title: 'Brevo integration example', status: 'Merged' },
    { number: 3709, title: 'Mailtrap integration example', status: 'Merged' },
    { number: 3710, title: 'Mailchimp Transactional integration example', status: 'Merged' },
    { number: 3717, title: 'ZeptoMail integration example', status: 'Merged' },
  ] },
  { name: 'Supabase', repository: 'supabase/supabase', contributions: [
    { number: 47988, title: 'Magic Link authentication blocks for React and Next.js', status: 'Open' },
    { number: 47987, title: 'Accessible names and live regions for chat and file uploads', status: 'Open' },
  ] },
  { name: 'BlockNote', repository: 'TypeCellOS/BlockNote', contributions: [
    { number: 3016, title: 'Dedicated image alt text, with editing and HTML round-trip support', status: 'Open' },
  ] },
  { name: 'Nivo', repository: 'plouc/nivo', contributions: [
    { number: 2847, title: 'Accessible labels and descriptions for Marimekko charts', status: 'Open' },
  ] },
  { name: 'AI Elements', repository: 'vercel/ai-elements', contributions: [
    { number: 449, title: 'Prevent Enter from submitting a prompt while a response is streaming', status: 'Open' },
  ] },
];
