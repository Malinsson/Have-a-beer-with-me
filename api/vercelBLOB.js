import { put } from '@vercel/blob'
import { readFile } from 'node:fs/promises'
import formidable from 'formidable'

const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const MIME_TO_EXTENSION = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024


export const config = {
  runtime: 'nodejs',
  api: {
    bodyParser: false,
  },
}

const parseMultipartForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      maxFileSize: MAX_FILE_SIZE_BYTES,
    })

    form.parse(req, (err, _fields, files) => {
      if (err) {
        reject(err)
        return
      }

      const parsed = files.file
      const uploadedFile = Array.isArray(parsed) ? parsed[0] : parsed
      resolve(uploadedFile)
    })
  })

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Metod inte tillåten')
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json(
        { error: 'BLOB_READ_WRITE_TOKEN saknas i miljövariablerna.' },
      )
    }

    const file = await parseMultipartForm(req)

    if (!file) {
      return res.status(400).json({ error: 'Ingen fil tillagd' })
    }

    const mimeType = file.mimetype || 'application/octet-stream'

    if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
      return res.status(415).json({ error: 'Endast bilduppladdningar är tillåtna.' })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return res.status(413).json({ error: 'Filen är för stor. Max 10 MB.' })
    }

    const fileBuffer = await readFile(file.filepath)
    const extension = MIME_TO_EXTENSION[mimeType] || 'bin'
    const safeName = `labels/${Date.now()}-${crypto.randomUUID()}.${extension}`

    const blob = await put(safeName, fileBuffer, {
      access: 'public',
    })

    return res.status(200).json({ url: blob.url })
  } catch (error) {
    console.error('Upload function failed:', error)
    const message = error instanceof Error ? error.message : 'A server error has occurred'
    return res.status(500).json({ error: message })
  }
}
