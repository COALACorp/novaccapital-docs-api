import s3 from "../utils/s3Utils.js";

export const downloadFileController = async (req, res) => {
    try {
        const { guid, applicationId, fileName } = req.params;

        console.log(`Request to: /download/${guid}/${applicationId}/${fileName}`);
        
        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!applicationId)
            return res.status(400).json({ message: "Missing application id", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });
        
        const signedUrl = await s3.getFileUrl(`docs/${guid}/${applicationId}/${fileName}`); // URL expiration time in seconds (adjust as needed)

        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const uploadFileController = async (req, res) => {
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
        const fileKey = `docs/${guid}/${applicationId}/${fileName}`;

        await s3.uploadFile(fileKey, file);

        res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteFileController = async (req, res) => {
    try {
        const { guid, applicationId, fileName } = req.params;

        console.log(`Request to: /delete/${guid}/${applicationId}/${fileName}`);
        
        if (!guid)
            return res.status(400).json({ message: "Missing guid", request: req.params });
        else if (!applicationId)
            return res.status(400).json({ message: "Missing application id", request: req.params });
        else if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });

        const fileKey = `docs/${guid}/${applicationId}/${fileName}`;
        
        await s3.deleteFile(fileKey);

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default { uploadFileController, downloadFileController, deleteFileController };