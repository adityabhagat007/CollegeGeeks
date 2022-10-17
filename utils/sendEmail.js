require("dotenv").config();
// const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// module.exports = (email, subject, text) => {
//   let transporter = nodemailer.createTransport({
//     host:'smtp.sendgrid.net',
//     port:465,
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });

//   let mailDetails = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: subject,
//     html: text,
//   };

//   return new Promise((resolve, reject) => {
//     transporter.sendMail(mailDetails, function (err, data) {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(true);
//       }
//     });
//   });
// };

module.exports = async (email,subject,text)=>{
  try{
  const msg = {
    to: email, // Change to your recipient
    from: process.env.EMAIL, // Change to your verified sender
    subject: subject,
    html: text,
  }
  const mail = await sgMail.send(msg); 
  if(!mail){
    return mail;
  }else{
    console.log(mail);
    return false;
  }
}catch(err){
  console.log(err);
}
}


