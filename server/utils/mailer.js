const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'demo@ethereal.email',
    pass: process.env.SMTP_PASS || 'demo_pass',
  },
});

const sendSellerStatusEmail = async (email, name, status) => {
  const isApproved = status === 'Approved';
  
  const mailOptions = {
    from: '"ecom.me Marketplace" <noreply@ecom.me>',
    to: email,
    subject: `Your Seller Account Status: ${status}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px;">
        <h1 style="color: #0066ff; font-size: 24px;">ecom<span style="color: #333 text-decoration: none;">.me</span></h1>
        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
        <p>Hello <strong>${name}</strong>,</p>
        <p>We have reviewed your application to become a seller on ecom.me.</p>
        <div style="padding: 20px; background-color: ${isApproved ? '#f6ffed' : '#fff1f0'}; border-radius: 8px; border: 1px solid ${isApproved ? '#b7eb8f' : '#ffa39e'}; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: ${isApproved ? '#389e0d' : '#cf1322'}; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
            Status: ${status}
          </p>
        </div>
        <p>${isApproved 
          ? 'Congratulations! Your account is now active. You can start listing products on your dashboard immediately.' 
          : 'Regrettably, your application was not approved at this time. Please review your store details and try again.'}</p>
        ${isApproved ? '<a href="http://localhost:5173/seller/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #0066ff; color: white; text-decoration: none; border-radius: 999px; font-weight: bold; margin-top: 20px;">Go to Dashboard</a>' : ''}
        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 40px 0 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2026 ecom.me Marketplace. Next-Gen Evolution.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Email sent to ${email} for status: ${status}`);
  } catch (error) {
    console.error(`[Mailer] Error sending email to ${email}:`, error);
  }
};

module.exports = { sendSellerStatusEmail };
