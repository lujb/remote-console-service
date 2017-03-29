import $ from 'jquery'
import _ from 'lodash'
import React from 'react'
import moment from 'moment'

import emitter from '../emitter'
import constants from '../constants'
import uid from '../uid'
import styles from './style.css'

const { parse, stringify } = JSON

const isExpandable = (type, string) => {
  return (
    (type === 'object' || type === 'array')
    &&
    string.length > constants.EXPAND_VALUE_MIN_SIZE
  )
}

const expand = (event, string, arg) => {
  const jqnode = $(event.target)
  if (jqnode.attr('data-expand') === 'true') {
    jqnode.attr('data-expand', 'false')
    jqnode.next().text(string)
  } else {
    jqnode.attr('data-expand', 'true')
    jqnode.next().html(`<pre>${stringify(arg, null, '   ')}</pre>`)
  }
}

const parseArg = arg => {
  let type = typeof arg
  let string = stringify(arg)

  if (type === 'object') {
    if (string === 'null') {
      type = 'null'
    } else if (_.isArray(arg)) {
      type = 'array'
    }
  }
  if (type === 'object' && string === 'null') {
    type = 'null'
  }
  if (type === 'string') { // remove the quotes
    string = string.substr(1, string.length - 2)
  }

  return { type, string }
}

class Console extends React.Component {
  constructor (props) {
    super(props)

    emitter.on('console-clear', ::this.onClear)

    this.state = { logs: [] }
    this.pulling()
  }

  onClear() {
    const last = _.last(this.state.logs)

    if (last) {
      $.get(`/console/clear/${this.props.consoleId}`, { uid, lastKey:  last.key})
      this.setState({ logs: [] })
    }
  }

  pulling() {
    const pull = () => {
      $.get(`/console/pull/${this.props.consoleId}`, logs => {
        if (this) {
          this.setState({ logs })
          setTimeout(pull, 300)
        }
      })
    }

    pull()
  }

  render () {
    return (
      <div className={styles.console}>
        {
          _.map(this.state.logs, log => {
            return (
              <div key={log.key} className={styles.line}>
                <div className={styles[`gutter-${log.level}`]}>
                  { moment(parseInt(log.timestamp)).format('HH:mm:ss.SSS') }
                </div>
                <div className={styles.content}>
                  {
                    JSON.parse(log.args).map((arg, index) => {
                      const { type, string } = parseArg(arg)
                      return (
                        <div className={styles.item} key={index}>
                          <div className={styles.space}></div>
                          {
                            do {
                              if (isExpandable(type, string)) {
                                (<div className={styles['object-indicator']}
                                   onClick = { e => expand(e, string, arg) }
                                 >
                                   &lt;{type}&gt;
                                 </div>)
                              } else {
                                null
                              }
                            }
                          }
                          <div className={styles[type]}>{string}</div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Console
