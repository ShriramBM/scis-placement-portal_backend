import { Request, Response } from "express";
import { AcadLevel } from "@prisma/client";
import prisma from "../config/prisma";
import {
  buildPaginatedResponse,
  parsePaginationQuery,
} from "../utils/pagination";

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
| 3️⃣ Get All Students (Coordinator View)
|--------------------------------------------------------------------------
*/
export const getAllStudents = async (req: any, res: Response) => {
  try {
    const pagination = parsePaginationQuery(req.query as Record<string, unknown>);
    const where = { role: "STUDENT" as const };

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
  } catch (error) {
    console.error(error);
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
export const getStudentById = async (req: Request, res: Response) => {
  try {
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

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
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
export const blockStudent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

    await prisma.user.update({
      where: { id },
      data: { blocked: true },
    });

    res.json({
      message: "Student blocked successfully",
    });
  } catch (error) {
    console.error(error);
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
export const unblockStudent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

    await prisma.user.update({
      where: { id },
      data: { blocked: false },
    });

    res.json({
      message: "Student unblocked successfully",
    });
  } catch (error) {
    console.error(error);
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
export const markStudentPlaced = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

    await prisma.user.update({
      where: { id },
      data: { placed: true },
    });

    res.json({
      message: "Student marked as placed",
    });
  } catch (error) {
    console.error(error);
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
export const markStudentUnplaced = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

    await prisma.user.update({
      where: { id },
      data: { placed: false },
    });

    res.json({
      message: "Student marked as unplaced",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update placement status",
    });
  }
};