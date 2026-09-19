"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. THIS IS THE LINE THAT CHANGED
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.CLOUD_API_KEY);
console.log("API Secret:", process.env.CLOUD_API_SECRET);
// 2. Now 'cloudinary' actually exists, so .config() will work!
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
async function testCloudinary() {
    try {
        const result = await cloudinary_1.v2.api.ping();
        console.log("Cloudinary OK:", result);
    }
    catch (err) {
        console.error("Cloudinary Test Error:", err);
    }
}
testCloudinary();
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map