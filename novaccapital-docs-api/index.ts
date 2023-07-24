import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import serverless from "serverless-http";

import { downloadTemplateController } from "./src/controllers/templatesController.js";
import { downloadFileController, uploadFileController, deleteFileController } from "./src/controllers/filesController.js";

const PORT = 4000;

const app = express();
// app.use(function(req: Request, res: Response, next: NextFunction) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors());

const upload = multer({
    storage: multer.memoryStorage(),
});

app.get("/template/:fileName", downloadTemplateController);

app.get("/download/:guid/:applicationId/:fileName", downloadFileController);
app.post("/upload/:guid/:applicationId/:fileName", upload.single("file"), uploadFileController);
app.delete("/delete/:guid/:applicationId/:fileName", deleteFileController);

// app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));

const handler = serverless(app, { provider: "aws" });

export { app, handler };