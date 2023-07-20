import { getFileUrl } from "../utils/s3Utils.js";

export const downloadTemplateController = async (req, res) => {
    try {
        const { fileName } = req.params;

        console.log(`Request to: /template/${fileName}`);
        
        if (!fileName)
            return res.status(400).json({ message: "Missing file name", request: req.params });

        const signedUrl = await getFileUrl(`docs-to-download/${fileName}`); // URL expiration time in seconds (adjust as needed)

        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error("Error downloading template:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};