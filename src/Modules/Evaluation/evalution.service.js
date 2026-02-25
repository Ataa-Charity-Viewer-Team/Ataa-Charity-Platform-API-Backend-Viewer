import { evaluationModel } from "../../dataBase/Model/Evaluation.model.js";
import { donationModel, donationStatus } from "../../dataBase/Model/Donation.model.js";
// ====================== create evaluation ======================
export const createEvaluation = async (req, res, next) => {
    const { rating, comment } = req.body;
    const { donationId } = req.params;
    const { user } = req;

    const donation = await donationModel.findById(donationId);
    if (!donation) {
        return next(new Error("Donation not found", { cause: 404 }));
    }
    if (donation.status !== donationStatus.accepted) {
        return next(new Error("Donation not accepted", { cause: 400 }));
    }

    const existing = await evaluationModel.findOne({
        donationId: donation._id,
        userId: user._id
    });
    if (existing) {
        return next(new Error("Already evaluated", { cause: 400 }));
    }

    const evaluation = await evaluationModel.create({
        userId: req.user._id,
        donationId: donation._id,
        rating,
        comment
    });

    return res.status(201).json({
        success: true,
        message: "Evaluation created successfully",
        evaluation
    });
};

// ====================== get evaluations ======================
export const getEvaluation = async (req, res, next) => {
  const {user}=req
  const {donationId}=req.params
    const evaluations = await evaluationModel.find({ donationId })
        .populate("userId", "userName email")
        .sort({ createdAt: -1 });
    if (!evaluations.length) {
        return next(new Error("No evaluations found", { cause: 404 }));
    }
    return res.status(200).json({success: true, evaluations});
};
