export const advancedPagination = async (
  Model,
  filter = {},
  page = 1,
  limit = 10,
  select = ""
) => {
  const skip = (page - 1) * limit;

  const total = await Model.countDocuments(filter);

  const Data = await Model.find(filter)
    .select(select)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    Current_Page: page,
    Total_Pages: Math.ceil(total / limit),
    Total_Items: total,
    Data
  };
};