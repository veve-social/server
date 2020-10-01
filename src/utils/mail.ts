import nodemailer from 'nodemailer';

import { constants } from '../config/constants';

interface SendEmail {
  to: string;
  // text: string;
  html: string;
  from: string;
  subject: string;
}

export const sendEmail = async ({
  to,
  html,
  from,
  subject,
}: SendEmail): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: constants.STMP_HOST,
    port: Number(constants.STMP_PORT),
    secure: false,
    auth: {
      user: constants.STMP_USER,
      pass: constants.STMP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
