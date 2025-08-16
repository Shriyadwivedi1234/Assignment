const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary connection successful'))
  .catch((error) => console.error('❌ Cloudinary connection failed:', error.message));

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
    }
  }
});

// Upload file to Cloudinary
const uploadToCloudinary = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'auto',
      folder: options.folder || 'job-platform',
      public_id: options.public_id,
      transformation: options.transformation,
      ...options
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ File uploaded to Cloudinary:', result.public_id);
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    console.log('✅ File deleted from Cloudinary:', publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};

// Upload company logo
const uploadCompanyLogo = async (file) => {
  return await uploadToCloudinary(file, {
    folder: 'job-platform/company-logos',
    transformation: [
      { width: 200, height: 200, crop: 'fill', quality: 'auto' },
      { format: 'webp' }
    ]
  });
};

// Upload company banner
const uploadCompanyBanner = async (file) => {
  return await uploadToCloudinary(file, {
    folder: 'job-platform/company-banners',
    transformation: [
      { width: 1200, height: 400, crop: 'fill', quality: 'auto' },
      { format: 'webp' }
    ]
  });
};

// Upload resume
const uploadResume = async (file) => {
  return await uploadToCloudinary(file, {
    folder: 'job-platform/resumes',
    resource_type: 'raw', // For PDF files
    format: 'pdf'
  });
};

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadCompanyLogo,
  uploadCompanyBanner,
  uploadResume
};