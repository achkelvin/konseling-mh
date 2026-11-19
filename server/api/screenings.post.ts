export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const invalid = personError(body?.person)
  if (invalid) throw createError({ statusCode: 400, statusMessage: invalid, message: invalid })

  const person = cleanPerson(body.person)
  const code = newCode('CK')
  bookings.set(code, {
    code,
    kind: 'skrining',
    createdAt: new Date().toISOString(),
    total: SCREENING_PRICE,
    person,
  })

  const summary: [string, unknown][] = [
    ['Layanan', 'Cek Kesehatan Mental'],
    ['Total', rupiah(SCREENING_PRICE)],
  ]
  const emailSent = await notify({
    code,
    person,
    total: SCREENING_PRICE,
    adminSubject: `[Cek Kesehatan Mental] ${code} — ${person.fullName}`,
    adminRows: [['Kode', code], ...summary, ...personRows(person)],
    clientSubject: `Pendaftaran cek kesehatan mental ${code} — menunggu pembayaran`,
    clientRows: summary,
  })

  return { code, total: SCREENING_PRICE, emailSent }
})
