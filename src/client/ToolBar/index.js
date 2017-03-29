import React from 'react'

import emitter from '../emitter'
import styles from './style.css'

const clickHandler = event => () => emitter.emit(event)

const ToolBar = () => {
  return (
    <div className={styles.toolbar}>
      <div onClick={ clickHandler('console-clear') }>Clear</div>
      <div onClick={ clickHandler('console-delete') }>Delete</div>
      <div onClick={ clickHandler('console-close') }>Close</div>
    </div>
  )
}

export default ToolBar
