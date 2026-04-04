import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

export default async function handler(req, res) {
  const timestamp = Math.round((new Date).getTime() / 1000)
  const folder = `capsules/${new Date().toISOString().slice(0,7)}`
  
  const signature = cloudinary.utils.api_sign_request({
    timestamp,
    folder,
    resource_type: 'video'
  }, process.env.CLOUDINARY_SECRET)

  res.json({
    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/video/upload`,
    params: {
      timestamp: timestamp.toString(),
      signature,
      api_key: process.env.CLOUDINARY_KEY,
      folder,
      resource_type: 'video'
    }
  })
}
