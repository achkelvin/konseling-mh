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

  const found = typeof body.slotId === 'string' ? findSlot(body.slotId) : null
  if (!found) throw fail(400, errorText('slot', lang))
  if (!found.slot.available) throw fail(409, errorText('taken', lang))

  const price = priceFor(service.id, person.discount, minor)
  const topics: string[] = Array.isArray(body.topics)
    ? body.topics.filter((t: unknown) => TOPICS.includes(t as any)).slice(0, TOPICS.length)
    : []

  bookedSlots.add(found.slot.id)
  const code = newCode(service.id === 'mhcu' ? 'CK' : 'KS')
  bookings.set(code, {
    code,
    createdAt: new Date().toISOString(),
    total: price.total,
    serviceId: service.id,
    slotId: found.slot.id,
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
  }
})
