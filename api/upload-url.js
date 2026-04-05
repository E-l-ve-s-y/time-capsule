// api/upload-url.js
export default async function handler(req, res) {
  const folder = `capsules/${new Date().toISOString().slice(0,7)}`
  
  res.json({
    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/auto/upload`,
    params: {
      upload_preset: 'time_capsule',  // 你创建的 preset 名称
      folder  // 可选，覆盖 preset 中的 folder
    }
  })
}
