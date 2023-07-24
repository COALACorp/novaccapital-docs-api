import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

export const getFileUrl = async (fileKey: string) => {
    const command = new GetObjectCommand({
        Bucket: "novacapitaldocs",
        Key: fileKey,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 5 }); // URL expiration time in seconds (adjust as needed)

    return signedUrl;
};

export const uploadFile = async (fileKey: string, file: Express.Multer.File) => {
    const command = new PutObjectCommand({
        Bucket: "novacapitaldocs",
        Key: fileKey,
        Body: file.buffer,
    });

    await s3.send(command);

    return;
};

export const deleteFile = async (fileKey: string) => {
    const command = new DeleteObjectCommand({
        Bucket: "novacapitaldocs",
        Key: fileKey,
    });

    await s3.send(command);

    return;
};

export default { getFileUrl, uploadFile, deleteFile };