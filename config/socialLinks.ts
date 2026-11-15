import type { BrandName } from "@/components/brand-logo";

export type SocialAnimationRow = 1 | 2;

export interface SocialPlatform {
  id: string;
  name: string;
  url: string;
  icon: BrandName;
  brandColor: string;
  animationRow: SocialAnimationRow;
  bubbleSize: number;
  floatDelay: number;
}

export const socialLinks = [
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/mamuncoder07",
    icon: "GitHub",
    brandColor: "#181616",
    animationRow: 1,
    bubbleSize: 108,
    floatDelay: -1.2,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mamun-reja-269192336",
    icon: "LinkedIn",
    brandColor: "#0A66C2",
    animationRow: 1,
    bubbleSize: 96,
    floatDelay: -2.5,
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/mamunraj07.py/?hl=en",
    icon: "Instagram",
    brandColor: "#E4405F",
    animationRow: 1,
    bubbleSize: 112,
    floatDelay: -0.6,
  },
  {
    id: "leetcode",
    name: "LeetCode",
    url: "https://leetcode.com/u/CodewithMamun/",
    icon: "LeetCode",
    brandColor: "#FFA116",
    animationRow: 2,
    bubbleSize: 104,
    floatDelay: -2.1,
  },
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/people/Mamun-Reja/pfbid0k2tJjMcbfja5GRDLpLfwZ96JuifJ6nbafjJK2g8ja1FqZwrnnvXZ52PzMZjLdnF7l/",
    icon: "Facebook",
    brandColor: "#0866FF",
    animationRow: 2,
    bubbleSize: 96,
    floatDelay: -0.8,
  },
  {
    id: "x",
    name: "X",
    url: "https://x.com/mamuncoder07",
    icon: "X",
    brandColor: "#000000",
    animationRow: 2,
    bubbleSize: 112,
    floatDelay: -3.2,
  },
] as const satisfies readonly SocialPlatform[];
