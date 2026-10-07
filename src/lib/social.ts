/**
 * Recommend's social accounts. One list for the footer and the contact page.
 *
 * Plain profile URLs: the share-sheet tracking parameters the app copied with them
 * (`_r`, `_t`, `stkn`) are left off — they identify the sharer, not the profile.
 */
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/chatrecommend/" },
  { label: "X", href: "https://x.com/heyrecommend" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/userecommend/" },
  { label: "TikTok", href: "https://www.tiktok.com/@userecommend01" },
] as const;
