const fs = require('fs')
const path = require('path')

// Create directories if they don't exist
const publicDir = path.join(process.cwd(), 'public')
const testimonialsDir = path.join(publicDir, 'testimonials')

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir)
}

if (!fs.existsSync(testimonialsDir)) {
  fs.mkdirSync(testimonialsDir)
}

// Create a simple SVG for testimonial avatars
const createAvatar = (name, color) => `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${color}"/>
  <text x="200" y="200" font-family="Arial" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle">
    ${name.split(' ').map(n => n[0]).join('')}
  </text>
</svg>
`

// Create a simple dashboard preview
const dashboardPreview = `
<svg width="2432" height="1442" xmlns="http://www.w3.org/2000/svg">
  <rect width="2432" height="1442" fill="#f3f4f6"/>
  <rect x="0" y="0" width="2432" height="64" fill="#4f46e5"/>
  <text x="1216" y="721" font-family="Arial" font-size="40" fill="#6b7280" text-anchor="middle">
    Dashboard Preview
  </text>
</svg>
`

// Generate testimonial avatars
const testimonials = [
  { name: 'Sarah Chen', color: '#4f46e5' },
  { name: 'Michael Rodriguez', color: '#0891b2' },
  { name: 'Emily Thompson', color: '#be185d' },
  { name: 'David Kim', color: '#059669' },
]

testimonials.forEach(({ name, color }) => {
  const fileName = name.toLowerCase().replace(' ', '').concat('.svg')
  fs.writeFileSync(
    path.join(testimonialsDir, fileName),
    createAvatar(name, color)
  )
})

// Generate dashboard preview
fs.writeFileSync(
  path.join(publicDir, 'dashboard-preview.svg'),
  dashboardPreview
) 