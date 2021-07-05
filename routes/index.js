var express = require('express');
var router = express.Router();
var indexServices = require("../services/index")
var multer = require('multer');
var path = require('path');
var zip = require("express-zip");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
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
    console.log("re",JSON.stringify(re));
    // let result = JSON.stringify(req.newFile);
    console.log("re",req.file.path);
    // res.status(200).download(req.file.path,"./uploads/output.pdf");
    res.status(200).zip([
      {path: re, name:"ResultPdf.pdf"},
      {path: req.file.path, name:"InputPdf.pdf"}
    ])
    // res.status(200).zip(e);
  } catch (e) {
    console.log("Error In uploading", e);
    res.status(400).send(e);
  }
  finally {
    // res.render('index', { title: 'Express' });
  }
});


module.exports = router;
