
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

// Check file type dynamically
function checkFileType(file, allowedTypes, cb) {
  // Convert allowed extensions into a regex
  const filetypes = new RegExp(allowedTypes.join("|"));
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(`Error: Only ${allowedTypes.join(", ")} files are allowed`);
  }
}


const upload = (fields) => {
  return multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 }, 
    fileFilter: function (req, file, cb) {
      
      let allowedTypes;
      if (file.fieldname === 'profile_image') {
        allowedTypes = ["jpeg", "jpg", "png"];

      } else if (file.fieldname === 'boat_image' || file.fieldname === 'license_image') {
        allowedTypes = ["jpeg", "jpg", "png"];

      } else if (file.fieldname === 'documents') {
        allowedTypes = ["pdf", "doc", "docx",];

      } else {
        allowedTypes = ["jpeg", "jpg", "png"]; 
      }

      checkFileType(file, allowedTypes, cb);
    },
  }).fields(fields);
};


const uploadFields = [
  { name: 'profile_image', maxCount: 1 },
  { name: 'boat_image', maxCount: 10 },
  { name: 'license_image', maxCount: 5 },
  { name: 'documents', maxCount: 5 }, 
];

module.exports = {
  multiUpload: upload(uploadFields), 
};


