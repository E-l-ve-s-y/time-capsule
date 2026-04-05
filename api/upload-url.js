// api/upload-url.js
export default async function handler(req, res) {
  const folder = `capsules/${new Date().toISOString().slice(0,7)}`
  
  res.json({
    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/auto/upload`,  // 删除空格
    params: {
      upload_preset: 'time_capsule',
      folder
    }
  })
}
