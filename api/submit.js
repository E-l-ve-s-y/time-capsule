import { supabase } from './_lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, voice_url, message } = req.body
  
  const sendDate = new Date()
  sendDate.setDate(sendDate.getDate() + 130)

  const { data, error } = await supabase
    .from('capsules')
    .insert([{
      email,
      voice_url,
      message: message || '',
      send_date: sendDate.toISOString().split('T')[0],
      is_sent: false,
      created_at: new Date().toISOString()
    }])
    .select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({
    success: true,
    send_date: sendDate.toLocaleDateString('zh-CN'),
    days_left: 130
  })
}
