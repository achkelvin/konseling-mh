/**
 * Pendaftaran sesi: Chat, Voice Call, Video Call, atau MHCU + konsul hasil.
 * Offline (Jakarta) tidak bisa dipesan di sini — by request lewat WhatsApp admin.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const fail = (statusCode: number, statusMessage: string) =>
    createError({ statusCode, statusMessage, message: statusMessage })

  const lang = toLang(body?.lang)
  const service = serviceById(body?.serviceId)
  if (!service) throw fail(400, errorText('service', lang))
  if (!service.bookable) throw fail(400, errorText('notBookable', lang))

  const invalid = personError(body?.person, lang)
  if (invalid) throw fail(400, invalid)
  const person = cleanPerson(body.person)
  const minor = isMinor(person.birthDate)
  if (minor && body.guardianConsent !== true) throw fail(400, errorText('guardianConsent', lang))
  if (body.consent !== true) throw fail(400, errorText('consent', lang))

  // Jadwal: dari Cal.com (bila dipakai) atau dari pemilih jadwal bawaan
  const cal = body.cal && typeof body.cal === 'object' ? body.cal : null
  let found: { date: string; slot: { id: string; time: string; available: boolean } } | null = null
  if (cal) {
    const start = typeof cal.startTime === 'string' ? new Date(cal.startTime) : null
    if (typeof cal.uid !== 'string' || !cal.uid || !start || Number.isNaN(start.getTime()) || start.getTime() < Date.now())
      throw fail(400, errorText('slot', lang))
    // tampilkan dalam WIB, sama seperti jadwal bawaan
    const wib = new Date(start.getTime() + 7 * 3600_000).toISOString()
    found = { date: wib.slice(0, 10), slot: { id: `cal_${cal.uid}`, time: wib.slice(11, 16), available: true } }
  } else {
    found = typeof body.slotId === 'string' ? findSlot(body.slotId) : null
    if (!found) throw fail(400, errorText('slot', lang))
    if (!found.slot.available) throw fail(409, errorText('taken', lang))
  }

  const price = priceFor(service.id, person.discount, minor)
  const topics: string[] = Array.isArray(body.topics)
    ? body.topics.filter((t: unknown) => TOPICS.includes(t as any)).slice(0, TOPICS.length)
    : []

  if (!cal) bookedSlots.add(found.slot.id)
  const code = newCode(service.id === 'mhcu' ? 'CK' : 'KS')
  bookings.set(code, {
    code,
    createdAt: new Date().toISOString(),
    total: price.total,
    serviceId: service.id,
    slotId: cal ? null : found.slot.id,
    calUid: cal?.uid ?? null,
    calStatus: cal?.status ?? null,
    discount: price.discountApplied,
    person,
    topics,
  })

  const schedule = `${tanggal(found.date)}, ${found.slot.time} WIB`
  const discountNote = price.discountApplied
    ? ` (diskon ${price.discountApplied === 'student' ? 'pelajar/mahasiswa' : 'diaspora'} 10% dari ${rupiah(price.base)} — cek bukti via WhatsApp)`
    : person.discount !== 'none'
      ? ' (diskon diminta tetapi tidak berlaku untuk layanan/usia ini)'
      : ''

  const emailSent = await notify({
    code,
    person,
    total: price.total,
    adminSubject: `[${service.name}] ${code} — ${person.fullName} — ${schedule}`,
    adminRows: [
      ['Kode', code],
      ['Layanan', `${service.name} · ${service.minutes} menit`],
      ['Psikolog', SITE.psychologist.name],
      ['Jadwal', schedule],
      ...(cal
        ? ([['Cal.com', `booking ${cal.uid}${cal.status ? ` (${cal.status})` : ''}${cal.paymentRequired ? ' · bayar PayPal di Cal.com' : ''} — konfirmasi di dashboard Cal.com`]] as [string, unknown][])
        : []),
      ['Total', rupiah(price.total) + discountNote],
      ...personRows(person),
      ['Topik', topics.join(', ') || '-'],
    ],
    clientSubject:
      lang === 'en'
        ? `Registration ${code} — awaiting payment`
        : `Pendaftaran ${code} — menunggu pembayaran`,
    clientRows:
      lang === 'en'
        ? [
            ['Service', `${service.id === 'mhcu' ? 'MHCU + results session' : service.name} · ${service.minutes} min`],
            ['Time', `${tanggal(found.date, 'en')}, ${found.slot.time} WIB`],
            ['Total', rupiah(price.total)],
          ]
        : [
            ['Layanan', `${service.name} · ${service.minutes} menit`],
            ['Jadwal', schedule],
            ['Total', rupiah(price.total)],
          ],
    lang,
    paidOnline: !!cal?.paymentRequired,
  })

  return {
    code,
    total: price.total,
    base: price.base,
    discountApplied: price.discountApplied,
    serviceId: service.id,
    date: found.date,
    time: found.slot.time,
    emailSent,
    // dibayar lewat PayPal di Cal.com: jangan minta transfer lagi
    paidOnline: !!cal?.paymentRequired,
  }
})
