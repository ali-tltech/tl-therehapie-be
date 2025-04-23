import cloudinary from 'cloudinary';
import 'dotenv/config';

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Image upload function
const imageUploadToCloudinary = async (file, folderPath) => {
    try {
        if (!file) {
            throw new Error("No image file provided.");
        }

        // Convert the file buffer to base64
        const b64 = Buffer.from(file.buffer).toString("base64");
        const image = `data:${file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(image, {
            folder: folderPath,
            tags: "product",
            resource_type: "auto",
        });

        // Return the uploaded image's URL and details
        return result;
    } catch (error) {
        console.error('Error during image upload:', error);
        throw new Error('Something went wrong while uploading the image.');
    }
};

// Reusable function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
    try {
        // Delete image from Cloudinary using publicId
        const result = await cloudinary.v2.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Could not delete image from Cloudinary');
    }
};

export { imageUploadToCloudinary, deleteImageFromCloudinary };  

