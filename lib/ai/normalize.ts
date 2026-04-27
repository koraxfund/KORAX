export type DraftResult = {
  projectSummary: string;
  projectVerdict: string;
  brandAngle: string;
  originalityScore: string;
  utilityStrengthScore: string;
  marketFitScore: string;
  coreUtility: string[];
  differentiation: string[];
  tokenomicsPreview: {
    totalSupplySuggestion: string;
    presaleAllocationSuggestion: string;
    stakingAllocationSuggestion: string;
    treasuryAllocationSuggestion: string;
    liquidityAllocationSuggestion: string;
    notes: string;
  };
  launchPlan: {
    presaleRecommended: string;
    suggestedStageCount: string;
    fundingLogic: string;
    launchNotes: string;
  };
  roadmap: string[];
  weakPoints: string[];
  risks: string[];
  improvementActions: string[];
  pitch: string;
  koraxConversionNote: string;
};

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : fallback;
}

function asStringArray(v: unknown, len = 3): string[] {
  if (Array.isArray(v)) {
    return v.map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, Math.max(len, 1));
  }
  return [];
}

export function normalizeDraftResult(raw: any): DraftResult {
  return {
    projectSummary: asString(raw?.projectSummary),
    projectVerdict: asString(raw?.projectVerdict),
    brandAngle: asString(raw?.brandAngle),
    originalityScore: asString(raw?.originalityScore),
    utilityStrengthScore: asString(raw?.utilityStrengthScore),
    marketFitScore: asString(raw?.marketFitScore),
    coreUtility: asStringArray(raw?.coreUtility, 3),
    differentiation: asStringArray(raw?.differentiation, 3),
    tokenomicsPreview: {
      totalSupplySuggestion: asString(raw?.tokenomicsPreview?.totalSupplySuggestion),
      presaleAllocationSuggestion: asString(raw?.tokenomicsPreview?.presaleAllocationSuggestion),
      stakingAllocationSuggestion: asString(raw?.tokenomicsPreview?.stakingAllocationSuggestion),
      treasuryAllocationSuggestion: asString(raw?.tokenomicsPreview?.treasuryAllocationSuggestion),
      liquidityAllocationSuggestion: asString(raw?.tokenomicsPreview?.liquidityAllocationSuggestion),
      notes: asString(raw?.tokenomicsPreview?.notes),
    },
    launchPlan: {
      presaleRecommended: asString(raw?.launchPlan?.presaleRecommended),
      suggestedStageCount: asString(raw?.launchPlan?.suggestedStageCount),
      fundingLogic: asString(raw?.launchPlan?.fundingLogic),
      launchNotes: asString(raw?.launchPlan?.launchNotes),
    },
    roadmap: asStringArray(raw?.roadmap, 4),
    weakPoints: asStringArray(raw?.weakPoints, 3),
    risks: asStringArray(raw?.risks, 3),
    improvementActions: asStringArray(raw?.improvementActions, 3),
    pitch: asString(raw?.pitch),
    koraxConversionNote: asString(raw?.koraxConversionNote),
  };
}