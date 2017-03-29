import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import App from './App'

const container = document.getElementById('main')

const setContainerHeight = () => {
  const height = `${document.documentElement.clientHeight - 50}px`
  const width = `${document.documentElement.clientWidth - 50}px`
  container.style.height = height
  container.style.width = width

  $('body').height(document.documentElement.clientHeight)
}

setContainerHeight()
window.onresize = () => setContainerHeight()

container.oncontextmenu = () => false

render(<App />, container)
