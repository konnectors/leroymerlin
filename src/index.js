const {
  BaseKonnector,
  requestFactory,
  signin,
  scrape,
  saveBills,
  log
} = require('cozy-konnector-libs')
const userAgent =
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:62.0) Gecko/20100101 Firefox/62.0 Cozycloud'
const request = requestFactory({
  cheerio: false, //Very important due to lib bug for now
  json: false,
  jar: true,
  //  debug: true,
  headers: { 'User-Agent': userAgent }
})

module.exports = new BaseKonnector(start)

// The start function is run by the BaseKonnector instance only when it got all the account
// information (fields). When you run this connector yourself in "standalone" mode or "dev" mode,
// the account information come from ./konnector-dev-config.json file
async function start(fields) {
  await request({ url: 'https://www.leroymerlin.fr/' })
}
