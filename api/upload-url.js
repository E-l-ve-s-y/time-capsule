// api/upload-url.js
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

export default async function handler(req, res) {
  const timestamp = Math.round((new Date).getTime() / 1000)
  const folder = `capsules/${new Date().toISOString().slice(0,7)}`

  // 生成签名的参数（必须按字母顺序排列，且不能包含 api_key）
  const paramsToSign = {
    folder,
    resource_type: 'auto',
    timestamp
  }

  // 生成签名
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_SECRET
  )

  res.json({
    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/auto/upload`,
    params: {
      api_key: process.env.CLOUDINARY_KEY,
      folder,
      resource_type: 'auto',
      signature,
      timestamp: timestamp.toString()
    }
  })
}
