import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//////////////////////////////////////////////////////
// REGISTER STUDENT
//////////////////////////////////////////////////////

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      department,
      stream,
      rollNo,
      cgpa,
      batchYear,
      phone,
    } = req.body;

    //////////////////////////////////////////////////
    // BASIC VALIDATION
    //////////////////////////////////////////////////

    if (
      !name ||
      !email ||
      !password ||
      !department ||
      !rollNo ||
      !cgpa ||
      !batchYear ||
      !phone
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // University email validation
    if (!email.endsWith("@uohyd.ac.in")) {
      return res.status(400).json({
        message: "Use official university email (@uohyd.ac.in)",
      });
    }

    // Password strength
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Department & Stream validation
    if (department === "MCA" && stream) {
      return res.status(400).json({
        message: "MCA students should not select stream",
      });
    }

    if (department === "MTECH" && !stream) {
      return res.status(400).json({
        message: "MTECH students must select stream",
      });
    }

    //////////////////////////////////////////////////
    // CHECK IF USER EXISTS
    //////////////////////////////////////////////////

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    //////////////////////////////////////////////////
    // HASH PASSWORD
    //////////////////////////////////////////////////

    const hashedPassword = await bcrypt.hash(password, 10);

    //////////////////////////////////////////////////
    // CREATE USER + PROFILE (TRANSACTION)
    //////////////////////////////////////////////////

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
          department,
          stream: department === "MCA" ? null : stream,
          rollNo,
          cgpa: parseFloat(cgpa),
          batchYear: parseInt(batchYear),
          phone,
        },
      });

      return user;
    });

    //////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////

    return res.status(201).json({
      message: "Student registered successfully",
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};