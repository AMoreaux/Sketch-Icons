import { SketchPicker } from 'react-color'
import React from 'react'
import ReactDOM from 'react-dom'

// const handleColorChange = ({hex}) => console.log(hex)

const handleColorChange =  ({rgb}) => {
  const previousHash = (window.location.hash.split('?')[1] ? window.location.hash.split('?')[0] : window.location.hash)
  window.location.hash = previousHash + '?color=' + encodeURIComponent(JSON.stringify(rgb))
}

ReactDOM.render(
  <SketchPicker
    color="#333"
    onChangeComplete={handleColorChange}
  />,
  document.getElementById('container')
)