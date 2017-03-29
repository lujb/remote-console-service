import _ from 'lodash'
import path from 'path'
import open from 'opn'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'

import ips from './host-ips'
import caches from './log-caches'
import index from 'raw-loader!../../dist/out.html'
import clientjs from 'raw-loader!../../dist/client.bundle.js'
import rc from 'raw-loader!../../dist/remote-console.js'
import testPage from 'raw-loader!./test.html'

const app = express()

let PORT = 8000
let port = PORT
let uid = 1
let logs = {}

const init = () => {
  app.use(cors())

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  app.get('/', (req, res) => res.redirect(`/console?uid=${uid}`))

  app.get('/console', ({ query }, res) => {
    if (!query.uid || parseInt(query.uid) < uid) {
      res.redirect(`/console?uid=${uid}`)
    } else {
      uid = parseInt(query.uid) + 1
      console.log(`web console is accessed by uid:{${query.uid}}`)
      res.send(index)
    }
  })

  app.all('/ping', (req, res) => res.send('pong'))

  app.all('/ips', (req, res) => res.json(ips))

  app.all('/test', (req, res) => res.send(testPage))

  app.all('/remote-console.js', (req, res) => {
    let jscode = rc

    if (req.query.key) {
      jscode = jscode.replace(/@CLIENT-ID@/g, req.query.key)
      console.log(`remote console is connected with specified key:{${req.query.key}}`)
    } else {
      console.log('remote console is connected with generated key')
    }
    jscode = jscode.replace(/@REMOTE-HOST@/g, req.hostname)
    jscode = jscode.replace(/@REMOTE-PORT@/g, port)


    res.send(new Buffer(jscode))
  })

  app.all('/client.bundle.js', (req, res) => res.send(new Buffer(clientjs)))

  app.all('/console/pull', (req, res) => {
    res.json(_.map(caches.getAll(), (cache, id) => ({
      id,
      ua: cache.ua,
      ip: cache.ip,
      hash: cache.hash,
      size: cache.logs.length,
      lastLogAt: cache.logs.length && _.last(cache.logs).timestamp || null
    })))
  })

  app.all('/console/pull/:id', (req, res) => {
    const cache = caches.getCacheByClientId(req.params.id) || []

    res.json(cache.logs)
  })

  app.post('/console/push/:id', (req, res) => {
    let cache = caches.initCacheWithReq(req)
    let [...newLogs] = cache.logs
    if (req.body.savedCache) {
      cache.logs = newLogs.concat(JSON.parse(req.body.savedCache))
    } else {
      newLogs.push(req.body)
      cache.logs = newLogs
    }
    res.send('ok');
  })

  app.get('/console/clear/:id', ({ params, query }, res) => {
    console.log(`clear log of {${params.id}} to {${query.lastKey}} by uid:{${query.uid}}`)

    const cache = caches.getCacheByClientId(params.id)

    if (cache) {
      cache.logs = _.dropWhile(cache.logs, log => log.key !== query.lastKey).slice(1)
    }

    res.send('ok')
  })

  app.get('/console/delete/:id', ({ params, query }, res) => {
    console.log(`delete the cache of {${params.id}} by uid:{${query.uid}}`)

    caches.deleteCacheByClientId(params.id)
    res.send('ok')
  })

  app.get('/caches', (req, res) => res.json(caches.getAll()))

}

const start = (_port=PORT) => {
  port = parseInt(_port)
  init()
  app.listen(port, function (err) {
    console.log(`remote-console backend listening on port ${port} !`)
    console.log(`host ips: ${ips.map(netif => netif.ip).join(', ')}`)
    console.log()

    setTimeout(() => open(`http://${ips[0].ip}:${port}`), 300)
  })
}

export default { start }
