
export default (ctx) => {
  const app = ctx.express()
  const { auth, JSONBodyParser, integrator } = ctx

  async function formPOSTHandler (req, res, next) {
    try {
      const doc = req.body
      Object.assign(doc, { typ: req.params.id }, { zadatel: req.user })
      const backendResult = await integrator(doc)
      res.json(backendResult)
    } catch (err) {
      next(err)
    }
  }
  app.post('/:id([a-z_]+)', auth.required, JSONBodyParser, formPOSTHandler)

  return app
}
