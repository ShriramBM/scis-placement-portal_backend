import { Request, Response } from "express";
import prisma from "../config/prisma";

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
| 3️⃣ Get All Students (Coordinator View)
|--------------------------------------------------------------------------
*/
export const getAllStudents = async (req: any, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        studentProfile: true,
      },
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