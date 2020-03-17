import initSubjectInfoRoutes from './subjectinfo'
import initCallRoutes from './call'
import initProjectRoutes from './project'

export default (app, express, knex, auth, bodyParser) => {
  //
  let appmodule = express()
  initSubjectInfoRoutes(appmodule, knex, auth, bodyParser)
  app.use('/subjinfo', appmodule)

  appmodule = express()
  initCallRoutes(appmodule, knex, auth, bodyParser)
  app.use('/call', appmodule)

  appmodule = express()
  initProjectRoutes(appmodule, knex, auth, bodyParser)
  app.use('/project', appmodule)
}
