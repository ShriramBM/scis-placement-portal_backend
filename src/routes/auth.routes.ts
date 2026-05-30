import { Router } from "express";
import { login ,placementCoordinatorLogin} from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);

router.post("/coordinator/login", placementCoordinatorLogin);

export default router;