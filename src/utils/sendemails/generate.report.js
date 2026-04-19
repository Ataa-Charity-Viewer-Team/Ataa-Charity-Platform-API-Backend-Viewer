// ===================== Admin Report HTML Template =====================
export const generateAdminReportHTML = ({
  totalUsers, totalCharities, totalDonations,
  pendingDonations, acceptedDonations, rejectedDonations,
}) => {
  const now = new Date().toLocaleDateString("ar-EG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"/>
<style>
  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px;direction:rtl}
  .wrap{max-width:620px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1)}
  .hdr{background:linear-gradient(135deg,#2c7a5c,#3aaa7a);color:#fff;padding:28px 20px;text-align:center}
  .hdr h1{margin:0;font-size:22px} .hdr p{margin:6px 0 0;font-size:13px;opacity:.85}
  .body{padding:28px 22px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:18px 0}
  .card{background:#f9f9f9;border-radius:8px;padding:16px;text-align:center;border-top:4px solid #3aaa7a}
  .card.warn{border-top-color:#e67e22} .card.ok{border-top-color:#27ae60} .card.bad{border-top-color:#e74c3c}
  .card .n{font-size:34px;font-weight:bold;color:#2c3e50}
  .card.warn .n{color:#e67e22} .card.ok .n{color:#27ae60} .card.bad .n{color:#e74c3c}
  .card .l{font-size:12px;color:#777;margin-top:5px}
  .ftr{background:#f0f0f0;text-align:center;padding:14px;font-size:12px;color:#999}
</style></head>
<body><div class="wrap">
  <div class="hdr"><h1>📊 التقرير الدوري — منصة عطاء</h1><p>${now}</p></div>
  <div class="body">
    <p style="color:#555;font-size:14px;">البيانات المباشرة من قاعدة البيانات:</p>
    <div class="grid">
<div class="card"><div class="n">${totalUsers}</div><div class="l">👤 عدد المستخدمين</div></div>
<div class="card"><div class="n">${totalCharities}</div><div class="l">🏛️ عدد الجمعيات</div></div>
<div class="card"><div class="n">${totalDonations}</div><div class="l">🎁 إجمالي التبرعات</div></div>
<div class="card warn"><div class="n">${pendingDonations}</div><div class="l">⏳ تبرعات قيد المراجعة</div></div>
<div class="card ok"><div class="n">${acceptedDonations}</div><div class="l">✅ تبرعات تم قبولها</div></div>
<div class="card bad"><div class="n">${rejectedDonations}</div><div class="l">❌ تبرعات تم رفضها</div></div>
    </div>
  </div>
  <div class="ftr">إيميل تلقائي من منصة عطاء — كل 3 أيام</div>
</div></body></html>`.trim();
};
