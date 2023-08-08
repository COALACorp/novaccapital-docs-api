import "dotenv/config";
import express from "express";
import cors from "cors";

import docsRouter from "./src/routes/docs/docsRouter";
import emailRouter from "./src/routes/email/emailRouter";

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/docs", docsRouter);
app.use("/email", emailRouter);

app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));