const {
  BaseKonnector,
  requestFactory,
  signin,
  scrape,
  saveBills,
  log
} = require('cozy-konnector-libs')

const { JSDOM } = require('jsdom')

const request = requestFactory({
  // the debug mode shows all the details about http request and responses. Very usefull for
  // debugging but very verbose. That is why it is commented out by default
  // debug: true,
  // activates [cheerio](https://cheerio.js.org/) parsing on each page
  cheerio: true,
  // If cheerio is activated do not forget to deactivate json parsing (which is activated by
  // default in cozy-konnector-libs
  json: false,
  // this allows request-promise to keep cookies between requests
  jar: true
})

const baseUrl = 'https://www.leroymerlin.fr'
const loginUrl = 'https://sso.leroymerlin.fr/oauth-server/oauth/authorize?language=fr&response_type=code&client_id=FRLM-FRONTWEB&state=weau6NTWeF&redirect_uri=https%3A%2F%2Fwww.leroymerlin.fr%2Foauthcallback%3Fclient_name%3DLmClient'

module.exports = new BaseKonnector(start)

// The start function is run by the BaseKonnector instance only when it got all the account
// information (fields). When you run this connector yourself in "standalone" mode or "dev" mode,
// the account information come from ./konnector-dev-config.json file
async function start(fields) {
  const $ = await request(loginUrl)

  log('info', 'Authenticating ...')
  await authenticate(fields.login, fields.password, $)
  //log('info', 'Successfully logged in')

  // The BaseKonnector instance expects a Promise as return of the function
  //log('info', 'Fetching the list of documents')
  // const $ = await request(`${baseUrl}/index.html`)
  // cheerio (https://cheerio.js.org/) uses the same api as jQuery (http://jquery.com/)
  //log('info', 'Parsing list of documents')
  //const documents = await parseDocuments($)

  // here we use the saveBills function even if what we fetch are not bills, but this is the most
  // common case in connectors
  //log('info', 'Saving data to Cozy')
  //await saveBills(documents, fields.folderPath, {
  // this is a bank identifier which will be used to link bills to bank operations. These
  // identifiers should be at least a word found in the title of a bank operation related to this
  // bill. It is not case sensitive.
  //  identifiers: ['books']
  //})
}

// this shows authentication using the [signin function](https://github.com/konnectors/libs/blob/master/packages/cozy-konnector-libs/docs/api.md#module_signin)
// even if this in another domain here, but it works as an example
function authenticate(username, password, $) {

  log('info', 'Avec Jsdom : en inserrant un script directement dans la page html ')

  const script = `
   <script>
   const form = document.getElementById('loginForm')
   form.querySelector("#username").value = username
   form.querySelector("#password").value = password
   form.querySelector("#login").click()
   //form.submit()
   </script>`

  const page = $('html')
  const body = $('body')
  body.append(script)
  const dom = new JSDOM(page.html(), { pretendToBeVisual: true, runScripts: "dangerously" });

  //-----------------------------------------------------------------------------

  log('info', 'Avec Jsdom')

  const page2 = $('html')
  const dom2 = new JSDOM(page.html(), { pretendToBeVisual: true });

  const form2 = dom2.window.document.getElementById("loginForm")
  form2.querySelector("#username").value = username
  form2.querySelector("#password").value = password
  form2.querySelector('#login').click()
  //form2.submit()

  /*return signin({
    url: `${loginUrl}`,
    formSelector: '#loginForm',
    formData: { j_username: username, j_password: password },
    // the validate function will check if
    validate: (statusCode, $) => {
      return $('.error') == null
    }
  })*/
}