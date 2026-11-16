export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const fail = (statusCode: number, statusMessage: string) =>
    createError({ statusCode, statusMessage, message: statusMessage })

  const personError = validatePerson(body?.person)
  if (personError) throw fail(400, personError)
  if (typeof body.story !== 'string' || body.story.trim().length < 20)
    throw fail(400, 'Ceritakan permasalahanmu minimal 20 karakter.')
  if (body.consent !== true) throw fail(400, 'Persetujuan layanan wajib dicentang.')

  const found = typeof body.slotId === 'string' ? findSlot(body.slotId) : null
  if (!found) throw fail(400, 'Jadwal tidak ditemukan.')
  const option = found.helper.options.find((o) => o.id === body.optionId)
  if (!option) throw fail(400, 'Metode konseling tidak valid.')
  if (!found.slot.available)
    throw fail(409, 'Jadwal ini baru saja dipesan orang lain. Silakan pilih jadwal lain.')

  bookedSlots.add(found.slot.id)
  const code = newCode('KS')
  bookings.set(code, {
    code,
    kind: 'konseling',
    createdAt: new Date().toISOString(),
    total: option.price,
    helperId: found.helper.id,
    slotId: found.slot.id,
    optionId: option.id,
    person: body.person,
    topics: Array.isArray(body.topics) ? body.topics.slice(0, 10) : [],
    story: body.story.trim(),
  })

  return {
    code,
    total: option.price,
    helperName: found.helper.name,
    date: found.date,
    time: found.slot.time,
    method: option.label,
  }
})
