import maskProvider from '../providers/mask'

export default {
  switchToV4
}

// function isV3(context, rootObject) {
//   // context.document.artboards().forEach(function (rootObject) {
//     const hasMaskV4 = maskProvider.getMaskPropertiesFromArtboard(context, rootObject)
//     const maskLayer = rootObject.firstLayer()
//     if (!hasMaskV4.color && !hasMaskV4.colorLib && !hasMaskV4.colorPicker && maskLayer && maskLayer.hasClippingMask()) {
//       switchToV4(context, rootObject)
//     }
//   // })
// }

function switchToV4(context, rootObject) {
  const mask = rootObject.lastLayer()
  const params = {color: null, colorLib: null, colorPicker: null}
  if (String(mask.class()) === 'MSSymbolInstance') {
    const color = mask.symbolMaster()
    const foreign = color.foreignSymbol()
    params.color = color
    if (foreign) {
      params.color = String(foreign.originalMaster().symbolID())
      params.colorLib = foreign
    }
  } else {
    params.colorPicker = mask.style().fills()[0].color()
  }

  maskProvider.registerMask(context, rootObject, params)

  // const test = maskProvider.getMaskPropertiesFromArtboard(context, rootObject)
  //
  // console.log('>>>>>>>>>>>', test.colorLib);
  // console.log('>>>>>>>>>>>', test.color);
  // console.log('>>>>>>>>>>>', test.colorPicker);
}