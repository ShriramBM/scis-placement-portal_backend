import { Router } from "express";
import { register, login ,placementCoordinatorLogin} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/coordinator/login", placementCoordinatorLogin);

export default router;