const multer = require('multer')
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './uploads/')
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + file.originalname)
    }
})
const fileFilter = (request, file, callback)=> {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true)
    } else {
        callback(null, false)
    }
}
const upload = multer({"storage":storage, limits:{fileSize:1024 * 1024 * 5}, fileFilter: fileFilter})

exports.upload = upload

//rota para imagem em app.js -> app.use('/uploads', express.static('uploads'))