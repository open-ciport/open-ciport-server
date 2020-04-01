import initSubjectInfoRoutes from './subjectinfo'
import initCallRoutes from './call'
import initProjectRoutes from './project'

export default (ctx) => {
  const app = ctx.express()

  let appmodule = ctx.express()
  initSubjectInfoRoutes(appmodule, ctx.db, ctx.auth, ctx.JSONBodyParser)
  app.use('/subjinfo', appmodule)

  appmodule = ctx.express()
  initCallRoutes(appmodule, ctx.db, ctx.auth, ctx.JSONBodyParser)
  app.use('/call', appmodule)

  appmodule = ctx.express()
  initProjectRoutes(appmodule, ctx.db, ctx.auth, ctx.JSONBodyParser)
  app.use('/project', appmodule)

  return app
}
