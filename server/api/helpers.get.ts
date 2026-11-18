export default defineEventHandler(() => {
  const now = new Date()
  return helpers.map(({ days, hours, ...h }) => {
    const schedules = buildSchedule({ ...h, days, hours }, now)
    return {
      ...h,
      schedules,
      availableSlotCount: schedules.reduce(
        (n, d) => n + d.slots.filter((s) => s.available).length,
        0,
      ),
    }
  })
})
