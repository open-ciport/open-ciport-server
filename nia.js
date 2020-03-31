import fs from 'fs'
import bodyParser from 'body-parser'
import NIA from 'node-nia-connector'
require('dotenv').config()

const NIAConnector = new NIA({
  audience: process.env.AUDIENCE,
  private_key: fs.readFileSync(process.env.KEY_FILE).toString(),
  certificate: fs.readFileSync(process.env.CERT_FILE).toString(),
  assert_endpoint: process.env.ASSERT_ENDPOINT
})

export default function (app, required) {
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/login', function (req, res, next) {
    const attrs = [
      NIA.PROFILEATTRS.GIVEN_NAME,
      NIA.PROFILEATTRS.AGE,
      NIA.PROFILEATTRS.CZMORIS_ID_TYPE,
      NIA.PROFILEATTRS.EMAIL
    ]
    NIAConnector.createAuthRequestUrl(attrs).then(loginUrl => {
      res.redirect(loginUrl)
    }).catch(next)
  })

  app.post('/ExternalLogin', function (req, res, next) {
    NIAConnector.postAssert(req.body).then(samlResponse => {
      req.session.user = samlResponse
      res.redirect(process.env.AFTERLOGIN_URL)
    }).catch(next)
  })

  app.get('/logout', required, (req, res, next) => {
    const nameId = req.user.NameID
    const sessionIndex = req.user.SessionIndex
    NIAConnector.createLogoutRequestUrl(nameId, sessionIndex)
      .then(logoutUrl => { res.redirect(logoutUrl) })
      .catch(next)
  })

  app.post('/ExternalLogout', (req, res, next) => {
    try {
      const samlResponse = NIAConnector.logoutAssert(req.body)
      res.json(samlResponse)
    } catch (err) {
      next(err)
    }
  })
}
