import maskProvider from '../providers/mask'

export default {
  switchToV4
}

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
}