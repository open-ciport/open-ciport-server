import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initErrorHandlers from './error_handlers'
import { initApp, getUid, required } from './auth'
import uredniBackend from './ouris_backends/debug'
import initDB from './db'

const apps = {
  grants: './api/grants',
  forms: './api/forms'
}

async function init (host, port) {
  const db = await initDB(apps)
  const app = express()
  const JSONBodyParser = bodyParser.json()
  app.use(morgan('dev'))

  const corsMiddleware = cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
    preflightContinue: false
  })
  app.use(corsMiddleware)
  app.options(corsMiddleware)

  initApp(app)

  const appContext = {
    express,
    db,
    auth: { getUid, required },
    JSONBodyParser,
    integrator: uredniBackend.send
  }

  uredniBackend.init(app)

  for (var appname in apps) { // init all apps
    const appInit = require(apps[appname]).default
    const subApp = appInit(appContext)
    app.use(`/${appname}`, subApp)
  }

  initErrorHandlers(app) // ERROR HANDLING
  app.listen(port, host, (err) => {
    if (err) throw err
    console.log(`frodo do magic on ${host}:${port}`)
  })
}

try {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT
  init(host, port)
} catch (err) {
  console.error(err)
}
