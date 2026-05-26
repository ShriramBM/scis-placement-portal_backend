import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import companyRoutes from "./routes/company.routes";
import applicationRoutes from "./routes/application.routes";
import studentRoutes from "./routes/student.routes";

dotenv.config();

const app = express();

// app.use(cors());
// Define your routes

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/application", applicationRoutes);

app.get("/", (req, res) => {
  res.send("SCIS Placement Portal API Running 🚀");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});