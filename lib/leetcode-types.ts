export type LeetCodeProfileData = {
  username: string;
  profileName: string | null;
  totalSolved: number | null;
  easySolved: number | null;
  mediumSolved: number | null;
  hardSolved: number | null;
  totalQuestions: number | null;
  totalEasy: number | null;
  totalMedium: number | null;
  totalHard: number | null;
  globalRanking: number | null;
  acceptanceRate: number | null;
  contestRating: number | null;
  contestGlobalRanking: number | null;
  contestTopPercentage: number | null;
  contestAttend: number | null;
  submissionCalendar: Record<string, number> | null;
  lastUpdated: string;
};

export type LeetCodeDataErrorCode = "not-found" | "rate-limited" | "unavailable";
