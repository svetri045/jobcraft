import Company from "../models/Company.js";

// ==========================================
// Create Company
// ==========================================
export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Company Created Successfully",
      company,
    });
  } catch (error) {
    console.error("Create Company Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get All Companies
// ==========================================
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("Get Companies Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};