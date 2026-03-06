import BlockedUser from "../../database/model/blockuser.model.js";

// ── حظر ──
export const blockUser = async (req, res) => {
    const { email, username, phone, ipAddress } = req.body;

    if (!email && !username && !phone && !ipAddress) {
      return res.status(400).json({ message: "ابعت email أو username أو phone أو ipAddress" });
    }

    // ✅ كل حاجة تتحفظ لوحدها
    const toBlock = [];
    if (email)     toBlock.push({ email });
    if (username)  toBlock.push({ username });
    if (ipAddress) toBlock.push({ ipAddress });

    const results = [];
    const alreadyExist = [];

    for (const item of toBlock) {
      const existing = await BlockedUser.findOne(item);
      if (existing) {
        alreadyExist.push(item);
      } else {
        const blocked = await BlockedUser.create(item);
        results.push(blocked);
      }
    }

    return res.status(201).json({
      message: "تم",
      blocked: results,
      alreadyBlocked: alreadyExist
    });

  } 
// ── رفع الحظر ──
export const unblockUser = async (req, res) => {
    const { email, username, phone, ipAddress } = req.body;

    if (!email && !username && !phone && !ipAddress) {
      return res.status(400).json({ message: "ابعت email أو username أو phone أو ipAddress" });
    }

    const result = await BlockedUser.findOneAndDelete({
      $or: [
        email      ? { email }      : null,
        username   ? { username }   : null,
        ipAddress  ? { ipAddress }  : null,
      ].filter(Boolean)
    });

    if (!result) {
      return res.status(404).json({ message: "مش موجود في القائمة" });
    }

    res.json({ message: "تم رفع الحظر", result });

  } 

// ── قائمة المحظورين ──
export const getBlockedUsers = async (req, res) => {
    const blocked = await BlockedUser.find().sort({ blockedAt: -1 });
    res.json({ count: blocked.length, blocked });
  } 
