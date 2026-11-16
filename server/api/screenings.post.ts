export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const personError = validatePerson(body?.person)
  if (personError)
    throw createError({ statusCode: 400, statusMessage: personError, message: personError })

  const code = newCode('CK')
  bookings.set(code, {
    code,
    kind: 'skrining',
    createdAt: new Date().toISOString(),
    total: SCREENING_PRICE,
    person: body.person,
  })
  return { code, total: SCREENING_PRICE }
})
