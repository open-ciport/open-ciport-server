require('dotenv').config()
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import InitGrantApp from './api/grants'
import {generalErrorHlr, authErrorHlr, notFoundErrorHlr} from './error_handlers'
import { initApp, getUid, required } from './auth'
const initDB = require('./db')
const port = process.env.PORT

function initExpressApp (knex) {
  const app = express()
  app.use(morgan('dev'))

  const corsMiddleware = cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
    preflightContinue: false
  })
  app.use(corsMiddleware)
  app.options(corsMiddleware)

  initApp(app)
  const auth = { getUid, required }

  InitGrantApp(app, express, knex, auth, bodyParser.json())

  // ERROR HANDLING ------------------------------------------------------------
  app.use(notFoundErrorHlr, authErrorHlr, generalErrorHlr)
  // ---------------------------------------------------------------------------
  return app
}

// ENTRY point
initDB()
  .then(knex => {
    const app = initExpressApp(knex)
    const host = process.env.HOST || '127.0.0.1'
    app.listen(port, host, (err) => {
      if (err) {
        throw err
      }
      console.log(`frodo do magic on ${host}:${port}`)
    })
  })
  .catch(err => {
    console.error(err)
  })
