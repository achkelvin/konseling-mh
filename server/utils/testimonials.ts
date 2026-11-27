// Penyimpanan testimoni dari formulir /testimoni.
// Produksi (Vercel): Upstash Redis lewat REST API (Vercel → Storage/Marketplace → Upstash Redis
// mengisi KV_REST_API_URL dan KV_REST_API_TOKEN). Lokal tanpa variabel itu: file .data/testimonials.json.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface StoredTestimonial {
  id: string
  quote: string
  name: string
  service?: string
  email?: string
  consent: true
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

const KEY = 'renajiwa:testimonials'
const FILE = join(process.cwd(), '.data', 'testimonials.json')

function redis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url, token } : null
}

async function cmd<T>(args: string[]): Promise<T> {
  const r = redis()!
  const res = await $fetch<{ result: T }>(r.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${r.token}` },
    body: args,
  })
  return res.result
}

async function readLocal(): Promise<Record<string, StoredTestimonial>> {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'))
  } catch {
    return {}
  }
}

export async function allTestimonials(): Promise<StoredTestimonial[]> {
  let list: StoredTestimonial[]
  if (redis()) {
    const flat = (await cmd<string[]>(['HGETALL', KEY])) || []
    list = []
    for (let i = 1; i < flat.length; i += 2) list.push(JSON.parse(flat[i]!))
  } else list = Object.values(await readLocal())
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getTestimonial(id: string) {
  if (redis()) {
    const raw = await cmd<string | null>(['HGET', KEY, id])
    return raw ? (JSON.parse(raw) as StoredTestimonial) : null
  }
  return (await readLocal())[id] ?? null
}

export async function saveTestimonial(t: StoredTestimonial) {
  if (redis()) {
    await cmd(['HSET', KEY, t.id, JSON.stringify(t)])
    return
  }
  if (process.env.VERCEL) throw new Error('Penyimpanan belum diatur: hubungkan Upstash Redis di Vercel.')
  const all = await readLocal()
  all[t.id] = t
  await mkdir(join(process.cwd(), '.data'), { recursive: true })
  await writeFile(FILE, JSON.stringify(all, null, 2))
}

export const newTestimonialId = () => Date.now().toString(36) + randomBytes(4).toString('hex')

/** Tanda tangan untuk tautan setujui/tolak di email admin. */
function secret() {
  const s = useRuntimeConfig().testimonialsSecret
  if (!s && process.env.VERCEL) throw new Error('NUXT_TESTIMONIALS_SECRET belum diisi')
  return s || 'dev-secret'
}

export const signModeration = (id: string, action: string) =>
  createHmac('sha256', secret()).update(`${id}:${action}`).digest('hex').slice(0, 32)

export function verifyModeration(id: string, action: string, sig: string) {
  const a = Buffer.from(signModeration(id, action))
  const b = Buffer.from(String(sig))
  return a.length === b.length && timingSafeEqual(a, b)
}
