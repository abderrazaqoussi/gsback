const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../public')
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-')
    cb(null, fileName)
  },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      return cb(null, true)
    }
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
  },
  limits: {
    fileSize: 1024 * 1024,
  },
})

module.exports = upload
