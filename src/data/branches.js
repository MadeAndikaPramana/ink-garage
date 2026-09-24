// Ink Garage Tattoo Studio — single studio in Canggu. Everything below comes
// from public listings read in Sept 2026 (Google Maps listing + the studio's
// own Instagram @inkgaragetattoostudio) and has NOT been confirmed with the
// owner. Open items (search TODO):
//
// TODO(owner): address — Maps says Jl. Raya Canggu No.162A, but a recent
//   Instagram post mentions "Jl. Pantai Berawa No…". Confirm which is current
//   (or whether there are two locations).
// TODO(owner): hours — an Instagram post says 10:00–20:00, another summary
//   says 10:00–18:00, and Maps showed "closed, opens Fri 10:00" on a Thursday.
// TODO(owner): artists — only first names ("Zoro", "Jung") appear as
//   Instagram highlights ("BY ZORO", "BY JUNG"); roles/bios/pronouns unknown.
// The kept `branches` shape (array with `team`) lets Book/Team/Location reuse
// the same structure as the sibling sites.
export const BRANCHES = [
  {
    id: 'canggu',
    short: 'Canggu',
    name: 'Ink Garage Tattoo Studio',
    country: 'Bali, Indonesia',
    address: 'Jl. Raya Canggu No.162A, Canggu, Kec. Kuta Utara, Kabupaten Badung, Bali 80351',
    phoneDisplay: '+62 821-2222-699',
    whatsapp: 'https://wa.me/628212222699',
    hours: '10:00 – 20:00',
    instagram: 'https://www.instagram.com/inkgaragetattoostudio/',
    instagramHandle: '@inkgaragetattoostudio',
    mapsLink: 'https://maps.app.goo.gl/y97ML4AhM6uUUjRJ6',
    mapsEmbed:
      'https://www.google.com/maps?q=Ink+Garage+Tattoo+Studio,+Jl.+Raya+Canggu+No.162A,+Canggu,+Bali&output=embed',
    src: null,
    team: [
      { name: 'Zoro', role: 'Tattoo artist' },
      { name: 'Jung', role: 'Tattoo artist' },
    ],
  },
]
