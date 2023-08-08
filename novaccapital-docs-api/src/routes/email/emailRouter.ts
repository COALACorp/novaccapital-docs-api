import { Router } from "express";

import { sendMessage } from "../../controllers/email/emailController";

const router = Router();

router.post("/message", sendMessage);

export default router;