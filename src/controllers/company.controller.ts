import { Request, Response } from "express";
import prisma from "../config/prisma";

//////////////////////////////////////////////////////
// ADD COMPANY
//////////////////////////////////////////////////////
export const addCompany = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      package: salaryPackage,
      department,
      streamsAllowed,
      deadline,
    } = req.body;

    const company = await prisma.company.create({
      data: {
        name,
        description,
        package: parseFloat(salaryPackage),
        department,
        streamsAllowed,
        deadline: new Date(deadline),

        // 🔥 Store creator
        createdById: req.user!.id,
      },
    });

    return res.status(201).json({
      message: "Company added successfully",
      company,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to add company",
    });
  }
};
//////////////////////////////////////////////////////
// GET ALL COMPANIES
//////////////////////////////////////////////////////

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { deadline: "asc" },
    });

    return res.json(companies);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch companies",
    });
  }
};

//////////////////////////////////////////////////////
// UPDATE COMPANY
//////////////////////////////////////////////////////

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const companyId = parseInt(id);

    if (isNaN(companyId)) {
      return res.status(400).json({
        message: "Invalid company ID",
      });
    }

    const {
      name,
      description,
      package: salaryPackage,
      department,
      streamsAllowed,
      deadline,
    } = req.body;

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        description,
       package: salaryPackage? parseFloat(salaryPackage) : undefined,
        department,
        streamsAllowed,
        deadline: deadline ? new Date(deadline) : undefined,
      },
    });

    return res.json({
      message: "Company updated successfully",
      updated,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Update failed",
    });
  }
};

//////////////////////////////////////////////////////
// DELETE COMPANY
//////////////////////////////////////////////////////

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = Array.isArray(id) ? id[0] : id;
    await prisma.company.delete({
      where: { id: parseInt(companyId) },
    });

    return res.json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete failed",
    });
  }
};

//for stream and placement coordinators to view applicants of a company
export const getCompanyApplicants = async (req: any, res: any) => {
  try {
    const companyId = parseInt(req.params.id);

    const applicants = await prisma.application.findMany({
      where: {
        companyId,
      },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
      },
    });

    res.json(applicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch applicants",
    });
  }
};