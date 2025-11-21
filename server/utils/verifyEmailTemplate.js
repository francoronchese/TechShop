const verifyEmailTemplate = ({ name, url }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: rgb(51, 51, 51);">Welcome to TechShop, ${name}!</h2>
      <p style="color: rgb(51, 51, 51)">Thank you for registering. Please verify your email address by clicking the link below:</p>
      <a href="${url}" 
         style="background-color: rgb(59, 130, 246); color: white; padding: 0.75rem 1.5rem; 
                text-decoration: none; border-radius: 0.375rem; display: inline-block;">
        Verify Email Address
      </a>
      <p style="color: rgb(51, 51, 51)">Or copy and paste this link in your browser:</p>
      <p>${url}</p>
    </div>
  `;
};

export default verifyEmailTemplate;
