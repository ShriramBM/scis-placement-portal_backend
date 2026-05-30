import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  updateMyAcademic,
  createStudent,
  getAllStudents,
  getStudentById,
  blockStudent,
  unblockStudent,
  markStudentPlaced,
  markStudentUnplaced,
} from "../controllers/student.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Student self
router.get("/me", authenticate, authorize("STUDENT"), getMyProfile);
router.put("/me", authenticate, authorize("STUDENT"), updateMyProfile);
router.put("/me/academic", authenticate, authorize("STUDENT"), updateMyAcademic);

// Coordinator access
router.post("/", authenticate, authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"), createStudent);
router.get("/", authenticate, authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"), getAllStudents);
router.get("/:id", authenticate, authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"), getStudentById);

router.put("/:id/block", authenticate, authorize("PLACEMENT_COORDINATOR"), blockStudent);
router.put("/:id/unblock", authenticate, authorize("PLACEMENT_COORDINATOR"), unblockStudent);
router.put("/:id/placed", authenticate, authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"), markStudentPlaced);
router.put("/:id/unplaced", authenticate, authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"), markStudentUnplaced);

export default router;