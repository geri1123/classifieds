const { text } = require("express");
const nodemailer=require("nodemailer");


const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
});
const sendMailUserToUser = async (firstname, lastname, useremail, phone, message, email) => {
  try {
      const mailOptions = {
          from: `"${firstname} ${lastname}" <${useremail}>`,  // Shows the sender's name and email
          replyTo: useremail,  // Allows the agent to reply directly
          to: email,  // Send to the agent
          subject: "New Message from Your Platform",
          text: `You have a new message from ${firstname} ${lastname}:\n\n${message}\n\nContact: ${phone}`,
          html: `
              <p><strong>Name:</strong> ${firstname} ${lastname}</p>
              <p><strong>Email:</strong> ${useremail}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
          `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
  } catch (error) {
      console.error("Error sending email:", error);
  }
};


//reset password
const sendResetEmail=(email , token)=>{
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Password Reset",
        text:`Click the following link to reset your password:${resetLink}`,
    };
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: "+info.response);
        }


    });


};
const sendPropertyStatusEmail = (email, status, propertyId, title) => { 
  let subject = '';
  let htmlContent = '';
  
  // Set the subject and content based on status
  if (status === 'draft') {
    subject = 'Prona eshte ruajtur si draft';
    htmlContent = `
      <html>
        <head>
          <style>
            h1 {
              font-size: 24px;
              color: #333;
            }
            p {
              font-size: 16px;
              color: #555;
            }
            img {
              width: 100%;
              height: auto;
            }
              span{
              font-weight: bold;
              font-size: 18px;
              }
              .button{
                background-color:rgb(49, 67, 116);
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
              
              }
                a{
                text-decoration: none;
           
                }
          </style>
        </head>
        <body>
          <h1>Prona eshte ruajtur si draft</h1>
          <p>Prona juaj <span>#${propertyId}</span> <span>${title}</span> eshte regjistruar si Draft.</p>
          
          <p>Thank you for using our portal. For more details, visit our website.</p> <a href="http://localhost:3000/myportal/PropertyList" class="button">View Property</a>
        </body>
      </html>
    `;
  } else if (status === 'onhold') {
    subject = 'Prona eshte ne pritje';
    htmlContent = `
      <html>
        <head>
          <style>
            h1 {
              font-size: 24px;
              color: #333;
            }
            p {
              font-size: 16px;
              color: #555;
            }
            img {
              width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <h1>Prona eshte ne pritje</h1>
          <p>Prona juaj #${propertyId} "${title}" eshte ne pritje. Ju do te njoftoheni kur prona te publikohet.</p>
       
          <p>Thank you for using our portal. For more details, visit our website.</p>  <a href="http://localhost:3000/myportal/PropertyList" class="button">View Property</a>
        </body>
      </html>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

  const sendPasswordchanged=(email)=>{
   
  
  

    subject = 'Fjalekalimi u ndryshua';
    htmlContent = `
      <html>
        <head>
          <style>
            h1 {
              font-size: 24px;
              color: #333;
            }
            p {
              font-size: 16px;
              color: #555;
            }
            img {
              width: 100%;
              height: auto;
            }
              span{
              font-weight: bold;
              font-size: 18px;
              }
              .button{
                background-color:rgb(49, 67, 116);
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
              
              }
                a{
                text-decoration: none;
           
                }
          </style>
        </head>
        <body>
          <h1>Fjalëkalimi juaj u ndryshua. Ju lutemi logohuni me fjalëkalimin e ri.</h1>
         
          
          <p>Thank you for using our portal. For more details, visit our website.</p> <a href="http://localhost:3000/myportal/profile" class="button">View Property</a>
        </body>
      </html>;`



    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
     
    };
    transporter.sendMail(mailOptions,(error, info)=>{
      if(error){
        console.log(error);
      }else{
        console.log("Email sent: "+info.response);
      }
    });
  };
  const sendRegisteredEmail = (email, userName = '') => {
    const subject = 'Registration Successful - Welcome to Shpall.com';
    
    // More professional HTML content with company branding
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Successful</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
              background-color: #314374;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
            background-color: #ffffff;
          }
          .button {
            display: inline-block;
            background-color: #314374;
            color: #ffffff !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #888888;
            background-color: #f7f7f7;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <!-- Replace with your company logo -->
            <img src="https://yourcompany.com/logo.png" alt="Company Logo" class="logo">
            <h1>Registration Successful</h1>
          </div>
          <div class="content">
            <p>Dear ${userName || 'Valued Customer'},</p>
            <p>Thank you for registering with <strong>PortalName</strong>. Your account has been successfully created and is now active.</p>
            <p>You can now access all features of our portal including:</p>
            <ul>
              <li>Post a product</li>
              <li>See latest product</li>
            
            </ul>
            <div style="text-align: center;">
              <a href="https://yourcompany.com/myportal/profile" class="button">Access Your Account</a>
            </div>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.</p>
            <p>Best regards,<br>The Shpall.com Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Shpall.com . All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>
              <a href="https://yourcompany.com/privacy">Privacy Policy</a> | 
              <a href="https://yourcompany.com/terms">Terms of Service</a>
            </p>
          </div>
        </div>
      </body>
    </html>`;

    // Set no-reply email address
    const mailOptions = {
        from: `"PortalName" <no-reply@yourcompany.com>`,
        to: email,
        subject,
        html: htmlContent,
        replyTo: 'no-reply@yourcompany.com'  // Ensures replies go to no-reply address
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending registration email:", error);
        } else {
            console.log("Registration email sent successfully:", info.messageId);
        }
    });
};


  module.exports = {
    sendResetEmail,
    sendPropertyStatusEmail,
    sendPasswordchanged,
    sendRegisteredEmail,
    sendMailUserToUser,
  };