import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-transport";

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

const sendEmail = async (mailOptions: MailOptions) => {
    // Create a Nodemailer transporter with the given email configuration
    const transporter = nodemailer.createTransport(smtpConfig);
    return await transporter.sendMail(mailOptions);
};

export const sendTextEmail = async (to: string, subject: string, text: string) => {
    // Create the email message
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: to,
        subject: subject,
        text: text,
    };

    // Send the email
    return await sendEmail(mailOptions);
};

export const sendHtmlEmail = async (to: string, subject: string, html: string) => {
    // Create the email message
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: to,
        subject: subject,
        html: html,
    };

    // Send the email
    try {
        return await sendEmail(mailOptions);
    } catch (error) {
        console.log("Email sent from catch");
        return await sendEmail(mailOptions);
    }
};