import { Department, Stream } from "@prisma/client";
import prisma from "../config/prisma";
import {
  batchYearToLabel,
  buildSummary,
  DYNAMIC_STATS_FROM_BATCH_YEAR,
  rowFromCounts,
  YearStats,
} from "../data/placementStatsHistorical";

const DEGREE_PROGRAMS: Array<{
  label: string;
  department: Department;
  stream: Stream | null;
}> = [
  { label: "MCA", department: "MCA", stream: null },
  { label: "MTech (CSE)", department: "MTECH", stream: "CSE" },
  { label: "MTech (AI)", department: "MTECH", stream: "AI" },
  { label: "MTech (IT)", department: "MTECH", stream: "IT" },
  { label: "IMTech", department: "IMTECH", stream: null },
];

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function matchesProgram(
  department: Department,
  stream: Stream | null,
  program: (typeof DEGREE_PROGRAMS)[number]
): boolean {
  if (department !== program.department) return false;
  if (program.department === "MTECH") {
    return stream === program.stream;
  }
  return true;
}

export async function buildDynamicYearStats(batchYear: number): Promise<YearStats> {
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      studentProfile: { batchYear },
    },
    select: {
      placed: true,
      studentProfile: {
        select: { department: true, stream: true },
      },
      applications: {
        where: { status: "SELECTED" },
        select: {
          company: { select: { name: true, package: true } },
        },
      },
    },
  });

  const rows = DEGREE_PROGRAMS.map((program) => {
    const group = students.filter((s) => {
      const profile = s.studentProfile;
      if (!profile) return false;
      return matchesProgram(profile.department, profile.stream, program);
    });

    const studentsCount = group.length;
    const registered = studentsCount;
    const placedCount = group.filter((s) => s.placed).length;
    const packages = group
      .filter((s) => s.placed)
      .flatMap((s) => s.applications.map((a) => a.company.package))
      .filter((p) => p > 0);

    return rowFromCounts(
      program.label,
      studentsCount,
      registered,
      placedCount,
      0,
      median(packages)
    );
  });

  const companyMap = new Map<string, number>();
  for (const student of students) {
    if (!student.placed) continue;
    for (const app of student.applications) {
      const name = app.company.name;
      companyMap.set(name, (companyMap.get(name) ?? 0) + 1);
    }
  }

  const companyHires = [...companyMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const packagesForSummary = students
    .filter((s) => s.placed)
    .flatMap((s) => s.applications.map((a) => a.company.package))
    .filter((p) => p > 0);

  const summary = buildSummary(rows, companyHires);
  if (packagesForSummary.length > 0) {
    summary.highestPackage = Math.max(...packagesForSummary);
  }

  return {
    year: batchYearToLabel(batchYear),
    batchYear,
    rows,
    companyHires,
    summary,
  };
}

export async function getDynamicBatchYears(): Promise<number[]> {
  const profiles = await prisma.studentProfile.findMany({
    where: { batchYear: { gte: DYNAMIC_STATS_FROM_BATCH_YEAR } },
    select: { batchYear: true },
    distinct: ["batchYear"],
    orderBy: { batchYear: "desc" },
  });

  const yearsFromDb = profiles.map((p) => p.batchYear);
  const years = new Set<number>(yearsFromDb);

  // Always expose the current dynamic season even before students are added.
  years.add(DYNAMIC_STATS_FROM_BATCH_YEAR);

  return [...years].sort((a, b) => b - a);
}

export async function buildAllDynamicStats(): Promise<YearStats[]> {
  const batchYears = await getDynamicBatchYears();
  return Promise.all(batchYears.map((y) => buildDynamicYearStats(y)));
}
