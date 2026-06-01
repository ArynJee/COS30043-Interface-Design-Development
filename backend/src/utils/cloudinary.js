import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadBase64Image(base64Data, folder = "comfyhome") {
  if (!base64Data) return null;
  if (base64Data.startsWith("http") || base64Data.startsWith("/")) return base64Data;

  const dataUri = base64Data.startsWith("data:")
    ? base64Data
    : `data:image/png;base64,${base64Data}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return result.secure_url;
}
