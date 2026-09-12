import { NextFunction, Response } from "express";
import { AuthRequest } from "./authmiddleware";

export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    // 🔍 Keep your debug line to see what's happening!
    console.log("USER DATA IN MIDDLEWARE:", req.user);

    // ✅ Safely check using optional chaining (?.)
    if (req.user?.role?.toUpperCase() !== "ADMIN") {
        return res.status(403).json({
            success: false, // Added to match your frontend logic
            message: "Admin Denied. Admin Only" 
        });
    }
    
    next();
}