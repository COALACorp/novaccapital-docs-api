import { Request, Response } from "express";

import { sendHtmlEmail } from "../../utils/email";
import message from "./templates/message";

export const sendMessage = async (req: Request, res: Response) => {
    const { to, name, subject, content } = req.body;

    try {
        await sendHtmlEmail(to, subject, message(name, content));

        console.log("Email sent successfully");
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
};

export default { sendMessage };