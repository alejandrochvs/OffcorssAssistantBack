var express = require('express');
var app = express();
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname,'public/img/ecards'));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
}).single('img');
router.post('/img', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(req.file.originalname);
        res.end(req.file.originalname);
    });
});
module.exports = router;
