import { Request, Response } from "express";

import { sendHtmlEmail } from "../../utils/email";
import approved from "./templates/approved";
import denied from "./templates/denied";

export const sendAppApprovedStatus = async (req: Request, res: Response) => {
    const { email, userName } = req.body;

    try {
        if (!(email && userName)) {
            res.status(400).json({ message: "Expected attributes: email and userName" });
            return;
        }

        await sendHtmlEmail(email, "Aprobación de solicitud", approved(userName));

        console.log("Email sent successfully");
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
};

export const sendDocDeniedStatus = async (req: Request, res: Response) => {
    const { email, userName, fileName, reason } = req.body;

    try {
        if (!(email && userName && fileName && reason)) {
            res.status(400).json({ message: "Expected attributes: email, userName, fileName and reason" });
            return;
        }

        await sendHtmlEmail(email, "Denegación del Documento en el Checklist", denied(userName, fileName, reason));

        console.log("Email sent successfully");
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
};

export default { sendDocDeniedStatus };