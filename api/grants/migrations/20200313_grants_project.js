import { TNAMES, PROJECT_STATE } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.GRANTS_PROJECT, (table) => {
    table.increments('id').primary()
    table.integer('call_id').references('id').inTable(TNAMES.GRANTS_CALL).notNullable()
    table.string('name').notNullable()
    table.string('podp_oblasti').notNullable()
    table.string('state', 8).notNullable().defaultTo(PROJECT_STATE.SUBMITTED)
    table.string('ico').references('ico').inTable(TNAMES.GRANTS_SUBJECT).notNullable()
    table.string('desc').notNullable()
    table.string('mistorealizace').notNullable()
    table.date('zahajeni').notNullable()
    table.date('ukonceni').notNullable()
    table.text('content').notNullable()
    table.text('naklady').notNullable()
    table.text('prijmy').notNullable()
    table.integer('pozadovanadotace').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['ico', 'call_id'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.GRANTS_PROJECT)
}
