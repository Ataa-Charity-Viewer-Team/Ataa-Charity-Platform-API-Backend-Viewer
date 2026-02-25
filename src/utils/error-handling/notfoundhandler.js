// ================================= Not Found Handler ===================================
export const notFoundHandler= async(req,res,next)=>{
    return next(new Error("not found controller handler",{case:404}))
}