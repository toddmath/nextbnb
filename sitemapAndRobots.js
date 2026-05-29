const sm = require('sitemap')
const path = require('path')

const sitemap = sm.createSitemap({
  hostname: 'http://localhost:3000',
  cacheTime: 600000,
})

const setup = ({ server }) => {
  sitemap.add({
    url: '/houses/:id',
    changefreq: 'daily',
    priority: 1,
  })

  sitemap.add({
    url: '/host',
    changefreq: 'daily',
    priority: 1,
  })

  sitemap.add({
    url: '/bookings',
    changefreq: 'daily',
    priority: 1,
  })

  server.get('/sitemap.xml', (req, res) => {
    sitemap.toXML((err, xml) => {
      if (err) {
        res.status(500).end()
        return
      }

      res.header('Content-Type', 'application/xml')
      res.send(xml)
    })
  })

  server.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'robots.txt'))
  })
}

module.exports = setup
