const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storageDir = './uploads/products/';

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: storageDir,
  filename: function(req, file, cb){
    cb(null, 'product-' + Date.now() + path.extname(file.originalname));
  }
});

const productUpload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function(req, file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
}).single('image'); // The form field will be named 'image'

module.exports = productUpload;