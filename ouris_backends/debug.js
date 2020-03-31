const docs = {}

function init (app) {
  app.get('/debugbackend', (req, res, next) => {
    res.json(docs)
  })
}

export function send (doc) {
  const now = new Date()
  docs[now.toISOString()] = doc
}

export default { init, send }
