import { put } from '@vercel/blob'


export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  const blob = await put(`labels/${Date.now()}.png`, file, {
    access: 'public',
  })

  return Response.json({ url: blob.url })
}
