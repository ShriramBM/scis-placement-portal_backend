import { Router } from "express";
import { applyToCompany, selectStudent, getCompanyApplicantsForExport } from "../controllers/application.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { getMyApplications } from "../controllers/application.controller";
import { getAllApplications } from "../controllers/application.controller";

const router = Router();

router.post(
  "/apply",
  authenticate,
  authorize("STUDENT"),
  applyToCompany
);
router.get(
  "/my",
  authenticate,
  authorize("STUDENT"),
  getMyApplications
);

router.get(
  "/all",
  authenticate,
  getAllApplications
);

router.get(
  "/company/:companyId/export",
  authenticate,
  getCompanyApplicantsForExport
);

router.put(
  "/:id/select",
  authenticate,
  // authorize("PLACEMENT_COORDINATOR"),
  selectStudent
);


export default router;