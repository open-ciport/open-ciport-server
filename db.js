const knex = require('knex')
const path = require('path')
const DB_URL = process.env.DATABASE_URL

const opts = {
  migrations: {
    directory: path.join(__dirname, 'api', 'grants', 'migrations')
  },
  debug: process.env.NODE_ENV === 'debug'
}
if (DB_URL.indexOf('postgres') >= 0) {
  Object.assign(opts, { client: 'pg', connection: DB_URL })
} else {
  Object.assign(opts, {
    client: 'sqlite3',
    connection: {
      filename: DB_URL === undefined ? ':memory:' : DB_URL
    },
    useNullAsDefault: true,
    pool: { min: 0, max: 7 }
  })
}

const db = knex(opts)

module.exports = () => {
  return db.migrate.latest()
    .then(() => {
      return process.env.RUN_SEEDS ? db.seed.run(opts) : null
    })
    .then(() => {
      return db
    })
}
