const express = require("express");
const WordExtractor = require("word-extractor");
const fs = require('fs')
const multer = require("multer");
const path = require("path");
 
const app = express();
 
app.use(express.static("public"));
 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});
 
var upload = multer({ storage: storage });
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
 
app.post("/convert", upload.single("file"), (req, res) => {
    let outputfilepath = "public/uploads/" + Date.now() + ".txt"
  if (req.file) {
    const extractor = new WordExtractor();
    const extracted = extractor.extract(req.file.path);
    extracted.then(function (doc) {
      
      console.log(doc.getBody());
      fs.writeFileSync(outputfilepath,doc.getBody(),"utf-8")
 
      res.download(outputfilepath)
    });
  }
});
 
app.listen(3300, () => {
  console.log("App is listening on port 3300");
});