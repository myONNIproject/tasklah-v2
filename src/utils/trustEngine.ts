/**
 * TaskLah! Trinity of Trust Engine v2.0
 * Calculates the 1.0 - 5.0 Trust Score based on user activity.
 */

interface TrustComponents {
  completionRate: number; // 0.0 to 1.0
  peerRating: number;     // 0.0 to 5.0
  disputeFrequency: number; // 0.0 to 1.0 (lower is better)
  communityStanding: number; // 0.0 to 1.0
}

export const calculateTrustScore = (components: TrustComponents): number => {
  const { completionRate, peerRating, disputeFrequency, communityStanding } = components;

  // Normalizing star rating to 0-1 scale
  const normalizedRating = peerRating / 5;
  
  // Weights from Section 1.2 of the Spec
  const score = (
    (completionRate * 0.35) +
    (normalizedRating * 0.30) +
    ((1 - disputeFrequency) * 0.20) +
    (communityStanding * 0.10) +
    (0.05 * 1.0) // Longevity bonus (default for now)
  );

  // Return formatted 1.0 - 5.0 score
  return Math.min(5.0, Math.max(1.0, score * 5));
};

export const getTrustBand = (score: number) => {
  if (score >= 4.5) return { label: "Grandmaster", color: "text-purple-600", bg: "bg-purple-50" };
  if (score >= 4.0) return { label: "Expert", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 3.0) return { label: "Journeyman", color: "text-green-600", bg: "bg-green-50" };
  if (score >= 2.0) return { label: "Apprentice", color: "text-amber-600", bg: "bg-amber-50" };
  return { label: "Novice", color: "text-slate-600", bg: "bg-slate-50" };
};
