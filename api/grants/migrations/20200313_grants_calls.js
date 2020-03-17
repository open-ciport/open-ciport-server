import { TNAMES, CALL_STATUS } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.GRANTS_CALL, (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.timestamp('submission_start').notNullable()
    table.timestamp('submission_end').notNullable()
    table.float('allocation').notNullable()
    table.float('minsupport').notNullable()
    table.float('maxsupport').notNullable()
    table.string('status').notNullable().default(CALL_STATUS.DRAFT)
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.GRANTS_CALL)
}
