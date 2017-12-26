import utils from '../utils/utils'
import logger from '../utils/logger'
export default {
  initAddMaskOnSelectedArtboards,
  addMask,
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
    if (utils.isArtboardMasked(artboard.object)) removeMask(artboard.object)
    addMask(context, artboard.object, params)
  })
  utils.clearSelection(context)
}

/**
 * @name removeMask
 * @description remove all mask from artboard
 * @param artboard {Object} : MSArtboardGroup
 */
function removeMask(artboard) {
  group = artboard.firstLayer()
  indexes = NSMutableIndexSet.indexSet()
  group.layers().forEach((layer, index) => {
    if (index % 2) {
      indexes.addIndex(index)
    }
  })
  group.removeLayersAtIndexes(indexes)
}

/**
 * @name addMask
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param params {Object}
 */
function addMask(context, currentArtboard, params) {
  let mask
  if (params.color) {
    mask = getMaskSymbolFromLib(context, currentArtboard, params.color, params.colorLib)
  } else if (params.colorPicker) {
    mask = createMaskFromNean(context, currentArtboard, params.colorPicker)
  }
  // if(!utils.isArtboardMasked(currentArtboard)) formatSvg(currentArtboard)
  applyMask(currentArtboard, mask)
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
 * @param symbolInstance
 */
function applyMask(currentArtboard, mask) {
  const currentArtboardSize = currentArtboard.rect()
  mask.setHeightRespectingProportions(currentArtboardSize.size.height)
  mask.setWidthRespectingProportions(currentArtboardSize.size.width)
  mask.setName('🎨 color')
  const wrapperGroup = currentArtboard.firstLayer()
  wrapperGroupFrame = wrapperGroup.frame()
  const size = {
    width: wrapperGroupFrame.width(),
    height:wrapperGroupFrame.height()
  }
  const newContent = []
  wrapperGroup.layers().some((layer) => {
    duplicateMask = mask.duplicate()
    duplicateMaskFrame = duplicateMask.frame()
    duplicateMaskFrame.setWidth(size.width + 2)
    duplicateMaskFrame.setHeight(size.height + 2)
    duplicateMaskFrame.setX(-1)
    duplicateMaskFrame.setY(-1)
    newContent.push(duplicateMask, layer)
  })
  wrapperGroup.removeAllLayers()
  newContent.reverse().forEach((layer, index) => {
    wrapperGroup.addLayer(layer)
    if (!index % 2 && !layer.hasClippingMask()) MSMaskWithShape.toggleMaskForSingleShape(layer)
  })
}