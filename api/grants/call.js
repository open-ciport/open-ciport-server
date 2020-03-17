import { TNAMES, CALL_STATUS } from './consts'
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'

export default (app, knex, auth, bodyParser) => {
  //
  app.get('/', (req, res, next) => {
    knex(TNAMES.GRANTS_CALL).where(whereFilter(req.query)).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  const editables = ['name', 'submission_start', 'submission_end', 'allocation']

  app.post('/', bodyParser, (req, res, next) => {
    req.body = _.pick(req.body, editables)
    knex(TNAMES.GRANTS_CALL).returning('id').insert(req.body)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  app.put('/:id([0-9]+)', bodyParser, async (req, res, next) => {
    try {
      req.body = _.pick(req.body, editables)
      const item = knex(TNAMES.GRANTS_CALL).where({ id: req.params.id })
      const call = await item
      if (!call.length) return next(404)
      if (call[0].status === CALL_STATUS.DRAFT) {
        res.json(await item.update(req.body))
        next()
      } else {
        next('nondraft call cannot be edited anymore')
      }
    } catch (err) {
      next(err)
    }
  })
  //
  // app.put('/:id([0-9]+)/start', (req, res, next) => {
  //   const change = { status: CALL_STATUS.OPEN }
  //   knex(TNAMES.PARO_CALL).where({ id: req.params.id }).update(change)
  //     .then(rowsupdated => {
  //       res.json(rowsupdated)
  //       next()
  //     })
  //     .catch(next)
  // })
}
