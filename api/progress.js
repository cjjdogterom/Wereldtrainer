// Shared progress store for Wereldtrainer.
// Runs as a Vercel Serverless Function. Uses Vercel KV / Upstash Redis via its
// REST API (env vars are injected automatically once you add KV to the project).
// If KV isn't configured yet, it responds { configured: false } and the app
// falls back to local storage — so nothing breaks before you enable it.

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const KEY = 'wt-state-v1'

export default async function handler(req, res) {
  if (!KV_URL || !KV_TOKEN) {
    res.status(200).json({ configured: false })
    return
  }

  const auth = { Authorization: `Bearer ${KV_TOKEN}` }

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${KV_URL}/get/${KEY}`, { headers: auth, cache: 'no-store' })
      const j = await r.json()
      let data = null
      if (j && typeof j.result === 'string' && j.result.length > 0) {
        try {
          data = JSON.parse(j.result)
        } catch {
          data = null
        }
      }
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({ configured: true, data })
      return
    }

    if (req.method === 'POST') {
      const value = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {})
      const r = await fetch(`${KV_URL}/set/${KEY}`, { method: 'POST', headers: auth, body: value })
      if (!r.ok) {
        res.status(502).json({ error: 'kv-write-failed' })
        return
      }
      res.status(200).json({ configured: true, ok: true })
      return
    }

    res.status(405).json({ error: 'method-not-allowed' })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
}
