import { Request, Response } from "express";

import s3Utils from "../utils/s3Utils.js";
import dbUtils from "../utils/dbUtils.js";

export const downloadFileController = async (req: Request, res: Response) => {
try {
        const { guid, applicationId, fileName } = req.params;

        console.log(`Request to: /download/${guid}/${applicationId}/${fileName}`);
        
        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!applicationId)
            return res.status(400).json({ message: "Missing application id", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });
        
        const signedUrl = await s3Utils.getFileUrl(`docs/${guid}/${applicationId}/${fileName}`); // URL expiration time in seconds (adjust as needed)

        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const uploadFileController = async (req: Request, res: Response) => {
    try {
        const { guid, applicationId, fileName } = req.params;
        const file = req.file;

        console.log(`Request to: /upload/${guid}/${applicationId}/${fileName}`);

        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!applicationId)
            return res.status(400).json({ message: "Missing application id", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });
        else if (!file)
            return res.status(400).json({ message: "Missing file", request: req.file });

        // const { originalname } = file;

        await s3Utils.uploadFile(`docs/${guid}/${applicationId}/${fileName}`, file); // Upload file to S3
        const documentCreated = await dbUtils.create(guid, applicationId, fileName); // Create file in DB

        res.status(200).json({ message: "File uploaded successfully", documentId: documentCreated[0] });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteFileController = async (req: Request, res: Response) => {
    try {
        const { guid, applicationId, fileName } = req.params;

        console.log(`Request to: /delete/${guid}/${applicationId}/${fileName}`);
        
        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!applicationId)
            return res.status(400).json({ message: "Missing application id", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });

        await s3Utils.deleteFile(`docs/${guid}/${applicationId}/${fileName}`); // Upload file to S3
        const documentRemoved = await dbUtils.remove(guid, applicationId, fileName); // Create file in DB

        res.status(200).json({ message: "File deleted successfully", documentId: documentRemoved });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default { uploadFileController, downloadFileController, deleteFileController };