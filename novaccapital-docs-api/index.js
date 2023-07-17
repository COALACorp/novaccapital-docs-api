import express from "express";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import serverless from "serverless-http";

const app = express();

const s3 = new S3Client({ region: "us-east-1" });

const upload = multer({
    storage: multer.memoryStorage(),
});

app.get("/download/:guid/:fileName", async (req, res) => {
    try {
        const { guid, fileName } = req.params;
        
        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });

        const fileKey = `docs/${guid}/${fileName}`;
        
        const command = new GetObjectCommand({
            Bucket: "novacapitaldocs",
            Key: fileKey,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 5 }); // URL expiration time in seconds (adjust as needed)

        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/upload/:guid/:fileName", upload.single("file"), async (req, res) => {
    try {
        const { guid, fileName } = req.params;
        const file = req.file;

        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });
        else if (!file)
            return res.status(400).json({ message: "Missing file", request: req.file });

        // const { originalname } = file;
        const fileKey = `docs/${guid}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: "novacapitaldocs",
            Key: fileKey,
            Body: file.buffer,
        });

        await s3.send(command);

        res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });

export const handler = serverless(app);