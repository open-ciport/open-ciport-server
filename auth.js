import InitNIA from './nia'
const session = require('express-session')
const redis = require('redis')

const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()

export function initApp (app) {
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production'
      }
    })
  )
  app.use((req, res, next) => {
    try { req.user = req.session.user.user } catch (_) {} finally { next() }
  })
  InitNIA(app, required)
  app.get('/profile', required, (req, res, next) => {
    res.json(req.session.user.user)
  })
}

export function getUid (req) {
  return req.user.id
}

export function required (req, res, next) {
  return req.user ? next() : next(401)
}
