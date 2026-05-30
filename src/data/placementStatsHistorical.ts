export interface YearRow {
  degree: string;
  students: number;
  registered: number;
  placedCount: number;
  higherStudiesCount: number;
  notPlacedCount: number;
  placedPct: number;
  higherStudiesPct: number;
  notPlacedPct: number;
  medianLpa: number;
}

export interface CompanyHire {
  name: string;
  count: number;
}

export interface YearStats {
  year: string;
  batchYear: number;
  rows: YearRow[];
  companyHires: CompanyHire[];
  summary: {
    totalStudents: number;
    totalPlaced: number;
    highestPackage: number;
    topRecruiters: string[];
  };
}

/** Batches before this year use fixed historical data; from 2026-27 onward stats are live from the DB. */
export const DYNAMIC_STATS_FROM_BATCH_YEAR = 2026;

export function batchYearToLabel(batchYear: number): string {
  const next = String(batchYear + 1).slice(-2);
  return `${batchYear}-${next}`;
}

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 10000) / 100;
}

function buildSummary(rows: YearRow[], companyHires: CompanyHire[]) {
  const totalStudents = rows.reduce((s, r) => s + r.students, 0);
  const totalPlaced = rows.reduce((s, r) => s + r.placedCount, 0);
  const highestPackage = rows.reduce((max, r) => Math.max(max, r.medianLpa), 0);
  const topRecruiters = [...companyHires]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((c) => c.name);

  return { totalStudents, totalPlaced, highestPackage, topRecruiters };
}

function rowFromCounts(
  degree: string,
  students: number,
  registered: number,
  placedCount: number,
  higherStudiesCount: number,
  medianLpa: number
): YearRow {
  const notPlacedCount = Math.max(0, registered - placedCount - higherStudiesCount);
  return {
    degree,
    students,
    registered,
    placedCount,
    higherStudiesCount,
    notPlacedCount,
    placedPct: pct(placedCount, registered),
    higherStudiesPct: pct(higherStudiesCount, registered),
    notPlacedPct: pct(notPlacedCount, registered),
    medianLpa: Math.round(medianLpa * 100) / 100,
  };
}

/** Fixed placement statistics for batches before 2026-27. */
export const HISTORICAL_PLACEMENT_STATS: YearStats[] = [
  {
    year: "2025-26",
    batchYear: 2025,
    rows: [
      rowFromCounts("MCA", 40, 35, 18, 0, 9),
      rowFromCounts("MTech (CSE)", 20, 17, 14, 0, 12),
      rowFromCounts("MTech (AI)", 20, 18, 1, 0, 6),
      rowFromCounts("IMTech", 60, 50, 11, 0, 14.8),
    ],
    companyHires: [
      { name: "TCS", count: 12 },
      { name: "Infosys", count: 8 },
      { name: "Wipro", count: 6 },
      { name: "Amazon", count: 5 },
      { name: "Microsoft", count: 4 },
      { name: "Google", count: 3 },
      { name: "Oracle", count: 2 },
    ],
    summary: buildSummary(
      [
        rowFromCounts("MCA", 40, 35, 18, 0, 9),
        rowFromCounts("MTech (CSE)", 20, 17, 14, 0, 12),
        rowFromCounts("MTech (AI)", 20, 18, 1, 0, 6),
        rowFromCounts("IMTech", 60, 50, 11, 0, 14.8),
      ],
      [
        { name: "TCS", count: 12 },
        { name: "Infosys", count: 8 },
        { name: "Wipro", count: 6 },
      ]
    ),
  },
];

export { buildSummary, rowFromCounts };
