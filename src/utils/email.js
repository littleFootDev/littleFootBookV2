import nodemailer from 'nodemailer';

const sendEmail = async options => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
            }
          });
        
          const mailOptions = {
            from: 'Jacques Caradi <hello@jacques.io>',
            to: options.email,
            subject: options.subject,
            text: options.message
          };
        
          await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log("une erreur c'est produite dans l'envoi du mail.");
    };
};

export {sendEmail};