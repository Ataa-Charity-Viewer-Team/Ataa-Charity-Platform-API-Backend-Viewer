export const templet = ({ sendCode }) => {
  return `
      <!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>عطاء - Email Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #eef0f4;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Tajawal', sans-serif;
      padding: 40px 16px;
    }

    .email-wrapper {
      max-width: 600px;
      width: 100%;
    }

    .email-card {
      background: #ffffff;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.08);
    }

    /* TOP ACCENT BAR */
    .top-bar {
      height: 5px;
      background: linear-gradient(90deg, #1b5e3a 0%, #52b788 50%, #1b5e3a 100%);
    }

    /* HEADER */
    .header {
      background: #ffffff;
      padding: 36px 56px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f0f0f0;
    }

    .logo-block {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-icon {
      width: 46px;
      height: 46px;
      background: #edf7f2;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-text {
      font-family: 'Scheherazade New', serif;
      font-size: 30px;
      font-weight: 700;
      color: #111827;
      line-height: 1;
    }

    .logo-sub {
      font-size: 11px;
      font-weight: 400;
      color: #aaa;
      margin-top: 3px;
    }

    .header-badge {
      background: #edf7f2;
      border: 1px solid #b7dfca;
      border-radius: 20px;
      padding: 6px 16px;
      font-size: 11.5px;
      font-weight: 600;
      color: #1b5e3a;
    }

    /* HERO */
    .hero {
      background: linear-gradient(180deg, #f6fdf9 0%, #ffffff 100%);
      border-bottom: 1px solid #eaf5ef;
      padding: 40px 56px 36px;
      direction: rtl;
    }

    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 11px;
      font-weight: 700;
      color: #1b5e3a;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .hero-eyebrow::before {
      content: '';
      display: inline-block;
      width: 18px;
      height: 2px;
      background: #52b788;
      border-radius: 2px;
    }

    .hero-title {
      font-family: 'Scheherazade New', serif;
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .hero-desc {
      font-size: 14px;
      font-weight: 300;
      color: #6b7280;
      line-height: 2.1;
    }

    .hero-desc strong {
      color: #1b5e3a;
      font-weight: 700;
    }

    /* BODY */
    .body {
      padding: 44px 56px;
      direction: rtl;
    }

    .otp-label {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 3px;
      color: #c0c8d4;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    /* Individual digit boxes */
    .otp-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 20px;
      direction: ltr;
    }

    .otp-digit {
      width: 62px;
      height: 70px;
      background: #f8f9fb;
      border: 1.5px solid #e4e8ee;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Tajawal', sans-serif;
      font-size: 30px;
      font-weight: 900;
      color: #1a1a2e;
    }

    .otp-digit.green {
      border-color: #52b788;
      background: #f0faf5;
      color: #1b5e3a;
      box-shadow: 0 0 0 3px rgba(82,183,136,0.1);
    }

    .otp-sep {
      font-size: 20px;
      color: #d1d5db;
      font-weight: 300;
      flex-shrink: 0;
    }

    .timer-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 30px;
      padding: 8px 16px;
      font-size: 12.5px;
      font-weight: 600;
      color: #b45309;
    }

    .section-divider {
      height: 1px;
      background: #f3f4f6;
      margin: 36px 0;
    }

    .security-note {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      background: #f9fafb;
      border: 1px solid #f0f0f0;
      border-radius: 10px;
      padding: 18px 20px;
      direction: rtl;
    }

    .security-icon {
      width: 34px;
      height: 34px;
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .security-text {
      font-size: 12.5px;
      color: #9ca3af;
      line-height: 2;
      font-weight: 300;
    }

    /* FOOTER */
    .footer {
      background: #f9fafb;
      border-top: 1px solid #f0f0f0;
      padding: 24px 56px;
      direction: rtl;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .footer-text {
      font-size: 11px;
      color: #c4c8d0;
      line-height: 1.9;
      font-weight: 300;
    }

    .footer-logo {
      font-family: 'Scheherazade New', serif;
      font-size: 20px;
      color: #d1d5db;
    }

    .bottom-bar {
      height: 3px;
      background: linear-gradient(90deg, #1b5e3a 0%, #52b788 100%);
    }
  </style>
</head>
<body>

  <div class="email-wrapper">
    <div class="email-card">

      <div class="top-bar"></div>

      <!-- Header -->
      <div class="header">
        <div class="logo-block">
          <div class="logo-icon">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M13 3C9 6 6 9.5 6 14C6 18.4 9.1 22 13 22C16.9 22 20 18.4 20 14C20 9.5 17 6 13 3Z" stroke="#1b5e3a" stroke-width="1.5" fill="#edf7f2"/>
              <path d="M10 13.5C10.5 15.2 11.6 16.5 13 16.5C14.4 16.5 15.5 15.2 16 13.5" stroke="#1b5e3a" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="13" cy="10.5" r="1.5" fill="#1b5e3a"/>
            </svg>
          </div>
          <div>
            <div class="logo-text">عطاء</div>
            <div class="logo-sub">منصة العطاء الخيري</div>
          </div>
        </div>
        <div class="header-badge">تأكيد البريد الإلكتروني</div>
      </div>

      <!-- Hero -->
      <div class="hero">
        <div class="hero-eyebrow">تحقق من هويتك</div>
        <div class="hero-title">مرحباً بك في عطاء 👋</div>
        <p class="hero-desc">
          شكراً لانضمامك إلينا. أدخل كود التحقق أدناه لتفعيل حسابك.
          الكود صالح لمدة <strong>10 دقائق</strong> فقط من وقت الإرسال.
        </p>
      </div>

      <!-- Body -->
      <div class="body">

        <div class="otp-label">كود التحقق الخاص بك</div>

        <div class="otp-row">
          <div class="otp-digit green">A</div>
          <div class="otp-digit green">3</div>
          <div class="otp-digit green">F</div>
          <div class="otp-sep">·</div>
          <div class="otp-digit green">9</div>
          <div class="otp-digit green">K</div>
          <div class="otp-digit green">2</div>
        </div>

        <div class="timer-pill">
          ⏱ ينتهي الكود خلال 10 دقائق
        </div>

        <div class="section-divider"></div>

        <div class="security-note">
          <div class="security-icon">🔒</div>
          <div class="security-text">
            إذا لم تكن قد طلبت إنشاء حساب، يمكنك تجاهل هذا البريد بأمان.
            لن يتم إجراء أي تغيير على بريدك الإلكتروني.
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-text">
          هذا البريد أُرسل تلقائياً من منصة عطاء · يُرجى عدم الرد عليه<br/>
          © 2026 عطاء — جميع الحقوق محفوظة
        </div>
        <div class="footer-logo">عطاء</div>
      </div>

      <div class="bottom-bar"></div>

    </div>
  </div>

</body>
</html>
  
  
  `};