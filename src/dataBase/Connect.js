import mongoose  from 'mongoose';
 const connectDB= async ()=>{
    try {
    await mongoose.connect(process.env.CONNECT_DB)
    console.log("DB connected successfully");
    
    } catch (error) {
       console.log("failed to connect DB",error);
        
    }
    
}
export default connectDB;
