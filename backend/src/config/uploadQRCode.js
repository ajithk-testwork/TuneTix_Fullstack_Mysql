"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadQRCode = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const uploadQRCode = async (qrBase64, ticketNumber) => {
    const uploadOptions = {
        folder: "future-believe/tickets",
        resource_type: "image",
    };
    if (ticketNumber) {
        uploadOptions.public_id = ticketNumber;
    }
    const result = await cloudinary_1.v2.uploader.upload(qrBase64, uploadOptions);
    return result.secure_url;
};
exports.uploadQRCode = uploadQRCode;
//# sourceMappingURL=uploadQRCode.js.map