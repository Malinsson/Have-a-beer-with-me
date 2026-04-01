import { put } from '@vercel/blob'

const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const MIME_TO_EXTENSION = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024


export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Metod inte tillåten', { status: 405 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  // FormData from canvas uploads can be Blob, not always File.
  if (!file || typeof file !== 'object' || typeof file.arrayBuffer !== 'function') {
    return Response.json({ error: 'Ingen fil tillagd' }, { status: 400 })
  }

  const mimeType = file.type || 'application/octet-stream'

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return Response.json({ error: 'Endast bilduppladdningar är tillåtna.' }, { status: 415 })
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return Response.json({ error: 'Filen är för stor. Max 10 MB.' }, { status: 413 })
  }

  const extension = MIME_TO_EXTENSION[mimeType] || 'bin'
  const safeName = `labels/${Date.now()}-${crypto.randomUUID()}.${extension}`

  const blob = await put(safeName, file, {
    access: 'public',
  })

  return Response.json({ url: blob.url })
}
