import multer from 'multer'

// 文件名的处理
const filenameHandler = (req, file, cb) => { 
    // 解决文件名中文乱码问题
    const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, Date.now() + '-' + originalname)
}

// 物品图片存储
const itemStorage = multer.diskStorage({
  // 设置上传文件存放的目录
  destination: function (req, file, cb) {
    cb(null, './uploads/items')
    },
  filename: filenameHandler
  }
)

// 用户头像存储
const avatarStorage = multer.diskStorage({
  // 存放目录
  destination: function (req, file, cb) {
    cb(null, './uploads/avatars')
    },
  filename: filenameHandler
  }
)

const itemUpload = multer({ storage: itemStorage })
const avatarUpload = multer({ storage: avatarStorage })

// 上传物品图片的处理函数
export const uploadImage = [
  itemUpload.single('file'),
  (req,res)=>{

    const url = `http://localhost:3000/uploads/items/${req.file.filename}`

    res.send({
      status:0,
      message:'上传成功',
      url
    })

  }
]

// 上传用户头像的处理函数
export const uploadAvatar = [
  avatarUpload.single('file'),
  (req,res)=>{

    const url = `http://localhost:3000/uploads/avatars/${req.file.filename}`

    res.send({
      status:0,
      message:'上传成功',
      url
    })

  }
]