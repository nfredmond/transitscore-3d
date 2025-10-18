import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ExportData {
  address: string
  coordinates: { lat: number; lng: number }
  scores: {
    walkability: number
    transit: number
    density: number
    sustainability: number
  }
  recommendation: string
  amenities: any[]
  analysisDate: string
}

export function generatePDF(data: ExportData) {
  const doc = new jsPDF()
  
  // Colors
  const primaryBlue = [0, 103, 177]
  const gold = [255, 184, 28]
  const darkGray = [51, 51, 51]
  const lightGray = [156, 163, 175]
  
  let yPosition = 20
  
  // Header with logo and title
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
  doc.rect(0, 0, 210, 45, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('TransitScore 3D', 20, 20)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('California Development Site Analysis Report', 20, 30)
  
  doc.setFontSize(9)
  doc.setTextColor(200, 200, 200)
  doc.text(`Generated on ${data.analysisDate}`, 20, 38)
  
  yPosition = 55
  
  // Site Information Section
  doc.setFillColor(248, 250, 252)
  doc.rect(15, yPosition, 180, 30, 'F')
  
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Site Information', 20, yPosition + 8)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Address:', 20, yPosition + 16)
  doc.setFont('helvetica', 'bold')
  const addressLines = doc.splitTextToSize(data.address, 140)
  doc.text(addressLines, 45, yPosition + 16)
  
  doc.setFont('helvetica', 'normal')
  doc.text('Coordinates:', 20, yPosition + 23)
  doc.setFont('helvetica', 'bold')
  doc.text(`${data.coordinates.lat.toFixed(6)}, ${data.coordinates.lng.toFixed(6)}`, 45, yPosition + 23)
  
  yPosition += 40
  
  // Scores Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
  doc.text('Performance Scores', 20, yPosition)
  
  yPosition += 10
  
  // Score Cards
  const scores = [
    { label: 'Walkability Score', value: data.scores.walkability, color: [16, 185, 129], icon: '🚶' },
    { label: 'Transit Access Score', value: data.scores.transit, color: [59, 130, 246], icon: '🚌' },
    { label: 'Density Potential', value: data.scores.density, color: [168, 85, 247], icon: '🏢' },
    { label: 'Sustainability Score', value: data.scores.sustainability, color: [16, 185, 129], icon: '🌱' }
  ]
  
  scores.forEach((score, index) => {
    const xPos = 20 + (index % 2) * 95
    const yPos = yPosition + Math.floor(index / 2) * 35
    
    // Score card background
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(xPos, yPos, 85, 30, 3, 3, 'F')
    
    // Score label
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
    doc.text(score.label, xPos + 5, yPos + 8)
    
    // Score value
    doc.setFontSize(24)
    doc.setTextColor(score.color[0], score.color[1], score.color[2])
    doc.text(score.value.toString(), xPos + 5, yPos + 22)
    
    // Progress bar
    const barWidth = 75
    const barHeight = 4
    const barX = xPos + 5
    const barY = yPos + 25
    
    // Background bar
    doc.setFillColor(229, 231, 235)
    doc.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'F')
    
    // Progress bar
    doc.setFillColor(score.color[0], score.color[1], score.color[2])
    const progressWidth = (barWidth * score.value) / 100
    doc.roundedRect(barX, barY, progressWidth, barHeight, 2, 2, 'F')
  })
  
  yPosition += 80
  
  // AI Recommendation Section
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
  doc.roundedRect(15, yPosition, 180, 5, 2, 2, 'F')
  
  yPosition += 12
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
  doc.text('🤖 AI-Powered Recommendation', 20, yPosition)
  
  yPosition += 8
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  const recommendationLines = doc.splitTextToSize(data.recommendation, 170)
  doc.text(recommendationLines, 20, yPosition)
  
  yPosition += recommendationLines.length * 5 + 10
  
  // Amenities Summary
  if (yPosition > 240) {
    doc.addPage()
    yPosition = 20
  }
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
  doc.text('Nearby Amenities', 20, yPosition)
  
  yPosition += 8
  
  // Count amenities by category
  const amenityCounts: { [key: string]: number } = {}
  data.amenities.forEach(amenity => {
    amenityCounts[amenity.category] = (amenityCounts[amenity.category] || 0) + 1
  })
  
  const categoryLabels: { [key: string]: string } = {
    transit: '🚌 Transit Stops',
    food: '🍽️ Food & Dining',
    shopping: '🛒 Shopping',
    education: '🎓 Education',
    parks: '🌳 Parks & Recreation',
    health: '⚕️ Healthcare'
  }
  
  // Create amenity summary table
  const tableData: any[] = []
  Object.entries(amenityCounts).forEach(([category, count]) => {
    const label = categoryLabels[category] || category
    const within400m = data.amenities.filter(a => a.category === category && a.distance < 400).length
    const within800m = data.amenities.filter(a => a.category === category && a.distance < 800).length
    tableData.push([label, count.toString(), within400m.toString(), within800m.toString()])
  })
  
  ;(doc as any).autoTable({
    startY: yPosition,
    head: [['Category', 'Total', 'Within 5 min', 'Within 10 min']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryBlue,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 20, right: 20 }
  })
  
  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    
    // Footer line
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
    doc.line(20, 285, 190, 285)
    
    // Footer text
    doc.setFontSize(8)
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setFont('helvetica', 'normal')
    doc.text('TransitScore 3D - California Development Site Analyzer', 20, 290)
    doc.text(`Page ${i} of ${pageCount}`, 180, 290, { align: 'right' })
  }
  
  // Generate filename
  const addressShort = data.address.split(',')[0].replace(/[^a-z0-9]/gi, '_')
  const filename = `TransitScore_${addressShort}_${new Date().toISOString().split('T')[0]}.pdf`
  
  // Save the PDF
  doc.save(filename)
}

