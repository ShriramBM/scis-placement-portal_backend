import { Request, Response } from "express";
import prisma from "../config/prisma";

export const applyToCompany = async (req: Request, res: Response) => {
  try {
    const { companyId, action } = req.body;
    if (!companyId || !action) {
      return res.status(400).json({
        message: "companyId and action required",
      });
    }

    if (!["ACCEPT", "REJECT", "IGNORE"].includes(action)) {
      return res.status(400).json({
        message: "Invalid action",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { studentProfile: true },
    });

    if (!user || user.role !== "STUDENT") {
      return res.status(403).json({ message: "Only students allowed" });
    }

    if (user.placed) {
      return res.status(403).json({ message: "Already placed" });
    }

    if (user.blocked) {
      return res.status(403).json({ message: "You are blocked" });
    }

    const company = await prisma.company.findUnique({
      where: { id: parseInt(companyId) },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (new Date() > company.deadline) {
      return res.status(400).json({ message: "Deadline passed" });
    }

    const profile = user.studentProfile;

    if (!profile) {
      return res.status(400).json({
        message: "Complete profile first",
      });
    }

    if (profile.department !== company.department) {
      return res.status(403).json({
        message: "Department not eligible",
      });
    }

    if (
      profile.department === "MTECH" &&
      !company.streamsAllowed.includes(profile.stream!)
    ) {
      return res.status(403).json({
        message: "Stream not eligible",
      });
    }

    // Map action to status
    const statusMap: Record<string, "APPLIED" | "REJECTED" | "IGNORED"> = {
      ACCEPT: "APPLIED",
      REJECT: "REJECTED",
      IGNORE: "IGNORED",
   };

    const status = statusMap[action];

    // if (action === "ACCEPT") status = "APPLIED";
    // if (action === "REJECT") status = "REJECTED";
    // if (action === "IGNORE") status = "IGNORED";

    // Upsert instead of duplicate create
    const application = await prisma.application.upsert({
      where: {
        studentId_companyId: {
          studentId: user.id,
          companyId: parseInt(companyId),
        },
      },
      update: { status },
      create: {
        studentId: user.id,
        companyId: parseInt(companyId),
        status,
      },
    });

    return res.json({
      message: `Company ${action.toLowerCase()}ed successfully`,
      application,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to process response",
    });
  }
};

export const getMyApplications = async (req: any, res: any) => {
  try {
    const applications = await prisma.application.findMany({
      where: { studentId: req.user.id },
      include: {
        company: true, 
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

export const getAllApplications = async (req: any, res: any) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        company: true,
        student: {
          include: {
            studentProfile: true,
          },
        },
      },
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};
