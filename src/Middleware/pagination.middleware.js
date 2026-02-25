// ==================== Pagination Middleware ====================
export const advancedPagination = async (Model, filter = {}, page = 1, limit = 10) => {
  // ==================== Pagination Logic  ====================
  // page = Number(req.query.page) || 1;
  // limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  // ==================== total and data  ====================
  const total = await Model.countDocuments(filter);
  const Data = await Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
// ==================== return data  pagination and total  ====================
  return {
    Current_Page: page,
    Total_Pages: Math.ceil(total / limit),
    Total_Items: total,
    Data
  };
};