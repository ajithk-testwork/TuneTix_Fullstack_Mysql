import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

export const uploadQRCode = async (
  qrBase64: string,
  ticketNumber?: string,
): Promise<string> => {
  const uploadOptions: {
    folder: string;
    resource_type: "image";
    public_id?: string;
  } = {
    folder: "future-believe/tickets",
    resource_type: "image",
  };

  if (ticketNumber) {
    uploadOptions.public_id = ticketNumber;
  }

  const result = await cloudinary.uploader.upload(
    qrBase64,
    uploadOptions,
  );

  return result.secure_url;
};