import express from "express";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import serverless from "serverless-http";

const app = express();

const s3 = new S3Client({ region: "us-east-1" });

const upload = multer({
    storage: multer.memoryStorage(),
});

app.get("/template/:fileName", async (req, res) => {
    try {
        const { fileName } = req.params;
        
        if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });

        const fileKey = `docs-to-download/${fileName}`;
        
        const command = new GetObjectCommand({
            Bucket: "novacapitaldocs",
            Key: fileKey,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 5 }); // URL expiration time in seconds (adjust as needed)

        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error("Error downloading template:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/download/:guid/:applicationId/:fileName", async (req, res) => {
    try {
        const { guid, applicationId, fileName } = req.params;
        
        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!applicationId)
            return res.status(400).json({ message: "Missing application id", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });

        const fileKey = `docs/${guid}/${applicationId}/${fileName}`;
        
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

app.post("/upload/:guid/:applicationId/:fileName", upload.single("file"), async (req, res) => {
    try {
        const { guid, applicationId, fileName } = req.params;
        const file = req.file;

        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!applicationId)
            return res.status(400).json({ message: "Missing application id", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });
        else if (!file)
            return res.status(400).json({ message: "Missing file", request: req.file });

        // const { originalname } = file;
        const fileKey = `docs/${guid}/${applicationId}/${fileName}`;

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

app.delete("/delete/:guid/:applicationId/:fileName", async (req, res) => {
    try {
        const { guid, applicationId, fileName } = req.params;
        
        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!applicationId)
            return res.status(400).json({ message: "Missing application id", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });

        const fileKey = `docs/${guid}/${applicationId}/${fileName}`;
        
        const command = new DeleteObjectCommand({
            Bucket: "novacapitaldocs",
            Key: fileKey,
        });

        await s3.send(command);

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

export const handler = serverless(app);