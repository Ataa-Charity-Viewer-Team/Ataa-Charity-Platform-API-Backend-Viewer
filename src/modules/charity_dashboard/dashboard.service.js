import { advancedPagination } from "../../middleware/pagination.middleware.js";
import { donationModel, donationStatus } from "../../database/model/donation.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { notificationModel, notificationStatus } from "../../database/model/notification.model.js";
import { decryptPhone } from "../../utils/encryption/encryption.js";

// helper: جيب الجمعية وتحقق إنها موجودة
const getCharityByLicense = async (license, next) => {
  const charity = await charityModel.findOne({ licenseNumber: license });
  if (!charity) { next(new Error("Charity not found", { cause: 404 })); return null; }
  return charity;
};

// ===================== 1) Get Stats ===========================
export const getStats = async (req, res, next) => {
  // const { license } = req.params;
  // const charity = await getCharityByLicense(license, next);
  // if (!charity) return;

  const Total_Donations    = await donationModel.countDocuments();
  const Pending_Donations  = await donationModel.countDocuments({  status: donationStatus.pending });
  const Accepted_Donations = await donationModel.countDocuments({ status: donationStatus.accepted });
  const Rejected_Donations = await donationModel.countDocuments({ status: donationStatus.rejected });

  return res.status(200).json({
    success: true,
    stats: { Total_Donations, Pending_Donations, Accepted_Donations, Rejected_Donations },
  });
};

// ===================== 2) Get Donations ================================
// export const getCharityDonations = async (req, res, next) => {
//   // const { license } = req.params;
//   // const charity = await getCharityByLicense(license, next);
//   // if (!charity) return;

//   const data = await advancedPagination(donationModel,{},1,10,
//    "donorId secure_url type size quantity condition description status createdAt, address" );
//      const populatedData = await donationModel.populate(data.Data, {
//     path: "donorId",
//     select: "userName phone"
//   });
//       const decryptedDonations = populatedData.map(donation => {
//       const donationObj = donation.toObject ? donation.toObject() : { ...donation };
      
//       if (donationObj.donorId && donationObj.donorId.phone) {
//         donationObj.donorId.phone = decryptPhone({ 
//           cipherText: donationObj.donorId.phone 
//         });
//       }
      
//       return donationObj;
//     });

//     data.Data = decryptedDonations;

    
//   data.Data = populatedData.Data


//   return res.status(200).json({ success: true, count: data.length, data });
// };
export const getCharityDonations = async (req, res, next) => {
    const paginationResult = await advancedPagination(
      donationModel, 
      {}, 1, 10,
      "donorId imageUrl.secure_url type size quantity condition description status createdAt address"
    );
    
    const donationsWithDonor = await donationModel.populate(paginationResult.Data, {
      path: "donorId",
      select: "userName phone"
    });

    const finalData = donationsWithDonor.map(donation => {
      const donationObj = donation.toObject();
      
      if (donationObj.donorId?.phone) {
        donationObj.donorId.phone = decryptPhone({ 
          cipherText: donationObj.donorId.phone 
        });
      }
      
      return donationObj;
    });

    return res.status(200).json({ 
      success: true,
      pagination: {
        currentPage: paginationResult.Current_Page,
        totalPages: paginationResult.Total_Pages,
        totalItems: paginationResult.Total_Items,
        count: finalData.length
      },
      donations: finalData
    });
    
  }

// ===================== 3) Get Requests ================================
// export const getCharityRequests = async (req, res, next) => {
//   // const { license } = req.params;
//   // const charity = await getCharityByLicense(license, next);
//   // if (!charity) return;

//   const data = await advancedPagination(donationModel,{},1,10,
//    "donorId secure_url type size quantity condition description status createdAt" );
//   return res.status(200).json({ success: true, data });
// };
export const getCharityRequests = async (req, res, next) => {
    const data = await advancedPagination(
      donationModel, 
      {}, 1, 10,
      "donorId imageUrl.secure_url type size quantity condition description status createdAt address"
    );
    
    const requestsWithDonorData = await Promise.all(
      data.Data.map(async (donation) => {
        const donationObj = donation.toObject();
        
        const donor = await userModel.findById(donationObj.donorId).select("userName phone address");
        
        if (donor) {
          const decryptedPhone = decryptPhone({ cipherText: donor.phone });
          
          donationObj.donorId = {
            _id: donor._id,
            userName: donor.userName,
            phone: decryptedPhone,
            address: donor.address
          };
        }
        
        return donationObj;
      })
    );
    
    data.Data = requestsWithDonorData;
    
    return res.status(200).json({ 
      success: true, 
      data 
    });
    
  }
// ===================== 4) Update Request Status ================================
export const updateRequestStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // const charity = await getCharityByLicense(license, next);
  // if (!charity) return;
 const charityId = req.user._id; // Assuming the charity ID is stored in the user object after authentication
  const request = await donationModel.findById(id);
  if (!request) return next(new Error("Request not found with this id by donation", { cause: 404 }));

  if (request.status === donationStatus.accepted) {
    return next(new Error("Already accepted", { cause: 400 }));
  }

  const updatedRequest = await donationModel.findByIdAndUpdate(id, { status, charityId: charityId }, { new: true });

  await notificationModel.create({
    userId:     request.donorId,
    donationId: request._id,
    content:    `Your donation request has been ${status}`,
    status:     notificationStatus.unread,
  });

  return res.status(200).json({ success: true, message: "Request updated successfully", request: updatedRequest });
};