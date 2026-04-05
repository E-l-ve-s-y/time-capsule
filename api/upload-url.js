// 修改 upload-url.js
export default async function handler(req, res) {
  const timestamp = Math.round((new Date).getTime() / 1000)
  const folder = `capsules/${new Date().toISOString().slice(0,7)}`
  
  // 使用 upload preset（在 Cloudinary 控制台创建）
  const uploadPreset = 'your_upload_preset_name'  // 需要创建

  const signature = cloudinary.utils.api_sign_request({
    timestamp,
    folder,
    upload_preset: uploadPreset,  // 加上这个
    resource_type: 'auto'
  }, process.env.CLOUDINARY_SECRET)

  res.json({
    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/auto/upload`,
    params: {
      timestamp: timestamp.toString(),
      signature,
      api_key: process.env.CLOUDINARY_KEY,
      folder,
      upload_preset: uploadPreset,  // 加上这个
      resource_type: 'auto'
    }
  })
}
