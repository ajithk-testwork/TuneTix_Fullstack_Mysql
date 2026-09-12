// 1. THIS IS THE LINE THAT CHANGED
import { v2 as cloudinary } from "cloudinary"; 
import dotenv from "dotenv";

dotenv.config();

console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.CLOUD_API_KEY);
console.log("API Secret:", process.env.CLOUD_API_SECRET);

// 2. Now 'cloudinary' actually exists, so .config() will work!
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary OK:", result);
  } catch (err) {
    console.error("Cloudinary Test Error:", err);
  }
}

testCloudinary();

export default cloudinary;