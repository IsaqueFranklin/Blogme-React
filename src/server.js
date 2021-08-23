require('babel-register')
const express = require('express')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const ReactRouter = require('react-router')
const ServerRouter = ReactRouter.ServerRouter
const App = require('./src/App').default
const path = require('path')
const Helmet = require('react-helmet')
const compression = require('compression')
const _ = require('lodash')

const server = express()
server.use(compression())

server.use('/static', express.static(path.join(__dirname, 'public/static')))
server.use((req, res) => {
  const context = ReactRouter.createServerRenderContext()
  const body = ReactDOMServer.renderToString(
    React.createElement(ServerRouter, {
      location: req.url,
      context: context
    },
    React.createElement(App))
  )

  const seo = Helmet.rewind()
  const html = `
      <!doctype html>
      <html ${seo.htmlAttributes.toString()}>
          <head>
              ${seo.title.toString()}
              ${seo.meta.toString()}
              ${seo.link.toString()}
          </head>
          <body>
              <div id='root'>
                <%= body %>
              </div>
              ${seo.script.toString()}
          </body>
      </html>
  `

  const makeTemplate = _.template(html)
  res.write(makeTemplate({body: body}))
  res.end()
})

const PORT = 5050
server.listen(PORT, () => {
  console.log(`Listening http://localhost:5050`)
})