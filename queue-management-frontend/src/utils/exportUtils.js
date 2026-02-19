export const exportBookingHistory = (bookings) => {
  const csvContent = [
    ['Date', 'Place', 'Token', 'Status', 'Party Size', 'Time Slot'].join(','),
    ...bookings.map(b => [
      new Date(b.createdAt).toLocaleDateString(),
      b.place?.name || 'N/A',
      b.tokenNumber || 'N/A',
      b.status,
      b.partySize || 1,
      b.slotTime || 'N/A'
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `booking-history-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}
