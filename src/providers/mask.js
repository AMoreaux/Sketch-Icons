import utils from '../utils/utils'
import svgProvider from './svg'
import librariesProvider from './libraries'
import logger from '../utils/logger'

export default {
  initAddMaskOnSelectedArtboards,
  addMask,
  removeMask,
  applyMask
}

/**
 * @name initAddMaskOnSelectedArtboards
 * @description main function to add mask on selected artboards
 * @param context {Object}
 * @param params {Object}
 * @param artboards {Array} : MSArtboardGroup
 */
function initAddMaskOnSelectedArtboards(context, params, artboards) {
  artboards.some(function (artboard) {
    try {
      if (utils.iconHasColor(artboard.object) && !utils.svgHasStroke(artboard.object)) removeMask(artboard.object)
      addMask(context, artboard.object, params)
    } catch (e) {
      logger.error(e)
    }
  })
  utils.clearSelection(context)
}

/**
 * @name applyColor
 * @description apply border color on svg with stroke
 * @param artboard
 * @param color
 */
function applyColor(artboard, color) {
  artboard.children().forEach((layer) => {
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
 * @param artboard {Object} : MSArtboardGroup
 */
function removeMask(artboard) {
  const iconLayer = artboard.firstLayer()
  if (iconLayer.hasClippingMask()) {
    iconLayer.hasClippingMask = false;
    iconLayer.clippingMaskMode = 1
    artboard.lastLayer().removeFromParent()
  }
}

/**
 * @name addMask
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param params {Object}
 */
async function addMask(context, currentArtboard, params) {
  let mask

  registerMask(context, currentArtboard, params)


  if (utils.svgHasStroke(currentArtboard)) {
    const color = (params.colorPicker) ? params.colorPicker : librariesProvider.getColorFromSymbol(params.color).color
    return applyColor(currentArtboard, color);
  }

  if (utils.iconHasColor(currentArtboard)) {
    removeMask(currentArtboard)
  } else {
    const svgData = utils.layerToSvg(currentArtboard.firstLayer())
    await svgProvider.replaceSVG(context, currentArtboard, svgData, true, false)
  }

  if (params.color) {
    mask = getMaskSymbolFromLib(context, currentArtboard, params.color, params.colorLib)
  } else if (params.colorPicker) {
    mask = createMaskFromNean(context, currentArtboard, params.colorPicker)
  }

  return applyMask(currentArtboard, mask)
}

function registerMask(context, currentArtboard, params){
  if (params.color) {
    context.command.setValue_forKey_onLayer(params.colorLib, "colorLib", currentArtboard)
    context.command.setValue_forKey_onLayer(params.color, "color", currentArtboard)
  } else if (params.colorPicker) {
    context.command.setValue_forKey_onLayer(params.color, "colorPicker", currentArtboard)
  }
}


/**
 * @name createMaskFromNean
 * @param context
 * @param currentArtboard
 * @param color
 * @return {Object} : MSShapeGroup
 */
function createMaskFromNean(context, currentArtboard, color) {
  const currentArtboardSize = currentArtboard.rect()

  const mask = MSShapeGroup.shapeWithRect({
    origin: {x: 0, y: 0},
    size: {width: currentArtboardSize.size.width, height: currentArtboardSize.size.height}
  })

  const fill = mask.style().addStylePartOfType(0);
  fill.color = color;

  return mask
}

/**
 * @name createMask
 * @description add mask from symbol master colors library to one artboard
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param colorSymbolMaster {Object}
 * @param colorLibrary {Object} : MSAssetLibrary
 * @return symbol {Object} : MSSymbolInstance
 */
function getMaskSymbolFromLib(context, currentArtboard, colorSymbolMaster, colorLibrary) {
  utils.clearSelection(context)
  const librairiesController = AppController.sharedInstance().librariesController()
  const symbolMaster = (colorLibrary) ? librairiesController.importForeignSymbol_fromLibrary_intoDocument(colorSymbolMaster, colorLibrary, context.document.documentData()).symbolMaster() : colorSymbolMaster
  return symbolMaster.newSymbolInstance();
}

/**
 * @name applyMask
 * @param currentArtboard
 * @param mask
 */
function applyMask(currentArtboard, mask) {
  const currentArtboardSize = currentArtboard.rect()
  mask.setHeightRespectingProportions(currentArtboardSize.size.height)
  mask.setWidthRespectingProportions(currentArtboardSize.size.width)
  mask.setName('🎨 color')
  currentArtboard.addLayers([mask])
  const iconLayer = currentArtboard.firstLayer()
  iconLayer.hasClippingMask = true
  iconLayer.clippingMaskMode = 0
}