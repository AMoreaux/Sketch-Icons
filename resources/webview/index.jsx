import { SketchPicker } from 'react-color'
import React from 'react'
import ReactDOM from 'react-dom'

const handleColorChange = ({ hex }) => console.log(hex)

ReactDOM.render(
  <SketchPicker
    color="#333"
    onChangeComplete={handleColorChange}
  />,
  document.getElementById('container')
)

// const ColorPicker = () => {
//   const handleColorChange = ({hex}) => console.log(hex)
//
//   return (
//     <div style={{position: 'relative'}}>
//       <button>
//         Pick Color
//       </button>
//
//       <div
//         style={{
//           position: 'absolute',
//           top: '100%',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           marginTop: 15,
//         }}
//       >
//         <BlockPicker
//           color="#333"
//           onChangeComplete={handleColorChange}
//         />
//       </div>
//     </div>
//   )
// }

// export default class ColorPicker extends Component {
//   handleColorChange({ hex }){
//     console.log(hex)
//   }
//
//   render({ url }) {
//     return (
//       <div style={{position: 'relative'}}>
//         <button>
//           Pick Color
//         </button>
//
//         <div
//           style={{
//             position: 'absolute',
//             top: '100%',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             marginTop: 15,
//           }}
//         >
//           <BlockPicker
//             color="#333"
//             onChangeComplete={this.handleColorChange}
//           />
//         </div>
//       </div>
//     );
//   }
// }