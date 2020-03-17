import { TNAMES } from './consts'
import _ from 'underscore'

export default (app, knex, auth, bodyParser) => {
  //
  app.get('/', auth.required, (req, res, next) => {
    const uid = auth.getUid(req)
    knex(TNAMES.GRANTS_SUBJECT).where({ uid: uid }).then(found => {
      res.json(found)
      next()
    }).catch(next)
  })

  app.post('/', auth.required, bodyParser, (req, res, next) => {
    const uid = auth.getUid(req)
    Object.assign(req.body, { uid: uid })
    knex(TNAMES.GRANTS_SUBJECT).insert(req.body)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  app.put('/:id([0-9a-zA-Z_-]+)', auth.required, bodyParser, (req, res, next) => {
    const change = _.omit(req.body, ['uid', 'created', 'ico'])
    knex(TNAMES.GRANTS_SUBJECT).where({ uid: req.params.id }).update(change)
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })
}
