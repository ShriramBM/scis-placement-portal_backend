import { Router } from "express";
import {
  addCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
  getCompanyApplicants,
  uploadJdFile,
} from "../controllers/company.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { uploadJd } from "../middleware/upload.middleware";

const router = Router();

// JD file upload (must be before /:id)
router.post(
  "/upload",
  authenticate,
  authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  uploadJd,
  uploadJdFile
);

// Only coordinators can manage companies
router.post(
  "/",
  authenticate,
   authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  addCompany
);

router.get("/", authenticate, getCompanies);

router.put(
  "/:id",
  authenticate,
   authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  updateCompany
);

router.delete(
  "/:id",
  authenticate,
   authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  deleteCompany
);

router.get(
  "/:id/applicants",
  authenticate,
   authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  getCompanyApplicants
);

export default router;