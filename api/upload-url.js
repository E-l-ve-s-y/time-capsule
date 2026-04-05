export default async function handler(req, res) {
  // 调试：打印环境变量
  console.log('ENV CHECK:', {
    name: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_KEY,
    secret: process.env.CLOUDINARY_SECRET ? '存在' : '缺失'
  })
  
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/auto/upload`
  
  console.log('返回的 URL:', url)
  
  res.json({
    url: url,
    params: {
      upload_preset: 'time_capsule'
    }
  })
}
