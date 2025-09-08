const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Vérifier si la configuration email est définie
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USERNAME) {
      console.warn('Configuration email non définie. Mode simulation activé.');
      console.log('Email simulé envoyé à:', options.email);
      console.log('Sujet:', options.subject);
      
      // Extraire le lien de réinitialisation pour l'affichage
      if (options.message && options.message.includes('href="')) {
        const linkMatch = options.message.match(/href="([^"]*)"/);
        if (linkMatch) {
          console.log('Lien de réinitialisation:', linkMatch[1]);
        }
      }
      
      return true;
    }

    // 1. Créer un transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // 2. Définir les options de l'email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Plateforme de Stages <no-reply@stageplatform.com>',
      to: options.email,
      subject: options.subject,
      html: options.message
    };
    
    // 3. Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

module.exports = sendEmail;