import { Request, Response } from "express";
import { AcadLevel } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import {
  buildPaginatedResponse,
  parsePaginationQuery,
} from "../utils/pagination";
import {
  buildStudentProfileFilter,
  getCoordinatorScope,
  profileMatchesScope,
} from "../utils/coordinatorScope";

const DEFAULT_STUDENT_PASSWORD = "Student@123";

async function assertStudentInScope(studentId: number, coordinatorId: number) {
  const scope = await getCoordinatorScope(coordinatorId);
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: { studentProfile: true },
  });

  if (!student || student.role !== "STUDENT") {
    throw Object.assign(new Error("Student not found"), { status: 404 });
  }

  if (!profileMatchesScope(student.studentProfile, scope)) {
    throw Object.assign(new Error("Access denied for this student"), { status: 403 });
  }

  return student;
}

/*
|--------------------------------------------------------------------------
| 1️⃣ Get Logged-in Student Profile
|--------------------------------------------------------------------------
*/
export const getMyProfile = async (req: any, res: Response) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        AcadamicDetails: true,
      },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| 2️⃣ Update Logged-in Student Profile
|--------------------------------------------------------------------------
*/
export const updateMyProfile = async (req: any, res: Response) => {
  try {
    const {
      rollNo,
      phone,
      resumeUrl,
      alternateEmail,
      linkedInUrl,
      githubUrl,
      gender,
      dob,
      category,
      permanentAddress,
      currentAddress,
      preferredJobLocation,
      carreerType,
      stream,
    } = req.body;

    const updatedProfile = await prisma.studentProfile.update({
      where: { userId: req.user.id },
      data: {
        rollNo,
        phone,
        resumeUrl,
        alternateEmail,
        linkedInUrl,
        githubUrl,
        gender,
        dob: dob ? new Date(dob) : undefined,
        category,
        permanentAddress,
        currentAddress,
        preferredJobLocation,
        carreerType,
        stream,
      },
      include: {
        AcadamicDetails: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| 2b Update Academic Records (logged-in student)
|--------------------------------------------------------------------------
*/
export const updateMyAcademic = async (req: any, res: Response) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
    });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { academicDetails } = req.body as {
      academicDetails: Array<{
        id?: number;
        level: string;
        institution_school_name: string;
        board?: string | null;
        university?: string | null;
        yearOfPassing: number;
        percentage_cgpa: number;
      }>;
    };

    if (!Array.isArray(academicDetails)) {
      return res.status(400).json({ message: "academicDetails must be an array" });
    }

    const validLevels = ["TENTH", "TWELFTH", "DIPLOMA", "GRADUATION", "POSTGRADUATION"];

    await prisma.$transaction(async (tx) => {
      await tx.academicRecord.deleteMany({
        where: { studentProfileId: profile.id },
      });

      for (const row of academicDetails) {
        const level = (validLevels.includes(row.level) ? row.level : "GRADUATION") as AcadLevel;
        await tx.academicRecord.create({
          data: {
            studentProfileId: profile.id,
            level,
            institution_school_name: row.institution_school_name || "",
            board: row.board || null,
            university: row.university || null,
            yearOfPassing: Number(row.yearOfPassing) || 0,
            percentage_cgpa: Number(row.percentage_cgpa) || 0,
          },
        });
      }
    });

    const updated = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: { AcadamicDetails: true },
    });

    res.json({
      message: "Academic details updated successfully",
      profile: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update academic details",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Create Student Account (Coordinator)
|--------------------------------------------------------------------------
*/
export const createStudent = async (req: any, res: Response) => {
  try {
    const { name, email, rollNo, batchYear } = req.body;

    if (!name || !email || !rollNo || !batchYear) {
      return res.status(400).json({
        message: "Name, email, registration number, and batch year are required",
      });
    }

    if (!email.endsWith("@uohyd.ac.in")) {
      return res.status(400).json({
        message: "Use official university email (@uohyd.ac.in)",
      });
    }

    const parsedBatchYear = parseInt(String(batchYear), 10);
    if (Number.isNaN(parsedBatchYear) || parsedBatchYear < 2000 || parsedBatchYear > 2100) {
      return res.status(400).json({ message: "Enter a valid batch year" });
    }

    const scope = await getCoordinatorScope(req.user.id);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingRollNo = await prisma.studentProfile.findUnique({
      where: { rollNo: String(rollNo).trim() },
    });
    if (existingRollNo) {
      return res.status(400).json({ message: "Registration number already in use" });
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_STUDENT_PASSWORD, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: user.id,
          department: scope.department,
          stream: scope.stream,
          rollNo: String(rollNo).trim(),
          phone: "",
          batchYear: parsedBatchYear,
        },
      });

      return user;
    });

    return res.status(201).json({
      message: "Student account created successfully",
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
      },
      defaultPassword: DEFAULT_STUDENT_PASSWORD,
    });
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to create student account" });
  }
};

/*
|--------------------------------------------------------------------------
| 3️⃣ Get All Students (Coordinator View)
|--------------------------------------------------------------------------
*/
export const getAllStudents = async (req: any, res: Response) => {
  try {
    const scope = await getCoordinatorScope(req.user.id);
    const profileFilter = buildStudentProfileFilter(scope);
    const pagination = parsePaginationQuery(req.query as Record<string, unknown>);
    const where = {
      role: "STUDENT" as const,
      studentProfile: profileFilter,
    };

    if (pagination) {
      const [students, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: { studentProfile: true },
          orderBy: { name: "asc" },
          skip: pagination.skip,
          take: pagination.limit,
        }),
        prisma.user.count({ where }),
      ]);
      return res.json(buildPaginatedResponse(students, total, pagination));
    }

    const students = await prisma.user.findMany({
      where,
      include: {
        studentProfile: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(students);
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Student By ID
|--------------------------------------------------------------------------
*/
export const getStudentById = async (req: any, res: Response) => {
  try {
    const scope = await getCoordinatorScope(req.user.id);
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: {
          include: {
            AcadamicDetails: true,
          },
        },
        applications: true,
      },
    });

    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (!profileMatchesScope(student.studentProfile, scope)) {
      return res.status(403).json({ message: "Access denied for this student" });
    }

    res.json(student);
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({
      message: "Failed to fetch student",
    });
  }
};

/*
|--------------------------------------------------------------------------
|  Block Student
|--------------------------------------------------------------------------
*/
export const blockStudent = async (req: any, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    await assertStudentInScope(id, req.user.id);

    await prisma.user.update({
      where: { id },
      data: { blocked: true },
    });

    res.json({
      message: "Student blocked successfully",
    });
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({
      message: "Failed to block student",
    });
  }
};

/*
|--------------------------------------------------------------------------
|  Unblock Student
|--------------------------------------------------------------------------
*/
export const unblockStudent = async (req: any, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    await assertStudentInScope(id, req.user.id);

    await prisma.user.update({
      where: { id },
      data: { blocked: false },
    });

    res.json({
      message: "Student unblocked successfully",
    });
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({
      message: "Failed to unblock student",
    });
  }
};

/*
|--------------------------------------------------------------------------
| 7️⃣ Mark Student as Placed
|--------------------------------------------------------------------------
*/
export const markStudentPlaced = async (req: any, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    await assertStudentInScope(id, req.user.id);

    await prisma.user.update({
      where: { id },
      data: { placed: true },
    });

    res.json({
      message: "Student marked as placed",
    });
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({
      message: "Failed to update placement status",
    });
  }
};

/*
|--------------------------------------------------------------------------
| 8️⃣ Mark Student as Unplaced
|--------------------------------------------------------------------------
*/
export const markStudentUnplaced = async (req: any, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    await assertStudentInScope(id, req.user.id);

    await prisma.user.update({
      where: { id },
      data: { placed: false },
    });

    res.json({
      message: "Student marked as unplaced",
    });
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({
      message: "Failed to update placement status",
    });
  }
};