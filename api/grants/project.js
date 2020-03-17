import { whereFilter } from 'knex-filter-loopback'
import { TNAMES } from './consts'
import _ from 'underscore'

export default (app, knex, auth, bodyParser) => {
  //
  app.get('/', (req, res, next) => {
    knex(TNAMES.GRANTS_PROJECT).where(whereFilter(req.query)).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  const noneditables = ['created', 'state', 'ico', 'call_id', 'id']

  async function createProject (req) {
    const uid = auth.getUid(req)
    const subjs = await knex(TNAMES.GRANTS_SUBJECT).where({ uid: uid })
    if (subjs.length === 0) throw new Error('subject not found')
    const subj = subjs[0]
    const call = await knex(TNAMES.GRANTS_CALL).where({ id: req.params.id })
    if (call.length === 0) throw new Error(404)
    const now = new Date()
    if (now > call[0].submission_end) throw new Error('too late')
    req.body = _.omit(req.body, noneditables)
    Object.assign(req.body, { ico: subj.ico, call_id: req.params.id })
    const prj = await knex(TNAMES.GRANTS_PROJECT).returning('id').insert(req.body)
    return prj
  }

  app.post('/:id([0-9]+)', auth.required, bodyParser, (req, res, next) => {
    createProject(req).then(createdid => (res.json(createdid))).catch(next)
  })

  async function updateProject (req) {
    const getProject = knex(TNAMES.GRANTS_PROJECT).where({ id: req.params.id })
    const proj = await getProject
    if (!proj.length) throw new Error(404)
    const call = await knex(TNAMES.GRANTS_CALL).where({ id: proj[0].call_id })
    if (!call.length) throw new Error(404)
    const now = new Date()
    if (now > call[0].submission_end) throw new Error('too late')
    req.body = _.pick(req.body, editables)
    const op = await getProject.update(req.body)
    return op
  }

  app.put('/:id([0-9]+)', auth.required, bodyParser, (req, res, next) => {
    updateProject(req).then(val => (res.json(val))).catch(next)
  })
}
