const envConfig = require('./../config/env.config')
const helmet = require('helmet')
const csp = require('helmet-csp')
const hsts = require('hsts')
const referrerPolicy = require('referrer-policy')
const hpkp = require('hpkp')

module.exports = () => {
  const helmetMiddleware = [
    helmet(),
    csp({
      directives: {
        defaultSrc: ['\'self\''],
        frameSrc: ['\'self\'', 'https://www.youtube.com'],
        fontSrc: ['\'self\'', 'data:', 'https://fonts.gstatic.com', 'https://maxcdn.bootstrapcdn.com'],
        imgSrc: ['\'self\'', 'data:', 'https://maps.googleapis.com', 'https://csi.gstatic.com', 'https://maps.gstatic.com', 'https://www.google-analytics.com', 'https://david-dm.org', 'https://cdn.rawgit.com'],
        objectSrc: ['\'none\''],
        scriptSrc: ['\'self\'', 'https://maps.googleapis.com', 'https://www.google-analytics.com'],
        styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com', 'https://maxcdn.bootstrapcdn.com']
      },
      browserSniff: false
    }),
    hsts({
      maxAge: 5184000 // sixty days in seconds
    }),
    referrerPolicy({
      policy: 'no-referrer-when-downgrade'
    })
  ]

  if (envConfig.get('USE_HPKP')) {
    helmetMiddleware.push(hpkp({
      includeSubdomains: true,
      maxAge: 5184000, // sixty days in seconds
      reportUri: '/report-violation',
      setIf: (req) => req.secure,
      sha256s: ['53qvf5kek7sy/znpspnwh9xlfnvfmfucgiqwkvhj6dy=', '53qvf5kek7sy/znpspnwh9xlfnvfmfucgiqwkvhj6dy=']
    }))
  } else {
    console.log('HPKP disabled')
  }

  return helmetMiddleware
}
