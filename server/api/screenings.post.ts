export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const personError = validatePerson(body?.person)
  if (personError)
    throw createError({ statusCode: 400, statusMessage: personError, message: personError })

  const person = body.person
  const code = newCode('CK')
  bookings.set(code, {
    code,
    kind: 'skrining',
    createdAt: new Date().toISOString(),
    total: SCREENING_PRICE,
    person,
  })

  const qr = await paymentQr(SCREENING_PRICE)
  const summary: [string, unknown][] = [
    ['Layanan', 'Cek Kesehatan Mental'],
    ['Total', rupiah(SCREENING_PRICE)],
  ]
  const emailSent = await notify({
    code,
    person,
    total: SCREENING_PRICE,
    qr,
    adminSubject: `[Cek Kesehatan Mental] ${code} — ${person.name}`,
    adminRows: [
      ['Kode', code],
      ...summary,
      ['Nama', person.name],
      ['WhatsApp', person.whatsapp],
      ['Email', person.email],
      ['Usia', person.age],
      ['Jenis kelamin', person.gender === 'L' ? 'Laki-laki' : person.gender === 'P' ? 'Perempuan' : '-'],
    ],
    clientSubject: `Pendaftaran cek kesehatan mental ${code} — menunggu pembayaran`,
    clientRows: summary,
  })

  return { code, total: SCREENING_PRICE, qr: qr.dataUrl, qrDemo: qr.demo, emailSent }
})
