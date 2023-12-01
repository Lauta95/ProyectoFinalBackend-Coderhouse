import express from 'express'
import multer from 'multer'

const app = express()
app.use(express.json())

// conf multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.path);
        cb(null, `./src/public${req.path}`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create multer instance with the configured storage
export default multer({ storage: storage });