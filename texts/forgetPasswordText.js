module.exports = (token) => {
  const text = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style type="text/css">
        * {
          margin: 0;
          box-sizing: border-box;
          font-family: sans-serif;
        }
      </style>
    </head>
    <body>
      <section
        class="email"
        style="
          margin: 10% 10% 10% 10%;
          background-color: #f1f1f1;
          border: 1px solid #f1f1f1;
          border-radius: 20px 20px;
        "
      >
        <div class="head" style="text-align: center; padding-top: 10px">
          <h1 style="font-weight: lighter; font-size: 40px ; padding-top:2%; padding-bottom: 10vh;">
            Welcome To CollegeGeeks
          </h1>
        </div>
        <div class="email_body" style="font-size: 20px; padding: 0 5%">
          <p>
            Hello !!! you have requested for password recovery.
          </p>
          <div style="text-align: center; padding: 5% 0%;">
            Click <a href='http://localhost:3000/auth/forget-password/${token}'>this</a> to set a new password.
          </div>
        </div>
      </section>
    </body>
  </html>`;
  return text;
};
