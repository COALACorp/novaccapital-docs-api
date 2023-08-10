import { Router } from "express";
import multer from "multer";

import { downloadTemplateController } from "../../controllers/docs/templatesController.js";
import { downloadFileController, uploadFileController, deleteFileController } from "../../controllers/docs/filesController.js";

const upload = multer({
    storage: multer.memoryStorage(),
});

const router = Router();

router.get("/template/:fileName", downloadTemplateController);

router.get("/download/:guid/:applicationId/:fileName", downloadFileController);
router.post("/upload/:guid/:applicationId/:fileName", upload.single("file"), uploadFileController);
router.delete("/delete/:guid/:applicationId/:fileName", deleteFileController);

export default router;