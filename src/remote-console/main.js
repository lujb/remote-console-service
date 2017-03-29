import keygen from './keygen'
import sendArgs from './send-args'

const CLIENTID = '@CLIENT-ID@'
const _CLIENTID = ['@CLIENT', 'ID@']

// install global components
window.__remote_console_cache__ = window.__remote_console_cache__ || []
if (CLIENTID === _CLIENTID.join('-')) {
  window.__remote_console_client_ID__ =  keygen()
} else {
  window.__remote_console_client_ID__ =  CLIENTID
}

// connect to remote console service
const levels = ['log', 'info', 'warn', 'error']
levels.forEach(level => window.console[level] = sendArgs(level))
