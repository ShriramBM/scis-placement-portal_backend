import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  getAllStudents,
  getStudentById,
  blockStudent,
  unblockStudent,
  markStudentPlaced,
} from "../controllers/student.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Student self
router.get("/me", authenticate, authorize("STUDENT"), getMyProfile);
router.put("/me", authenticate, authorize("STUDENT"), updateMyProfile);

// Coordinator access
router.get("/", authenticate, authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"), getAllStudents);
router.get("/:id", authenticate, authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"), getStudentById);

router.put("/:id/block", authenticate, authorize("PLACEMENT_COORDINATOR"), blockStudent);
router.put("/:id/unblock", authenticate, authorize("PLACEMENT_COORDINATOR"), unblockStudent);
router.put("/:id/placed", authenticate, authorize("PLACEMENT_COORDINATOR"), markStudentPlaced);

export default router;