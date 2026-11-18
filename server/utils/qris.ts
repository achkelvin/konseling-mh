import QRCode from 'qrcode'

/**
 * Mengubah payload QRIS statis (dari QR merchant kamu) menjadi QRIS dinamis
 * berisi nominal tertentu, lalu merendernya menjadi gambar PNG.
 *
 * Payload QRIS berbentuk TLV (tag 2 digit, panjang 2 digit, nilai).
 * - Tag 01: "11" = statis, "12" = dinamis
 * - Tag 54: nominal transaksi
 * - Tag 63: CRC16-CCITT dari seluruh string sebelumnya (termasuk "6304")
 */

function crc16(str: string) {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function parseTlv(payload: string) {
  const out: [string, string][] = []
  let i = 0
  while (i < payload.length) {
    const tag = payload.slice(i, i + 2)
    const len = Number(payload.slice(i + 2, i + 4))
    if (!/^\d{2}$/.test(tag) || Number.isNaN(len)) throw new Error('Payload QRIS tidak valid')
    out.push([tag, payload.slice(i + 4, i + 4 + len)])
    i += 4 + len
  }
  return out
}

const tlv = (tag: string, value: string) => tag + String(value.length).padStart(2, '0') + value

export function toDynamicQris(staticPayload: string, amount: number) {
  const fields = parseTlv(staticPayload.trim()).filter(([t]) => t !== '63' && t !== '54')
  const map = new Map(fields)
  map.set('01', '12')
  map.set('54', String(Math.round(amount)))
  const body = [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([t, v]) => tlv(t, v))
    .join('')
  const withCrcTag = body + '6304'
  return withCrcTag + crc16(withCrcTag)
}

/** Payload contoh yang strukturnya valid tetapi BUKAN merchant sungguhan. */
const DEMO_PAYLOAD =
  '00020101021126570011ID.DANA.WWW011893600915000000000002090000000000303UMI51440014ID.CO.QRIS.WWW0215ID10000000000000303UMI5204899953033605802ID5911KONSELINGMH6010YOGYAKARTA61055528163040000'

export async function paymentQr(amount: number) {
  const configured = useRuntimeConfig().qrisPayload as string
  const payload = toDynamicQris(configured || DEMO_PAYLOAD, amount)
  const png = await QRCode.toBuffer(payload, { width: 360, margin: 2, errorCorrectionLevel: 'M' })
  return {
    demo: !configured,
    png,
    dataUrl: 'data:image/png;base64,' + png.toString('base64'),
  }
}
