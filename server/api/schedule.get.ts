/** Jadwal psikolog yang masih kosong (waktu WIB). */
export default defineEventHandler(() => {
  const schedules = buildSchedule()
  return {
    psychologistId: SITE.psychologist.id,
    schedules,
    availableSlotCount: schedules.reduce((n, d) => n + d.slots.filter((s) => s.available).length, 0),
  }
})
