var express = require('express');
const {request} = require("express");
var router = express.Router();
var multer = require('multer');
var mongoose_ = require('mongoose')
const {Schema} = require("mongoose");
const uri = "mongodb+srv://zewdatabase:ijoXgdmQ0NCyg9DO@zewgame.urb3i.mongodb.net/ph17958?retryWrites=true&w=majority";
mongoose_.connect(uri).catch(err => console.log('Co Loi Xay Ra'))

const ontap = mongoose_.model('baithi',new Schema({
  "_title" : String,
  "_content":String,
  "_baiviet":String,
  "_fileName":String,
}))


var storage = multer.diskStorage({
  destination: function (req,file,cb){
    cb(null,'public/uploads');
  },
  filename: function (req,file,cb){
    if(file.length==0)
    {
      cb(new Error("File Không Hợp lệ hoặc chưa có gì"));
      return
    }else {
      var imgLink = ((new Date().getDate())+Math.random()+file.originalname);
      setImglink(imgLink);

      cb(null,imgLink);
    }


  },
});
var upload = multer({
  storage:storage,
  limits:{fileSize: 2 * 1024 * 1024},
  fileFilter: function (req,file,cb){
   var TenFile = file.originalname;
   var kichThuoc = file.length;
   if(kichThuoc==0){
     cb(new Error("File Khong Hop Le "+`<a href='/index'>Quay Lại</a>`),false);
   }
   if(TenFile.toString().indexOf('.jpg')>-1){
     cb(null,true);
   }else {
     cb(new Error("Duoi File Phai La .jpg "+`<a href='/index'>Quay Lại</a>`),false);
   }
   if(TenFile.length==0){
     cb(new Error("File Khong Hop Le "+`<a href='/index'>Quay Lại</a>`),false);

   }
  }
}).single('file')
//.array('file',3);
var imagelink;
function setImglink(text)
{
    imagelink = text;
}
var listData=[];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});
router.get('/index', function(req, res, next) {
  res.render('home', { title: 'Express' });
});
router.get('/insert', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/insert/', upload,function(req, res, next) {
  var title_ = req.body.title;
  var content_ = req.body.content;
  var baiviet_ = req.body.baiviet;
  if(imagelink==null)
  {
    res.send("File ko hop le"+`<a href='/index' > Return </a>`);
      return;
  }
  var filename ="/uploads/"+imagelink;
  console.log(req.body.file)


  if(title_.length==0||content_.length==0||baiviet_.length==0)
  {


        res.send("Không được để trống"+`<a href='/index' > Return </a>`);
        return;
  }
  var dataz = {
    "_title" : title_,
    "_content":content_,
    "_baiviet":baiviet_,
    "_fileName":filename,
  }
  console.log(filename);
  upload(req,res,function (err){
    if(err instanceof multer.MulterError)
    {
      res.send("Co Loi Xay Ra")
    }else {
      ontap.insertMany([dataz],function (error){
        if (error) throw error;
        ontap.find({},function (err,result){
          if (err) throw error;
            res.render('showitem',{datas:result})
        })
      })
      // res.render('showitem',{datas:listData})
    }
  })

  // res.send(""+listData);
  // console.log(listData)
});
router.get('/show',function (req,res){
  ontap.find({},function (error, result){
    if(error) throw error;
    res.render('showitem',{datas:result})
  })
})
router.get('/delete/', function(req, res, next) {
  var id = req.query.id;
  ontap.deleteOne({_id:id},function (error){
    if (error) throw error;
    res.send("Delete Thanh Cong"+`<a href='/index'>Quay Lai home</a>`)
  })
});
router.get('/show/search',function (req,res){
  var nhanHieu = req.query.search;
  if(nhanHieu.length==0)
  {
    ontap.find({},function (error, result){
      if (error) throw error;
      res.render('showitem',{datas:result,textNH:nhanHieu});
    })
  }else {
    ontap.find({_nhanHieu: nhanHieu},function (error, result){
      if (error) throw error;
      res.render('showitem',{datas:result,textNH:nhanHieu});
    })
  }

})
router.get('/getList',function (req,res){
  ontap.find({},function (error, result){
    if(error) throw error;
    res.send(result);
  })
})
module.exports = router;
