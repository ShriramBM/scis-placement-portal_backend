import { Request, Response } from "express";
import prisma from "../config/prisma";

const normalizeSkills = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

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
      jobTitle,
      address,
      state,
      country,
      website,
      type_of_organization,
      skillsRequired,
      jobLocation,
      remarks,
      no_vacancies,
      nature_of_business,
      deadline,
      jd_file_path,
    } = req.body;

    const company = await prisma.company.create({
      data: {
        name,
        description,
        package: parseFloat(salaryPackage),
        department,
        streamsAllowed: Array.isArray(streamsAllowed) ? streamsAllowed : [],
        jobTitle: jobTitle || "",
        address: address || null,
        state: state || null,
        country: country || null,
        website: website || null,
        type_of_organization: type_of_organization || null,
        skillsRequired: normalizeSkills(skillsRequired),
        jobLocation: jobLocation || null,
        remarks: remarks || null,
        no_vacancies:
          no_vacancies !== undefined &&
          no_vacancies !== null &&
          no_vacancies !== ""
            ? parseInt(no_vacancies, 10)
            : null,
        nature_of_business: nature_of_business || null,
        deadline: new Date(deadline),
        jd_file_path: jd_file_path || null,

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
      jobTitle,
      address,
      state,
      country,
      website,
      type_of_organization,
      skillsRequired,
      jobLocation,
      remarks,
      no_vacancies,
      nature_of_business,
      deadline,
      jd_file_path,
    } = req.body;

    const data: any = {
      name,
      description,
      package: salaryPackage ? parseFloat(salaryPackage) : undefined,
      department,
      streamsAllowed: Array.isArray(streamsAllowed) ? streamsAllowed : undefined,
      jobTitle,
      deadline: deadline ? new Date(deadline) : undefined,
    };

    if (Object.prototype.hasOwnProperty.call(req.body, "address")) {
      data.address = address || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "state")) {
      data.state = state || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "country")) {
      data.country = country || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "website")) {
      data.website = website || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "type_of_organization")) {
      data.type_of_organization = type_of_organization || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "skillsRequired")) {
      data.skillsRequired = normalizeSkills(skillsRequired);
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "jobLocation")) {
      data.jobLocation = jobLocation || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "remarks")) {
      data.remarks = remarks || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "no_vacancies")) {
      data.no_vacancies =
        no_vacancies !== undefined &&
        no_vacancies !== null &&
        no_vacancies !== ""
          ? parseInt(no_vacancies, 10)
          : null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "nature_of_business")) {
      data.nature_of_business = nature_of_business || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "jd_file_path")) {
      data.jd_file_path = jd_file_path || null;
    }

    const updated = await prisma.company.update({
      where: { id: companyId },
      data,
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

export const uploadJdFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const jd_file_path = "/uploads/jd/" + req.file.filename;
    return res.json({ jd_file_path });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload file" });
  }
};