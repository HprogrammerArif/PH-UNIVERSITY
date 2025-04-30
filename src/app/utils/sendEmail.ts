import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to:string, html:string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV==='production', // true for port 465, false for other ports
    auth: {
      user: 'programmerhabluarif@gmail.com',
      pass: 'gwvz wqop evha nnlw',
    },
  });


  // send mail with defined transport object
  await transporter.sendMail({
    from: 'programmerhabluarif@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 minuts ✔', // Subject line
    text: 'Hello ki khobor! Password bule gecho!!.', // plain text body
    html, // html body
  });
};
