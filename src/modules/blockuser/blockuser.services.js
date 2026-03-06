import BlockedUser from "../../database/model/blockuser.model.js";

// ── حظر ──
export const blockUser = async (req, res) => {
  try {
    const { email, username, phone, ipAddress } = req.body;

    // لازم يبعت حاجة واحدة على الأقل
    if (!email && !username && !phone && !ipAddress) {
      return res.status(400).json({ message: "ابعت email أو username أو phone أو ipAddress" });
    }

    // تشيك لو موجود قبل كده
    const existing = await BlockedUser.findOne({
      $or: [
        email      ? { email }      : null,
        username   ? { username }   : null,
        phone      ? { phone }      : null,
        ipAddress  ? { ipAddress }  : null,
      ].filter(Boolean)
    });

    if (existing) {
      return res.status(409).json({ message: "محظور بالفعل" });
    }

    const blocked = await BlockedUser.create({ email, username, phone, ipAddress });
    res.status(201).json({ message: "تم الحظر بنجاح", blocked });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── رفع الحظر ──
export const unblockUser = async (req, res) => {
  try {
    const { email, username, phone, ipAddress } = req.body;

    if (!email && !username && !phone && !ipAddress) {
      return res.status(400).json({ message: "ابعت email أو username أو phone أو ipAddress" });
    }

    const result = await BlockedUser.findOneAndDelete({
      $or: [
        email      ? { email }      : null,
        username   ? { username }   : null,
        phone      ? { phone }      : null,
        ipAddress  ? { ipAddress }  : null,
      ].filter(Boolean)
    });

    if (!result) {
      return res.status(404).json({ message: "مش موجود في القائمة" });
    }

    res.json({ message: "تم رفع الحظر", result });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── قائمة المحظورين ──
export const getBlockedUsers = async (req, res) => {
  try {
    const blocked = await BlockedUser.find().sort({ blockedAt: -1 });
    res.json({ count: blocked.length, blocked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};