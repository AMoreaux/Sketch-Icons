import utils from '../utils/utils'
import svgProvider from './svg'
import librariesProvider from './libraries'
import sharedStyles from './sharedStyles'
import switchVersion from '../utils/switchV3ToV4';
import settingsProvider from "./settings";

export default {
  initAddMaskOnSelectedArtboards,
  addColor,
  removeColor,
  getMaskPropertiesFromArtboard,
  registerColor
}

/**
 * @name initAddMaskOnSelectedArtboards
 * @description main function to add mask on selected artboards
 * @param context {Object}
 * @param params {Object}
 * @param rootObjects {Array} : MSArtboardGroup
 */
function initAddMaskOnSelectedArtboards(context, params, rootObjects) {
  const settingsParams = settingsProvider.getSettings(context, 'default');
  rootObjects.forEach(async (rootObject) => {
    try {
      if (utils.svgHasStroke(rootObject.object) && settingsParams.convertStroke.data === '1') svgProvider.convertStrokeToFill(rootObject.object)
      // if (utils.hasMask(rootObject.object) && !utils.svgHasStroke(rootObject.object)) removeMask(context, rootObject.object);
      await addColor(context, rootObject.object, params)
    } catch (e) {
      console.log('>>>>>>>>>>>', e);
    }
  })
  utils.clearSelection(context)
}

/**
 * @name addColor
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param rootObject {Object} : MSArtboardGroup && MSSymbolMaster
 * @param params {Object}
 */
function addColor(context, rootObject, params) {

  if (String(rootObject.firstLayer().class()) === 'MSBitMapLayer') return

  removeColor(context, rootObject);

  if (params.colorSource === 'sharedStyle') {
    svgProvider.cleanSvg(rootObject)
    sharedStyles.applySharedStyle(context, rootObject, params);
  } else if (utils.svgHasStroke(rootObject)) {
    applyColor(rootObject, params);
  } else {
    svgProvider.cleanSvg(rootObject)
    applyMask(context, rootObject, params)
  }

  return registerColor(context, rootObject, params)
}

function removeColor(context, rootObject) {
  if (utils.hasMask(rootObject) && !utils.svgHasStroke(rootObject)) removeMask(context, rootObject);
  if (utils.hasSharedStyle(rootObject)) removeSharedStyle(context, rootObject);
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
    if (layer.usedStyle().hasEnabledBorder()) {
      const style = layer.usedStyle()
      style.enabledBorders().forEach((border) => border.color = color)
    }
  })
}

function removeSharedStyle(context, rootObject){
  const style = rootObject.firstLayer().style();
  const fills = style.fills();
  const fillColor = (fills.count() > 0) ? style.fills()[0].color() : MSColor.blackColor();
  style.removeAllStyleFills();
  style.addStylePartOfType(0).color = fillColor;
  rootObject.firstLayer().sharedStyle = null;
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
  context.command.setValue_forKey_onLayer(null, "source", rootObject)
  context.command.setValue_forKey_onLayer(null, "colorPicker", rootObject)

  if (utils.svgHasStroke(rootObject)) {
    return applyColor(rootObject, { colorPicker: MSImmutableColor.blackColor() })
  }

  const iconLayer = rootObject.firstLayer();

  if (rootObject.layers().count() > 1 && iconLayer.hasClippingMask()) {
    iconLayer.hasClippingMask = false;
    iconLayer.clippingMaskMode = 1;
    const style = rootObject.firstLayer().style();
    const fills = style.fills();
    const fillColor = (fills.count() > 0) ? style.fills()[0].color() : MSColor.blackColor();
    style.removeAllStyleFills();
    style.addStylePartOfType(0).color = fillColor;
    rootObject.lastLayer().removeFromParent()
  }
}

/**
 * @name registerColor
 * @description register properties of mask in artboard metadata
 * @param context
 * @param rootObject
 * @param params
 */
function registerColor(context, rootObject, params) {
  if (params.color) {
    const libraryId = (params.colorLib) ? params.colorLib.libraryID() : null
    const colorId = (params.colorSource === 'sharedStyle') ? params.color.objectID() : params.color.symbolID()
    context.command.setValue_forKey_onLayer(libraryId, "colorLib", rootObject)
    context.command.setValue_forKey_onLayer(colorId, "color", rootObject)
    context.command.setValue_forKey_onLayer(params.colorSource, "source", rootObject)
    context.command.setValue_forKey_onLayer(null, "colorPicker", rootObject)
  } else if (params.colorPicker) {
    context.command.setValue_forKey_onLayer(utils.convertMSColorToString(params.colorPicker), "colorPicker", rootObject)
    context.command.setValue_forKey_onLayer(null, "colorLib", rootObject)
    context.command.setValue_forKey_onLayer(null, "source", rootObject)
    context.command.setValue_forKey_onLayer(null, "color", rootObject)
  }
}

function getMaskPropertiesFromArtboard(context, rootObject) {


  let params = getColorParams(context, rootObject);

  const maskLayer = rootObject.firstLayer()
  if (!params.colorLibraryId && !params.colorSymbolId && !params.colorString && maskLayer && maskLayer.hasClippingMask()) {
    switchVersion.switchToV4(context, rootObject)
    params = getColorParams(context, rootObject)
  }

  if (!params.colorLibraryId && params.colorSymbolId) {
    params.colorSymbol = librariesProvider.getSymbolFromDocument(context.document.documentData(), params.colorSymbolId)
  } else if (params.colorLibraryId) {
    params.colorLibrary = librariesProvider.getLibById(params.colorLibraryId)
    librariesProvider.loadLibrary(params.colorLibrary)
    params.colorSymbol = librariesProvider.getSymbolFromDocument(params.colorLibrary.document(), params.colorSymbolId)
  }

  params.colorPicker = (params.colorString) ? utils.convertStringToMSColor(params.colorString) : null

  const result = {
    colorLib: (params.colorLibraryId) ? params.colorLibrary : null,
    color: (params.colorSymbolId) ? params.colorSymbol : null,
    colorPicker: params.colorPicker
  }

  return (!result.colorLib && !result.color && !result.colorPicker) ? {} : result
}

/**
 * @name getColorParams
 * @param context
 * @param rootObject
 * @returns {{colorLibraryId: *, colorSymbolId: *, colorString: *}}
 */
function getColorParams(context, rootObject) {
  return {
    colorLibraryId: context.command.valueForKey_onLayer("colorLib", rootObject),
    colorSymbolId: context.command.valueForKey_onLayer("color", rootObject),
    colorString: context.command.valueForKey_onLayer("colorPicker", rootObject)
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
    origin: { x: 0, y: 0 },
    size: { width: currentRootObjectSize.size.width, height: currentRootObjectSize.size.height }
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
  // const symbolMaster = (colorLibrary) ? librairiesController.importForeignSymbol_fromLibrary_intoDocument(colorSymbolMaster, colorLibrary, context.document.documentData()).symbolMaster() : colorSymbolMaster

  let importedSymbol;
  if (MSApplicationMetadata.metadata().appVersion >= 50) {
    const shareableObjectReference = MSShareableObjectReference.referenceForShareableObject_inLibrary(colorSymbolMaster, colorLibrary);
    importedSymbol = librairiesController.importShareableObjectReference_intoDocument(shareableObjectReference, context.document.documentData());
  } else {
    importedSymbol = librairiesController.importForeignSymbol_fromLibrary_intoDocument_(colorSymbolMaster, colorLibrary, context.document.documentData());
  }
  const symbolMaster = (colorLibrary) ? importedSymbol.symbolMaster() : colorSymbolMaster;
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
  rootObject.firstLayer().style().disableAllFills()
  rootObject.addLayers([mask])
  const iconLayer = rootObject.firstLayer()
  iconLayer.hasClippingMask = true
  iconLayer.clippingMaskMode = 0
}
