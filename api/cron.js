import { supabase } from './_lib/db'

const RESEND_API_KEY = process.env.RESEND_API_KEY

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0]

  const { data: capsules, error } = await supabase
    .from('capsules')
    .select('*')
    .eq('send_date', today)
    .eq('is_sent', false)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  if (!capsules || capsules.length === 0) {
    return res.json({ sent: 0, message: '今天没有要发送的胶囊' })
  }

  let sent = 0
  for (const capsule of capsules) {
    const success = await sendEmail(capsule)
    if (success) {
      await supabase
        .from('capsules')
        .update({ is_sent: true, sent_at: new Date().toISOString() })
        .eq('id', capsule.id)
      sent++
    }
  }

  res.json({ sent, total: capsules.length })
}

async function sendEmail(capsule) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: '时光胶囊 <onboarding@resend.dev>',
        to: [capsule.email],
        subject: '⏳ 130天前的祝福，现在送达',
        html: `
          <div style="max-width:600px;margin:0 auto;font-family:system-ui;">
            <h2 style="color:#667eea;">🎓 时光胶囊开启</h2>
            <p>130天前，你给现在的自己留下了一段话：</p>
            <div style="background:#f6f8fa;padding:20px;border-radius:8px;margin:20px 0;">
              <a href="${capsule.voice_url}" 
                 style="display:inline-block;background:#667eea;color:white;
                        padding:12px 24px;text-decoration:none;border-radius:6px;">
                ▶ 播放语音祝福
              </a>
            </div>
            ${capsule.message ? `<p>附言：${capsule.message}</p>` : ''}
            <p style="color:#666;font-size:14px;">—— 交大130周年校庆 · 时光胶囊</p>
          </div>
        `
      })
    })

    return res.ok
  } catch (e) {
    console.error('发送失败:', e)
    return false
  }
}
