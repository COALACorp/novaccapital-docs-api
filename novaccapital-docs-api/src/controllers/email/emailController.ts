import { Request, Response } from "express";
import nodemailer from "nodemailer";

import message from "./templates/message";

export const sendMessage = async (req: Request, res: Response) => {
    const { to, name, subject, content } = req.body;

    // Replace these credentials with your actual email account details
    const smtpConfig = {
        host: process.env.EMAIL_SMTP_HOST, // Replace with your SMTP host address
        port: Number(process.env.EMAIL_SMTP_PORT), // Replace with the appropriate SMTP port
        secure: Boolean(process.env.EMAIL_SMTP_SSL), // Set to true if using SSL
        auth: {
            user: process.env.EMAIL_SMTP_USER, // Replace with your SMTP username
            pass: process.env.EMAIL_SMTP_PASSWORD, // Replace with your SMTP password
        },
    };

    try {
        // Create a Nodemailer transporter with the given email configuration
        const transporter = nodemailer.createTransport(smtpConfig);

        // Create the email message
        const mailOptions = {
            // from: emailConfig.auth.user,
            from: process.env.EMAIL_SENDER,
            to: to,
            subject: subject,
            // text: text,
            html: message(name, content),
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
};

export default { sendMessage };