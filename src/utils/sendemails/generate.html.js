export const templet = ({ sendCode }) => {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تحقق من بريدك - عطاء</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #eef2f7; font-family: 'Tajawal', sans-serif; padding: 40px 16px; }
    .wrapper { max-width: 560px; margin: 0 auto; }
    .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 40, 80, 0.10); }
    .header { background: #0f2851; padding: 40px 40px 36px; text-align: center; position: relative; overflow: hidden; }
    .header::before { content: ''; position: absolute; top: -60px; left: -60px; width: 220px; height: 220px; border: 1px solid rgba(255,255,255,0.05); border-radius: 50%; }
    .header::after { content: ''; position: absolute; bottom: -80px; right: -40px; width: 240px; height: 240px; border: 1px solid rgba(255,255,255,0.04); border-radius: 50%; }
    .logo-wrap { display: inline-flex; align-items: center; gap: 12px; }
    .logo-icon { width: 48px; height: 48px; background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .logo-text { text-align: right; }
    .brand-ar { font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.1; }
    .brand-tag { font-size: 11px; color: #d4af37; font-weight: 500; letter-spacing: 1px; }
    .gold-line { height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 28px 0 0; opacity: 0.6; }
    .body { padding: 44px 48px; text-align: center; }
    .greeting { font-size: 13px; color: #6b7c99; margin-bottom: 6px; font-weight: 500; }
    h1 { font-size: 22px; font-weight: 700; color: #0f2851; margin-bottom: 14px; }
    .subtitle { font-size: 14px; color: #6b7c99; line-height: 1.9; margin-bottom: 40px; }
    .subtitle strong { color: #0f2851; font-weight: 700; }
    .otp-section { background: #f7f9fc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px 24px; margin-bottom: 32px; }
    .otp-label { font-size: 11px; color: #6b7c99; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 16px; font-weight: 600; }
    .otp-code { font-size: 46px; font-weight: 800; color: #0f2851; letter-spacing: 14px; direction: ltr; line-height: 1; }
    .otp-underline { width: 60px; height: 3px; background: #d4af37; border-radius: 2px; margin: 16px auto 0; }
    .timer-row { display: inline-flex; align-items: center; gap: 7px; background: #fff8e6; border: 1px solid #f0dfa0; border-radius: 20px; padding: 6px 16px; margin-bottom: 36px; font-size: 12px; color: #8a6d1a; font-weight: 600; }
    .timer-dot { width: 6px; height: 6px; background: #c9a227; border-radius: 50%; animation: pulse 1.8s infinite; flex-shrink: 0; }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.7); } }
    .divider { height: 1px; background: #e8eef6; margin: 0 0 28px; }
    .note { font-size: 12px; color: #a0aec0; line-height: 1.9; }
    .footer { background: #f7f9fc; border-top: 1px solid #e8eef6; padding: 20px 48px; text-align: center; }
    .footer-text { font-size: 11px; color: #a0aec0; line-height: 1.8; }
    .footer-brand { color: #0f2851; font-weight: 700; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">

      <div class="header">
        <div class="logo-wrap">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="#d4af37" stroke-width="1.5" stroke-linejoin="round" fill="rgba(212,175,55,0.15)"/>
            </svg>
          </div>
          <div class="logo-text">
            <div class="brand-ar">عطاء</div>
            <div class="brand-tag">منصة العطاء الخيري</div>
          </div>
        </div>
        <div class="gold-line"></div>
      </div>

      <div class="body">
        <div class="greeting">مرحباً بك في منصة عطاء</div>
        <h1>تأكيد البريد الإلكتروني</h1>
        <p class="subtitle">
          شكراً لانضمامك إلينا. أدخل الكود أدناه لتفعيل حسابك.<br>
          صالح لمدة <strong>10 دقائق</strong> من وقت الإرسال.
        </p>

        <div class="otp-section">
          <div class="otp-label">كود التحقق</div>
          <div class="otp-code">${sendCode}</div>
          <div class="otp-underline"></div>
        </div>

        <div class="timer-row">
          <div class="timer-dot"></div>
          <span>ينتهي الكود بعد 10 دقائق</span>
        </div>

        <div class="divider"></div>

        <p class="note">
          إذا لم تكن قد طلبت إنشاء حساب، يمكنك تجاهل هذا البريد بأمان.<br>
          لن يتم إجراء أي تغيير على بريدك الإلكتروني.
        </p>
      </div>

      <div class="footer">
        <p class="footer-text">
          هذا البريد أُرسل تلقائياً من <span class="footer-brand">منصة عطاء</span><br>
          © 2026 عطاء — جميع الحقوق محفوظة
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
};