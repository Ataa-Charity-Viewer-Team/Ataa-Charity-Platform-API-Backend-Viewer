export const validateLicenseByRole = (req, res, next) => {
  const { roleType } = req.user;
  const { licenseNumber } = req.body;

  if (roleType === "charity") {
    if (!licenseNumber) {
      return res.status(400).json({
        success: false,
        message: "License number is required for charity"
      });
    }

    if (!licenseRegex.test(licenseNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid license number format"
      });
    }
  }

  if (roleType !== "charity" && licenseNumber) {
    return res.status(400).json({
      success: false,
      message: "License number is not allowed for this role"
    });
  }

  next();
};