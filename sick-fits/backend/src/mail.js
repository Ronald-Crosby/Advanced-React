const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '1b77adfbd7fe72',
    pass: '19058dcb8698fc',
  },
});

const makeANiceEmail = (text) => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>${text}</p>

    <p>😘, Wes Bos</p>
  </div>
`;

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;
