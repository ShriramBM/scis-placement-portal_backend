import { Department, Stream } from "@prisma/client";
import prisma from "../config/prisma";

export type CoordinatorScope = {
  department: Department;
  stream: Stream | null;
};

export async function getCoordinatorScope(userId: number): Promise<CoordinatorScope> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      coordinatorDepartment: true,
      coordinatorStream: true,
      role: true,
    },
  });

  if (
    !user ||
    (user.role !== "PLACEMENT_COORDINATOR" && user.role !== "STREAM_COORDINATOR")
  ) {
    throw Object.assign(new Error("Not a coordinator"), { status: 403 });
  }

  if (!user.coordinatorDepartment) {
    throw Object.assign(new Error("Coordinator department not assigned"), { status: 403 });
  }

  if (user.coordinatorDepartment === "MTECH" && !user.coordinatorStream) {
    throw Object.assign(new Error("MTECH coordinator must have a stream assigned"), {
      status: 403,
    });
  }

  return {
    department: user.coordinatorDepartment,
    stream: user.coordinatorDepartment === "MTECH" ? user.coordinatorStream : null,
  };
}

export function buildStudentProfileFilter(scope: CoordinatorScope) {
  if (scope.department === "MTECH") {
    return {
      department: scope.department,
      stream: scope.stream!,
    };
  }

  return {
    department: scope.department,
  };
}

export function profileMatchesScope(
  profile: { department: Department; stream: Stream | null } | null | undefined,
  scope: CoordinatorScope
): boolean {
  if (!profile) return false;
  if (profile.department !== scope.department) return false;
  if (scope.department === "MTECH") {
    return profile.stream === scope.stream;
  }
  return true;
}
