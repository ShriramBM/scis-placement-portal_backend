import { Router } from "express";
import {
  addCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
  getCompanyApplicants,
} from "../controllers/company.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Only coordinators can manage companies
router.post(
  "/",
  authenticate,
  // authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  addCompany
);

router.get("/", authenticate, getCompanies);

router.put(
  "/:id",
  authenticate,
  // authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  updateCompany
);

router.delete(
  "/:id",
  authenticate,
  // authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  deleteCompany
);

router.get(
  "/:id/applicants",
  authenticate,
  // authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  getCompanyApplicants
);

export default router;