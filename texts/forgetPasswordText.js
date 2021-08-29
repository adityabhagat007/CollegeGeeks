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
        .btn {
          background: #3498db;
          background-image: -webkit-linear-gradient(top, #3498db, #2980b9);
          background-image: -moz-linear-gradient(top, #3498db, #2980b9);
          background-image: -ms-linear-gradient(top, #3498db, #2980b9);
          background-image: -o-linear-gradient(top, #3498db, #2980b9);
          background-image: linear-gradient(to bottom, #3498db, #2980b9);
          -webkit-border-radius: 28;
          -moz-border-radius: 28;
          border-radius: 28px;
          font-family: Arial;
          color: #ffffff;
          font-size: 20px;
          padding: 10px 20px 10px 20px;
          text-decoration: none;
        }
        
        .btn:hover {
          background: #3cb0fd;
          background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);
          background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);
          background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);
          background-image: -o-linear-gradient(top, #3cb0fd, #3498db);
          background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <section
        class="email"
        style="
          margin: 5% 3% 5% 3%;
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
        <div class="email_body" style="font-size: 20px; padding: 0 5%; text-align: center">
          <p>
            <h5 style="font-size: 40px;">Hello Geek !!!</h5><br>
            You have requested to recover your Password Please click the link below to reset your Password
          </p>
          <div style="text-align: center; padding: 5% 0%;">
          Click below to verify<br>
          <br> 
          <a href='https://collegegeeks.herokuapp.com/auth/${token}'><button class="btn">Verify</button></a>
          </div>
        </div>
      </section>
    </body>
  </html>`;
  return text;
};
