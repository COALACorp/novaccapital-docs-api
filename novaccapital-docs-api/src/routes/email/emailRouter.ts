import { Router } from "express";

import { sendAppApprovedStatus, sendDocDeniedStatus } from "../../controllers/email/emailController";

const router = Router();

router.post("/application/approved", sendAppApprovedStatus);
router.post("/docs/denied", sendDocDeniedStatus);

export default router;