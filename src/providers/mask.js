import utils from '../utils/utils'
import svgProvider from './svg'
import librariesProvider from './libraries'
import logger from '../utils/logger'

export default {
  initAddMaskOnSelectedArtboards,
  addMask,
  removeMask,
  applyMask,
  applyColor,
  getMaskPropertiesFromArtboard
}

/**
 * @name initAddMaskOnSelectedArtboards
 * @description main function to add mask on selected artboards
 * @param context {Object}
 * @param params {Object}
 * @param rootObjects {Array} : MSArtboardGroup
 */
function initAddMaskOnSelectedArtboards(context, params, rootObjects) {
  rootObjects.forEach(async (rootObject) => {
    if (utils.hasMask(rootObject.object) && !utils.svgHasStroke(rootObject.object)) removeMask(context, rootObject.object)
    await addMask(context, rootObject.object, params)
    registerMask(context, rootObject.object, params)
  })
  utils.clearSelection(context)
}

/**
 * @name applyColor
 * @description apply border color on svg with stroke
 * @param rootObject
 * @param params
 */
function applyColor(rootObject, params) {
  const color = (params.colorPicker) ? params.colorPicker : librariesProvider.getColorFromSymbol(params.color).color
  rootObject.children().forEach((layer) => {
    if (layer.styledLayer().style().hasEnabledBorder()) {
      const style = layer.styledLayer().style()
      style.enabledBorders().forEach((border) => {
        border.color = color
      })
    }
  })
}

/**
 * @name removeMask
 * @description remove all mask from artboard
 * @param context
 * @param rootObject {Object} : MSArtboardGroup
 */
function removeMask(context, rootObject) {

  context.command.setValue_forKey_onLayer(null, "colorLib", rootObject)
  context.command.setValue_forKey_onLayer(null, "color", rootObject)
  context.command.setValue_forKey_onLayer(null, "colorPicker", rootObject)

  if(utils.svgHasStroke(rootObject)){
    return applyColor(rootObject, {colorPicker: MSImmutableColor.blackColor()})
  }

  const iconLayer = rootObject.firstLayer()

  if (iconLayer.hasClippingMask()) {
    iconLayer.hasClippingMask = false;
    iconLayer.clippingMaskMode = 1
    rootObject.lastLayer().removeFromParent()
  }
}

/**
 * @name addMask
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param rootObject {Object} : MSArtboardGroup && MSSymbolMaster
 * @param params {Object}
 */
async function addMask(context, rootObject, params) {

  if (utils.svgHasStroke(rootObject)) {
    return applyColor(rootObject, params);
  }

  if (utils.hasMask(rootObject)) {
    removeMask(context, rootObject)
  } else {
    const svgData = utils.layerToSvg(rootObject.firstLayer())
    await svgProvider.replaceSVG(context, rootObject, svgData, true, false)
  }

  return applyMask(context, rootObject, params)
}


/**
 * @name registerMask
 * @description register properties of mask in artboard metadata
 * @param context
 * @param rootObject
 * @param params
 */
function registerMask(context, rootObject, params) {
  if (params.color) {
    const libraryId = (params.colorLib) ? params.colorLib.libraryID() : null
    context.command.setValue_forKey_onLayer(libraryId, "colorLib", rootObject)
    context.command.setValue_forKey_onLayer(params.color.symbolID(), "color", rootObject)
    context.command.setValue_forKey_onLayer(null, "colorPicker", rootObject)
  } else if (params.colorPicker) {
    context.command.setValue_forKey_onLayer(utils.convertMSColorToString(params.colorPicker), "colorPicker", rootObject)
    context.command.setValue_forKey_onLayer(null, "colorLib", rootObject)
    context.command.setValue_forKey_onLayer(null, "color", rootObject)
  }
}

function getMaskPropertiesFromArtboard(context, rootObject) {
  let colorSymbol, colorLibrary, colorPicker

  const colorLibraryId = context.command.valueForKey_onLayer("colorLib", rootObject)
  const colorSymbolId = context.command.valueForKey_onLayer("color", rootObject)
  const colorString = context.command.valueForKey_onLayer("colorPicker", rootObject)

  if (!colorLibraryId && colorSymbolId) {
    colorSymbol = librariesProvider.getSymbolFromDocument(context.document.documentData(), colorSymbolId)
  } else if (colorLibraryId) {
    colorLibrary = librariesProvider.getLibById(colorLibraryId)
    librariesProvider.loadLibrary(colorLibrary)
    colorSymbol = librariesProvider.getSymbolFromDocument(colorLibrary.document(), colorSymbolId)
  }

  colorPicker = (colorString) ? utils.convertStringToMSColor(colorString) : null

  return {
    colorLib: (colorLibraryId) ? colorLibrary : null,
    color: (colorSymbolId) ? colorSymbol : null,
    colorPicker: colorPicker
  }
}


/**
 * @name createMaskFromNean
 * @param context
 * @param rootObject
 * @param color
 * @return {Object} : MSShapeGroup
 */
function createMaskFromNean(context, rootObject, color) {
  const currentRootObjectSize = rootObject.rect()

  const mask = MSShapeGroup.shapeWithRect({
    origin: {x: 0, y: 0},
    size: {width: currentRootObjectSize.size.width, height: currentRootObjectSize.size.height}
  })

  const fill = mask.style().addStylePartOfType(0);
  fill.color = color;

  return mask
}

/**
 * @name createMask
 * @description add mask from symbol master colors library to one artboard
 * @param context {Object}
 * @param colorSymbolMaster {Object}
 * @param colorLibrary {Object} : MSAssetLibrary
 * @return symbol {Object} : MSSymbolInstance
 */
function getMaskSymbolFromLib(context, colorSymbolMaster, colorLibrary) {
  utils.clearSelection(context)
  const librairiesController = AppController.sharedInstance().librariesController()
  const symbolMaster = (colorLibrary) ? librairiesController.importForeignSymbol_fromLibrary_intoDocument(colorSymbolMaster, colorLibrary, context.document.documentData()).symbolMaster() : colorSymbolMaster
  return symbolMaster.newSymbolInstance();
}

/**
 * @name applyMask
 * @param context
 * @param rootObject {Object} : MSArtboardGroup && MSSymbolMaster
 * @param params
 */
function applyMask(context, rootObject, params) {

  let mask;

  if (params.color) {
    mask = getMaskSymbolFromLib(context, params.color, params.colorLib)
  } else if (params.colorPicker) {
    mask = createMaskFromNean(context, rootObject, params.colorPicker)
  }

  const currentArtboardSize = rootObject.rect()
  mask.setHeightRespectingProportions(currentArtboardSize.size.height)
  mask.setWidthRespectingProportions(currentArtboardSize.size.width)
  mask.setName('🎨 color')
  rootObject.addLayers([mask])
  const iconLayer = rootObject.firstLayer()
  iconLayer.hasClippingMask = true
  iconLayer.clippingMaskMode = 0
}