import $ from 'jquery'
import React from 'react'
import moment from 'moment'

import emitter from './emitter'
import Console from './Console'
import ToolBar from './ToolBar'
import uid from './uid'
import styles from './app.css'

moment.locale(window.navigator.language)

const timediff = time => {
  if (time) {
    return moment(parseInt(time)).fromNow()
  } else {
    return 'None'
  }
}

const List = ({ data, onClick }) => (
  <div className={styles.listWrapper}>
    {
      do {
        if (data.length > 0) {
          data.map(console => (
            <div key={console.id}
              className={styles.console}
              onClick={() => { onClick(console.id) }}
            >
              <div>{console.hash}-<span style={{color:'grey'}}>{console.id}</span> / {console.size} / {timediff(console.lastLogAt)}</div>
            </div>
          ))
        } else {
          'No console available'
        }
      }
    }
  </div>
)

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = { consoles: [] }
    this.pulling()

    emitter.on('console-close', ::this.closeConsole)
    emitter.on('console-delete', ::this.deleteConsole)
  }

  closeConsole() {
    this.setState({ id: null })
  }

  deleteConsole() {
    const { id } = this.state

    if (id) {
      $.get(`/console/delete/${id}`, { uid }, () => {
        this.setState({ id: null })
      })
    }
  }

  pulling() {
    const pull = () => {
      if (!this.state.id) {
        $.get('/console/pull', consoles => {
          this.setState({ consoles })
          setTimeout(pull, 300)
        })
      } else {
        setTimeout(pull, 300)
      }
    }
    pull()
  }

  openConsole(id) {
    this.setState({ id })
  }

  render () {
    let { id, consoles } = this.state
    return (
      <div className={styles.app}>
        {
          do {
            if (id) {
              (
                <div className={styles.consoleWrapper}>
                  <Console consoleId={id}/>
                  <ToolBar />
                </div>
              )
            } else {
              (
                <List data={consoles} onClick={::this.openConsole}/>
              )
            }
          }
        }
      </div>
    )
  }
}

export default App
