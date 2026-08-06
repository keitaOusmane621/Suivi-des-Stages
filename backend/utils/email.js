const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"StageTrack" <noreply@stagetrack.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email envoyé à ${options.to}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
};

module.exports = sendEmail;