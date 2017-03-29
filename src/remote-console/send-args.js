import $ from 'jquery'
import stringify from 'json-stringify-safe'

import keygen from './keygen'

const pushurl = 'http://@REMOTE-HOST@:@REMOTE-PORT@/console/push'
const THREHOLD = 256

const sendArgs = level => (...args) => {
  let url = `${pushurl}/${__remote_console_client_ID__}`
  let method = 'POST'
  let data = {
    key: keygen(),
    timestamp: Date.now(),
    args: stringify(args),
    level
  }

  $.post({
    url, method, data,
    success: () => {
      if (__remote_console_cache__.length > 0) {
        let savedCache = JSON.stringify(__remote_console_cache__)
        __remote_console_cache__ = []

        $.post({
          url, method,
          data: { savedCache },
          error: () => {
            __remote_console_cache__ = __remote_console_cache__.concat(JSON.parse(savedCache))
          }
        })
      }
    },
    error: (xhr, status, error) => {
      if (__remote_console_cache__.length < THREHOLD) {
        __remote_console_cache__.push(data)
      }
    }
  })
}

export default sendArgs
