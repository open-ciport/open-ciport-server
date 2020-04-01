import knex from 'knex'
import path from 'path'
import fs from 'fs'
import assert from 'assert'
assert.ok(process.env.DATABASE_URL, 'env.DATABASE_URL not defined!')

export default async (apps) => {
  //
  const opts = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: Object.keys(apps).reduce((acc, key) => {
        const modulepath = path.dirname(require.resolve(apps[key]))
        const migrationFolder = path.join(modulepath, 'migrations')
        if (fs.existsSync(migrationFolder)) acc.push(migrationFolder)
        return acc
      }, [])
    },
    debug: process.env.NODE_ENV === 'debug'
  }

  const db = knex(opts)

  await db.migrate.latest()

  return db
}
