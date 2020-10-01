import nodemailer from 'nodemailer';

import { constants } from '../config/constants';

interface SendEmail {
  to: string;
  // text: string;
  html: string;
}

export const sendEmail = async ({ to, html }: SendEmail): Promise<void> => {
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
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject: 'Sign in ✔',
    html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
