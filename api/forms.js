
export default (app, express, knex, auth, bodyParser, uredniBackend) => {
  app.post('/forms/:id([a-z_]+)', auth.required, bodyParser, async (req, res, next) => {
    try {
      const doc = req.body
      Object.assign(doc, { typ: req.params.id }, { zadatel: req.user })
      const backendResult = await uredniBackend(doc)
      res.json(backendResult)
    } catch (err) {
      next(err)
    }
  })
}
