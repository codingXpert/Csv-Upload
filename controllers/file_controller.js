const multer = require('multer');  //using multer for file upload
const path = require('path');      
const csv = require('csv-parser');  //using csv-parser to convert the data into JSON format
const fs = require('fs');
const uploadedFileNames = [];        //array containing the names of the uploaded files

//setting up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../','/uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.originalname + '-' + uniqueSuffix)
    }
  });

//setting up file-filter to upload only (.csv) files
function fileFilter (req, file, cb) {

    if(file.mimetype == 'text/csv'){
        cb(null,true);
    }
    else{
        console.log("File is not csv type");
        cb(null,false);
    }
  }

const upload = multer({storage:storage,fileFilter:fileFilter}).single('uploaded_file');  //initializing multer

//for uploading the file to the uploads folder
module.exports.upload = function(req,res){
    upload(req,res,function(err){
        if(err instanceof multer.MulterError){
            console.log("****Multer error",err);
            return;
        }
        else if(err){
            console.log('multer error',err);
            return;
        }
        else if(req.file){
            uploadedFileNames.push(req.file.filename);
        }
        return res.redirect('back');
    });
}

//exporting array 
module.exports.uploadedFileNames = function(){
  return uploadedFileNames;
}

//for opening the csv file and display its content in a tabular form
module.exports.open = function(req,res){
  const csvParsedData = [];              //array which stores the data in JSON format
  const index = req.query.index;
  fs.createReadStream(path.join(__dirname,'../','/uploads',uploadedFileNames[index])) //seeting up the path for file upload
  .pipe(csv())
  .on('data', (data) => csvParsedData.push(data))
  .on('end', () => {
    return res.render('tabular_view',{
      csvData: csvParsedData
    });
  });
}

//for deleting a particular csv file
module.exports.delete = function(req,res){
  let index = req.query.index;
  try { var files = fs.readdirSync(path.join(__dirname,'..','/uploads')); }
    catch(e) { return; }
    if (files.length > 0){
        var filePath = path.join(__dirname,'..','/uploads',uploadedFileNames[index]);
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
    }
    uploadedFileNames.splice(index,1);
    return res.redirect('back');
}