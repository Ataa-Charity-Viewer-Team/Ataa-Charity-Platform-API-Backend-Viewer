export const templet = ({ sendCode }) => {

  // Split each character into its own styled box — first 3 then separator then rest
  const chars = sendCode.split('');
  const firstHalf = chars.slice(0, 3);
  const secondHalf = chars.slice(3);

  const digitBox = (char) => `
    <td style="padding:0 4px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="
            width:58px;
            height:66px;
            background-color:#f0faf5;
            border:1.5px solid #52b788;
            border-radius:10px;
            font-family:'Courier New',monospace;
            font-size:28px;
            font-weight:900;
            color:#1b5e3a;
            text-align:center;
            vertical-align:middle;
            line-height:66px;
          ">${char}</td>
        </tr>
      </table>
    </td>
  `;

  const firstDigits  = firstHalf.map(digitBox).join('');
  const secondDigits = secondHalf.map(digitBox).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>عطاء - تأكيد البريد الإلكتروني</title>
  <style>
    body { margin:0; padding:0; background-color:#eef0f4; font-family:Tahoma,sans-serif; }
    @media only screen and (max-width:600px) {
      .email-container { width:100% !important; }
      .pad             { padding:24px 20px !important; }
      .hero-pad        { padding:28px 20px !important; }
      .header-pad      { padding:20px !important; }
      .footer-pad      { padding:18px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#eef0f4;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
  style="background-color:#eef0f4;padding:40px 16px;">
  <tr><td align="center">

    <table class="email-container" role="presentation" width="580" cellspacing="0" cellpadding="0" border="0"
      style="max-width:580px;width:100%;background-color:#ffffff;border-radius:4px;overflow:hidden;
             box-shadow:0 2px 8px rgba(0,0,0,0.06),0 20px 60px rgba(0,0,0,0.08);">

      <!-- TOP ACCENT BAR -->
      <tr>
        <td style="height:5px;background-color:#1b5e3a;font-size:0;line-height:0;">&nbsp;</td>
      </tr>

      <!-- HEADER -->
      <tr>
        <td class="header-pad" style="background-color:#ffffff;padding:28px 48px;border-bottom:1px solid #f0f0f0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <!-- Logo -->
              <td style="direction:rtl;" width="60%">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <!-- Icon box -->
                    <td style="
                      width:46px;height:46px;
                      background-color:#edf7f2;
                      border-radius:12px;
                      text-align:center;vertical-align:middle;
                      font-size:22px;line-height:46px;
                      padding-left:12px;
                    ">&#x1F331;</td>
                    <td style="padding-right:12px;vertical-align:middle;">
                      <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#111827;line-height:1;">عطاء</div>
                      <div style="font-size:11px;color:#aaa;margin-top:3px;">منصة العطاء الخيري</div>
                    </td>
                  </tr>
                </table>
              </td>
              <!-- Badge -->
              <td align="left" valign="middle">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="left">
                  <tr>
                    <td style="
                      background-color:#edf7f2;
                      border:1px solid #b7dfca;
                      border-radius:20px;
                      padding:6px 16px;
                      font-size:11px;
                      font-weight:600;
                      color:#1b5e3a;
                      white-space:nowrap;
                    ">تأكيد البريد الإلكتروني</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- HERO -->
      <tr>
        <td class="hero-pad" style="background-color:#f6fdf9;border-bottom:1px solid #eaf5ef;padding:36px 48px;direction:rtl;">

          <!-- eyebrow -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:14px;">
            <tr>
              <td style="
                background-color:#1b5e3a;
                width:18px;height:2px;
                font-size:0;line-height:0;
                border-radius:2px;
                vertical-align:middle;
              ">&nbsp;</td>
              <td style="
                padding-right:8px;
                font-size:11px;font-weight:700;
                color:#1b5e3a;letter-spacing:2.5px;
                vertical-align:middle;
              ">تحقق من هويتك</td>
            </tr>
          </table>

          <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#111827;line-height:1.6;margin-bottom:12px;">
            مرحباً بك في عطاء &#x1F44B;
          </div>
          <div style="font-size:14px;color:#6b7280;line-height:2.1;font-weight:300;">
            شكراً لانضمامك إلينا. أدخل كود التحقق أدناه لتفعيل حسابك.
            الكود صالح لمدة
            <span style="color:#1b5e3a;font-weight:700;">10 دقائق</span>
            فقط من وقت الإرسال.
          </div>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td class="pad" style="padding:40px 48px;direction:rtl;">

          <!-- OTP label -->
          <div style="font-size:10.5px;font-weight:700;letter-spacing:3px;color:#c0c8d4;margin-bottom:18px;">
            كود التحقق الخاص بك
          </div>

          <!-- OTP digits row — LTR direction for digits -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:20px;direction:ltr;">
            <tr>
              ${firstDigits}
              <!-- separator dot -->
              <td style="padding:0 6px;vertical-align:middle;font-size:22px;color:#d1d5db;font-weight:300;">·</td>
              ${secondDigits}
            </tr>
          </table>

          <!-- Timer pill -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:36px;">
            <tr>
              <td style="
                background-color:#fffbeb;
                border:1px solid #fde68a;
                border-radius:30px;
                padding:8px 18px;
                font-size:12.5px;font-weight:700;color:#b45309;
              ">&#x23F1; ينتهي الكود خلال 10 دقائق</td>
            </tr>
          </table>

          <!-- Divider -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
            <tr>
              <td style="height:1px;background-color:#f3f4f6;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
          </table>

          <!-- Security note -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="
                background-color:#f9fafb;
                border:1px solid #f0f0f0;
                border-radius:10px;
                padding:18px 20px;
                direction:rtl;
              ">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <!-- icon -->
                    <td width="42" valign="top">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="
                            width:34px;height:34px;
                            background-color:#fff;
                            border:1px solid #e9ecef;
                            border-radius:8px;
                            text-align:center;vertical-align:middle;
                            font-size:16px;line-height:34px;
                          ">&#x1F512;</td>
                        </tr>
                      </table>
                    </td>
                    <!-- text -->
                    <td style="padding-right:14px;vertical-align:middle;">
                      <div style="font-size:12.5px;color:#9ca3af;line-height:2;font-weight:300;">
                        إذا لم تكن قد طلبت إنشاء حساب، يمكنك تجاهل هذا البريد بأمان.
                        لن يتم إجراء أي تغيير على بريدك الإلكتروني.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td class="footer-pad" style="background-color:#f9fafb;border-top:1px solid #f0f0f0;padding:22px 48px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="direction:rtl;vertical-align:middle;">
                <div style="font-size:11px;color:#c4c8d0;line-height:1.9;font-weight:300;">
                  هذا البريد أُرسل تلقائياً من منصة عطاء · يُرجى عدم الرد عليه<br/>
                  &copy; 2026 عطاء &mdash; جميع الحقوق محفوظة
                </div>
              </td>
              <td align="left" valign="middle">
                <div style="font-family:Georgia,serif;font-size:20px;color:#d1d5db;">عطاء</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- BOTTOM ACCENT BAR -->
      <tr>
        <td style="height:3px;background-color:#52b788;font-size:0;line-height:0;">&nbsp;</td>
      </tr>

    </table>

  </td></tr>
</table>

</body>
</html>`;
};