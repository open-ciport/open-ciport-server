import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.GRANTS_SUBJECT, (table) => {
    table.string('ico').primary()
    table.string('uid').notNullable()
    table.string('account').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.GRANTS_SUBJECT)
}
