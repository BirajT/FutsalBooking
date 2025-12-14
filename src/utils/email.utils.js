export const registerSuccessEmail = () => {
  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #4CAF50; font-size: 24px; text-align: center;">Account Created Successfully!</h2>
      
      <p style="font-size: 16px; line-height: 1.6; color: #555; text-align: center;">
        Congratulations! Your account has been successfully created. You can now log in and start using our services.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #555; text-align: center;">
        Click the button below to log in to your account:
      </p>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.FRONT_END_URL}/auth/login" style="background-color: #4CAF50; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; text-transform: uppercase;">Go to Login</a>
      </div>

      <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
        If you did not create this account, please ignore this email or contact our support team.
      </p>
    </div>
  </div>
  `;

  return html;
};