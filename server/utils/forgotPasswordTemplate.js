const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: rgb(51, 51, 51);">Password Reset Request - TechShop</h2>
      <p style="color: rgb(51, 51, 51)">Hello ${name},</p>
      <p style="color: rgb(51, 51, 51)">You requested to reset your password. Use the OTP below to proceed:</p>
      
      <div style="background-color: rgb(59, 130, 246); color: white; padding: 0.75rem 1.5rem; text-align: center; border-radius: 0.375rem; display: inline-block; margin: 0.5rem 0;">
        <h1 style="color: white; margin: 0; font-size: 2rem; letter-spacing: 0.5rem;">
          ${otp}
        </h1>
      </div>

      <p style="color: rgb(51, 51, 51); font-size: 0.875rem;">
        This OTP will expire in 15 minutes for security reasons.
      </p>
      <p style="color: rgb(51, 51, 51); font-size: 0.875rem;">
        If you didn't request this reset, please ignore this email.
      </p>
    </div>
  `;
};

export default forgotPasswordTemplate;