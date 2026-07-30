import nodemailer from "nodemailer";

// Create transporter with DIRECT credentials (NO .env)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iamahmadshahzad228576@gmail.com",
    pass: "hznebvmgjdhnhais",
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// Send email function
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: options.fromEmail || "iamahmadshahzad228576@gmail.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || options.fromEmail || "iamahmadshahzad228576@gmail.com",
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Send inquiry reply email
export const sendInquiryReplyEmail = async (customerEmail, customerName, replyData) => {
  const { 
    productName, 
    businessName, 
    businessEmail, 
    replyMessage, 
    inquirySubject,
    productId,
    inquiryDate,
    businessPhone,
    businessAddress,
    businessOwnerName
  } = replyData;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0d6efd; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .reply-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0d6efd; margin: 20px 0; }
        .product-info { background: #e9ecef; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px; }
        .button { display: inline-block; background: #0d6efd; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; }
        .badge { background: #198754; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; }
        .business-info { background: #d1e7dd; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .divider { border-top: 2px solid #dee2e6; margin: 20px 0; }
        .sender-info { font-size: 14px; color: #6c757d; background: #fff3cd; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">📩 Reply from ${businessName}</h2>
        </div>
        <div class="content">
          <div class="sender-info">
            <strong>📧 From:</strong> ${businessOwnerName} (${businessEmail})
          </div>
          
          <h3>Dear ${customerName},</h3>
          <p>Thank you for your inquiry. The business owner has responded to your question about <strong>${productName}</strong>.</p>
          
          <div class="product-info">
            <strong>📦 Product:</strong> ${productName}<br>
            <strong>🏢 Business:</strong> ${businessName}<br>
            <strong>📝 Subject:</strong> ${inquirySubject}
          </div>

          <div class="reply-box">
            <h4 style="margin-top: 0;">💬 Response from ${businessOwnerName}:</h4>
            <p style="font-size: 16px; white-space: pre-wrap;">${replyMessage}</p>
          </div>

          <div class="business-info">
            <h5 style="margin-top: 0;">📞 Contact ${businessName}</h5>
            <p style="margin: 5px 0;">
              <strong>Owner:</strong> ${businessOwnerName}<br>
              <strong>Email:</strong> <a href="mailto:${businessEmail}">${businessEmail}</a><br>
              ${businessPhone ? `<strong>Phone:</strong> ${businessPhone}<br>` : ''}
              ${businessAddress ? `<strong>Address:</strong> ${businessAddress}` : ''}
            </p>
          </div>

          <p style="color: #6c757d; font-size: 14px;">
            <span class="badge">✓</span> You can reply directly to this email to continue the conversation with the business owner.
          </p>

          <div class="divider"></div>

          <p style="font-size: 14px; color: #6c757d;">
            <strong>📌 Inquiry Details:</strong><br>
            Submitted: ${new Date(inquiryDate).toLocaleString()}<br>
            Status: <span style="color: #198754;">Replied</span>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
          <p>This email was sent in response to your product inquiry.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    fromEmail: "iamahmadshahzad228576@gmail.com",
    replyTo: businessEmail, 
    to: customerEmail,
    subject: `Re: ${inquirySubject}`,
    html,
  });
};