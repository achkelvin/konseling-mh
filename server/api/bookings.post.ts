export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const fail = (statusCode: number, statusMessage: string) =>
    createError({ statusCode, statusMessage, message: statusMessage })

  const lang = toLang(body?.lang)
  const invalid = personError(body?.person, lang)
  if (invalid) throw fail(400, invalid)
  if (typeof body.story !== 'string' || body.story.trim().length < 20) throw fail(400, errorText('story', lang))
  if (body.consent !== true) throw fail(400, errorText('consent', lang))

  const found = typeof body.slotId === 'string' ? findSlot(body.slotId) : null
  if (!found) throw fail(400, errorText('slot', lang))
  const option = found.helper.options.find((o) => o.id === body.optionId)
  if (!option) throw fail(400, errorText('option', lang))
  if (!found.slot.available) throw fail(409, errorText('taken', lang))

  bookedSlots.add(found.slot.id)
  const code = newCode('KS')
  const person = cleanPerson(body.person)
  const topics: string[] = Array.isArray(body.topics) ? body.topics.slice(0, 10).map(String) : []
  const story = body.story.trim()
  const schedule = `${tanggal(found.date)}, ${found.slot.time} WIB`

  bookings.set(code, {
    code,
    kind: 'konseling',
    createdAt: new Date().toISOString(),
    total: option.price,
    helperId: found.helper.id,
    slotId: found.slot.id,
    optionId: option.id,
    person,
    topics,
    story,
  })

  const summary: [string, unknown][] = [
    ['Helper', found.helper.name],
    ['Jadwal', schedule],
    ['Metode', `${option.label} · ${option.durationMinutes} menit`],
    ['Total', rupiah(option.price)],
  ]
  const emailSent = await notify({
    code,
    person,
    total: option.price,
    adminSubject: `[Konseling] ${code} — ${person.fullName} — ${schedule}`,
    adminRows: [
      ['Kode', code],
      ...summary,
      ...personRows(person),
      ['Topik', topics.join(', ') || '-'],
      ['Cerita', story],
    ],
    clientSubject:
      lang === 'en'
        ? `Counseling registration ${code} — awaiting payment`
        : `Pendaftaran konseling ${code} — menunggu pembayaran`,
    clientRows:
      lang === 'en'
        ? [
            ['Helper', found.helper.name],
            ['Time', `${tanggal(found.date, 'en')}, ${found.slot.time} WIB`],
            ['Method', `${option.label} · ${option.durationMinutes} min`],
            ['Total', rupiah(option.price)],
          ]
        : summary,
    lang,
  })

  return {
    code,
    total: option.price,
    helperName: found.helper.name,
    date: found.date,
    time: found.slot.time,
    method: option.label,
    emailSent,
  }
})
