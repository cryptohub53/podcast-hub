import { Router } from "express";
import { sendContactEmail } from "../controllers/contactController.js";

const router = Router();

router.post("/", sendContactEmail);

export default router;
