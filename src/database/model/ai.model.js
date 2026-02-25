// ==================== Import Mongoose Framework ======================
import mongoose from "mongoose";
// ================== Chat Schema ======================
const chatSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User_Data", 
    required: true 
  },
  message: { 
    type: String 
     },
  reply: { 
    type: String, 
    required: true 
  },
}, 
  {
    timestamps: true,
    collection: "Artificial_Intelligence" 
  }
);

// ================== Chat Model ======================
export const chatModel = mongoose.model('Artificial_Intelligence', chatSchema);