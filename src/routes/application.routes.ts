import { Router } from "express";
import { applyToCompany, selectStudent } from "../controllers/application.controller";
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
  // authorize("STREAM_COORDINATOR", "PLACEMENT_COORDINATOR"),
  getAllApplications
);

router.put(
  "/:id/select",
  authenticate,
  // authorize("PLACEMENT_COORDINATOR"),
  selectStudent
);


export default router;