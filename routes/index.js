var express = require('express');
var router = express.Router();
var indexServices = require("../services/index")
var multer = require('multer');
var path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage  })

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

//Upload Route
router.post('/upload', upload.single('filename'), async (req, res) => {
  let re;
  try {
    re = await indexServices.upload(req);
    res.status(200).send(re);
  } catch (e) {
    console.log("Error In uploading", e);
    res.status(400).send(e);
  }
  finally {
    // res.render('index', { title: 'Express' });
  }
});


module.exports = router;
