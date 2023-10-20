// const multer = require("multer");

// exports.up1=async(name)=>{
//     const storage=multer.diskStorage({
//     destination: function (req, file, cb) {
       
  
//       cb(null, './public/data/'+ name)
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname+'-'+uniqueSuffix)
//     }
//   })
//   const upload1 = multer({ storage: storage })
// }
// exports.up2 =async()=>{

// await multer.diskStorage({
  
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });}