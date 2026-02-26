export const templet = ({ sendCode }) => {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>تأكيد البريد الإلكتروني - عطاء</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f1eb;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="background-color: #f4f1eb; padding: 40px 16px;">
    <tr>
      <td align="center">

        <!-- Email Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="
            max-width: 560px;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          ">

          <!-- Header -->
          <tr>
            <td style="
              background: linear-gradient(135deg, #1a6b4a 0%, #2d9b6f 60%, #3dbf8a 100%);
              padding: 40px 48px 36px;
              text-align: center;
            ">
              <!-- Logo Icon -->
              <div style="
                display: inline-block;
                background-color: rgba(255,255,255,0.15);
                border-radius: 50%;
                width: 64px;
                height: 64px;
                line-height: 64px;
                font-size: 32px;
                margin-bottom: 16px;
              ">🤲</div>

              <h1 style="
                margin: 0 0 6px;
                color: #ffffff;
                font-size: 30px;
                font-weight: 800;
                letter-spacing: 1px;
              ">عطاء</h1>

              <p style="
                margin: 0;
                color: rgba(255,255,255,0.82);
                font-size: 14px;
                letter-spacing: 0.5px;
              ">منصة العطاء الخيري</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 44px 48px 36px; text-align: right;">

              <h2 style="
                margin: 0 0 12px;
                color: #1a2e22;
                font-size: 22px;
                font-weight: 700;
              ">تأكيد البريد الإلكتروني</h2>

              <p style="
                margin: 0 0 32px;
                color: #5a6b62;
                font-size: 15px;
                line-height: 1.8;
              ">
                شكراً لانضمامك إلى منصة <strong style="color: #1a6b4a;">عطاء</strong>.
                أدخل كود التحقق أدناه لتفعيل حسابك.
                الكود صالح لمدة <strong>10 دقائق</strong> فقط من وقت الإرسال.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="margin-bottom: 32px;">
                <tr>
                  <td style="
                    background: linear-gradient(135deg, #f0faf5 0%, #e6f7ef 100%);
                    border: 2px dashed #2d9b6f;
                    border-radius: 12px;
                    padding: 28px 24px;
                    text-align: center;
                  ">
                    <p style="
                      margin: 0 0 8px;
                      color: #5a6b62;
                      font-size: 13px;
                      font-weight: 600;
                      text-transform: uppercase;
                      letter-spacing: 1.5px;
                    ">كود التحقق</p>

                    <p style="
                      margin: 0;
                      color: #1a6b4a;
                      font-size: 44px;
                      font-weight: 900;
                      letter-spacing: 10px;
                      font-family: 'Courier New', monospace;
                      line-height: 1;
                    ">${sendCode}</p>

                    <!-- Timer Badge -->
                    <p style="
                      display: inline-block;
                      margin: 16px 0 0;
                      background-color: #fff3cd;
                      color: #856404;
                      font-size: 12px;
                      font-weight: 600;
                      padding: 5px 14px;
                      border-radius: 20px;
                      border: 1px solid #ffd000;
                    ">⏱ ينتهي الكود بعد 10 دقائق</p>
                  </td>
                </tr>
              </table>

              <!-- Warning Note -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="margin-bottom: 8px;">
                <tr>
                  <td style="
                    background-color: #fafafa;
                    border-right: 4px solid #cccccc;
                    border-radius: 8px;
                    padding: 16px 20px;
                  ">
                    <p style="
                      margin: 0;
                      color: #888;
                      font-size: 13px;
                      line-height: 1.7;
                    ">
                      إذا لم تكن قد طلبت إنشاء حساب، يمكنك تجاهل هذا البريد بأمان.
                      لن يتم إجراء أي تغيير على بريدك الإلكتروني.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background-color: #f9f9f7;
              border-top: 1px solid #ececec;
              padding: 24px 48px;
              text-align: center;
            ">
              <p style="
                margin: 0 0 6px;
                color: #aaa;
                font-size: 12px;
              ">هذا البريد أُرسل تلقائياً من منصة عطاء — يُرجى عدم الرد عليه</p>
              <p style="
                margin: 0;
                color: #ccc;
                font-size: 11px;
              ">© 2026 عطاء — جميع الحقوق محفوظة</p>
            </td>
          </tr>

        </table>
        <!-- End Email Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};