import utils from '../utils/utils'
import logger from '../utils/logger'
import librairiesProvider from './libraries'

export default {
  initAddMaskOnSelectedArtboards,
  addMask,
  createMask,
  formatSvg,
  dedupeLayers,
  getMaskProperties
}

/**
 * @name initAddMaskOnSelectedArtboards
 * @description main function to add mask on selected artboards
 * @param context {Object}
 * @param params {Object}
 * @param artboards {Array} : MSArtboardGroup
 */
function initAddMaskOnSelectedArtboards(context, params, artboards) {
  artboards.forEach(function (artboard) {
    addMask(context, artboard.object, params)
  })
}

/**
 * @name addMask
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param params {Object}
 */
function addMask(context, currentArtboard, params) {
  formatSvg(currentArtboard)
  dedupeLayers(currentArtboard)
  createMask(context, currentArtboard, params.color, params.colorLib)
}

/**
 * @name createMask
 * @description add mask from symbol master colors library to one artboard
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param colorSymbolMaster {Object}
 * @param colorLibrary {Object} : MSAssetLibrary
 */
function createMask(context, currentArtboard, colorSymbolMaster, colorLibrary) {
  utils.clearSelection(context)
  librairiesController = AppController.sharedInstance().librariesController()
  symbolMaster = librairiesController.importForeignSymbol_fromLibrary_intoDocument(colorSymbolMaster, colorLibrary, context.document.documentData())

  symbolInstance = symbolMaster.symbolMaster().newSymbolInstance();

  const currentArtboardSize = currentArtboard.rect()
  symbolInstance.setHeightRespectingProportions(currentArtboardSize.size.height)
  symbolInstance.setWidthRespectingProportions(currentArtboardSize.size.width)
  symbolInstance.setName('🎨 color')
  currentArtboard.addLayer(symbolInstance);
  currentArtboard.layers()[0].prepareAsMask()
}

/**
 * @name formatSvg
 * @description ungroup all layers in an artboard
 * @param currentArtboard {Object} : MSArtboardGroup
 */
function formatSvg(currentArtboard) {
  currentArtboard.children().forEach(function (layer) {
    const layerClass = String(layer.class())
    if (layerClass === "MSLayerGroup" || layerClass === "MSShapeGroup") {
      layer.ungroup()
    }
  })
}

/**
 * @name dedupeLayers
 * @description get all shapes and merge them in one shape group
 * @param currentArtboard {Object} : MSArtboardGroup
 */
function dedupeLayers(currentArtboard) {
  const container = MSShapeGroup.shapeWithRect(null)
  container.setName('container-random-string-9246392')
  currentArtboard.addLayer(container)
  const reg = new RegExp("Shape");

  currentArtboard.children().forEach(function (layer) {

    const layerClass = String(layer.class())

    if (layerClass === 'MSRectangleShape' && String(layer.name()) === 'container-random-string-9246392') {
      return layer.removeFromParent()
    }

    if (reg.test(layerClass) && layerClass !== 'MSShapeGroup') {
      layer.moveToLayer_beforeLayer(container, layer);
    }
  })
  container.resizeToFitChildrenWithOption(0)
}

/**
 * @name getMaskProperties
 * @description get properties of mask by artboard
 * @param artboard {Object} : MSArtboardGroup
 * @returns {Object}
 */
function getMaskProperties(artboard) {
  const layers = artboard.layers()

  if (layers.length <= 1 || !layers[1].isMasked()) {
    return {
      'color': null,
      'colorLib': null
    }
  }

  const color = layers[1].symbolMaster()
  const colorLib = librairiesProvider.getLibById(color.foreignSymbol().libraryID())

  return {
    'color': color,
    'colorLib': colorLib
  }
}