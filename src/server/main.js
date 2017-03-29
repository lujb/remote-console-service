import _ from 'lodash'
import minimist from 'minimist'

import app from './app'

let VERSION = '1.0.0'
const DESC = 'A local service for inspecting remote console logs'

const argv = minimist(process.argv.slice(2))

const enable = (...args) => _.some(args, arg => argv[arg] || argv._.includes(arg))

if (enable('s', 'start')) {
  if (enable('q', 'quiet')) {
    console.log = () => {}
  }
  app.start(argv.p || argv.port)
} else if (enable('v', 'version')) {
  console.log(VERSION)
} else {
  console.log(
`${DESC}

  -h, --help
    print help document
  -v, --version
    print version information
  -s, --start
    start backend service
  -p, --port [int]
    specify the port number of backend service
  -q, --quiet
    Shutdown console logs
`
  )
}
