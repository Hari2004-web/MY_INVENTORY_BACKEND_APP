const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storageDir = './uploads/avatars/';

// Create the directory if it doesn't exist
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: storageDir,
  filename: function(req, file, cb){
    // Name the file 'avatar-[userid]' to ensure each user has only one avatar
    cb(null, 'avatar-' + req.user.id + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: function(req, file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null, true);
    } else {
      cb('Error: You can only upload image files!');
    }
  }
}).single('avatar'); // This must match the name of the form field

module.exports = upload;