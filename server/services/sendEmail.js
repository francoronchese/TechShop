import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { MAILER_HOST, MAILER_USER, MAILER_PASSWORD } = process.env;

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    // Configure email transporter for Gmail SMTP
    // Uses STARTTLS protocol to upgrade insecure connection to encrypted TLS
    // Port 587 is Gmail's standard port for STARTTLS security upgrade
    const transporter = nodemailer.createTransport({
      host: MAILER_HOST,
      port: 587,
      secure: false, // Enables STARTTLS for connection encryption
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASSWORD,
      },
    });

    // Set email options with branded sender name
    const mailOptions = {
      from: `TechShop <${MAILER_USER}>`,
      to: sendTo,
      subject: subject,
      html: html,
    };

    // Send email and return delivery info
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent to:', sendTo);
    return info;
  } catch (error) {
    console.log('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
