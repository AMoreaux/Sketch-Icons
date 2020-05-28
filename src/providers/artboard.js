import utils from '../utils/utils';
import logger from '../utils/logger';
import importerProvider from '../providers/svg';
import maskProvider from './mask';
import settingsProvider from './settings';
// import dom from 'sketch'

// import { Text } from 'sketch'

export default {
  initImport,
  initImportIcons,
  getPaddingAndSize,
  initOrganizeIcons
};

const artboardParams = {
  iconsByLine: 10,
  sizeBetweenPreset: 200,
  titleFontSize: 32
};

const workingRootObject = [];

/**
 * @name createArtboard
 * @description set position and size and create artboard
 * @param context {Object} :
 * @param index {Number}
 * @param name {String}
 * @param params {Object}
 * @returns {Object} : MSArtboardGroup
 */
function createArtboard(context, index, name, params) {

  const marginBetweenRootObject = settingsProvider.getSettings(context, 'default').marginBetweenRootObject;
  const space = utils.getSizeBetweenIcon(artboardParams.width, marginBetweenRootObject.data)

  if (index === 0) {
    artboardParams.y = params.yOrigin;
    artboardParams.x = params.xOrigin || 0;
  }
  else if (index % artboardParams.iconsByLine === 0) {
    artboardParams.y += space;
    artboardParams.x = params.xOrigin || 0;
  } else {
    artboardParams.x += space;
  }

  const rootObject = MSArtboardGroup.new();
  rootObject.setName(`${params.prefix}${name}`);

  setPositionRootObject(rootObject, artboardParams)

  context.document.currentPage().addLayers([rootObject]);

  return params.convertSymbol
    ? MSSymbolMaster.convertArtboardToSymbol(rootObject)
    : rootObject;
}

/**
 * @name setPositionRootObject
 * @param rootObject
 * @param mensuration
 */
function setPositionRootObject(rootObject, mensuration) {

  const rootObjectFrame = rootObject.frame();
  rootObjectFrame.setWidth(mensuration.width);
  rootObjectFrame.setHeight(mensuration.height);
  rootObjectFrame.setX(mensuration.x);
  rootObjectFrame.setY(mensuration.y);
}

function setOrigin(context, setOfRootObject) {
  const Y = [];
  const X = [];
  let size = 0;

  setOfRootObject.forEach(layer => {
    layer = layer.sketchObject
    const layerSize = layer.frame().height();
    const origin = layer.origin()
    Y.push(origin.y - size);
    X.push(origin.x - size);
    if (layerSize > size) size = layerSize;
  });


  const yOrigin = (Y.length !== 0) ? Math.max(...Y) : 0
  const xOrigin = (X.length !== 0) ? Math.max(...X) + size : 0

  return {
    yOrigin: (setOfRootObject.length === 0) ? yOrigin : yOrigin + 100 + size,
    xOrigin: (setOfRootObject.length === 0) ? xOrigin : xOrigin + 100 + size
  }
}


/**
 * @name initImportIcons
 * @description main function to import multiple icons and mask on new artboard
 * @param context {Object}
 * @param params: {Object}
 */
async function initImportIcons(context, params) {
  utils.clearSelection(context);
  params.listIcon.forEach((icon, index) => {
    try {
      const name = utils.getIconNameByNSUrl(icon)
      const newRootObject = createArtboard(context, index, name, params);
      const ext = String(icon.toString().split('.').pop()).toLowerCase()
      if (ext === 'pdf') return importerProvider.addPDF(context, newRootObject, params, icon);
      if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return importerProvider.addBITMAP(context, newRootObject, params, icon)
      const svgData = String(NSString.alloc().initWithContentsOfURL(icon));
      processSVG(context, newRootObject, params, svgData)
      workingRootObject.push(newRootObject)
    } catch (e) {
      logger.error(e);
    }
  });
  utils.clearSelection(context);
}

/**
 * @name initOrganizeIcons
 * @param context
 * @param params
 */
function initOrganizeIcons(context, params) {

  params.listIcon.forEach(async (icon, index) => {
    try {
      const newRootObject = createArtboard(context, index, icon.name(), params);
      if (String(icon.class()) === 'MSBitmapLayer') return importerProvider.addBITMAP(context, newRootObject, params, icon)
      const ancestry = MSImmutableLayerAncestry.ancestryWithMSLayer_(icon);
      const exportRequest = MSExportRequest.exportRequestsFromLayerAncestry_(ancestry).firstObject();
      exportRequest.format = 'svg';
      const exporter = MSExporter.exporterForRequest_colorSpace_(exportRequest, NSColorSpace.sRGBColorSpace());
      const svgData = NSString.alloc().initWithData_encoding(exporter.data(), NSUTF8StringEncoding);
      // await processSVG(context, newRootObject, params, String(svgData));
      importerProvider.addSVGNew(context, newRootObject, params, svgData, true);
      if (params.withColor) maskProvider.addColor(context, newRootObject, params);
      workingRootObject.push(newRootObject)
    } catch (e) {
      logger.error(e);
    }
  })
}

/**
 * @name initImport
 * @param context
 * @param params
 * @param cb
 */
function initImport(context, params, cb) {
  const rootObjects = utils.getRootObject(context)
  params.yOrigin = setOrigin(context, rootObjects).yOrigin;
  if (params.presets) {
    const withPresetTitle = (rootObjects);
    params.presets.forEach((preset) => {
      setArtboardsSize(params, preset);
      params.xOrigin = setOrigin(context, workingRootObject).xOrigin;
      params.artboardSize = preset.artboardSize;
      params.prefix = utils.buildPrefix(context, params.artboardSize);
      if (withPresetTitle && rootObjects.length === 0) context.document.currentPage().addLayers([newText(preset, params.xOrigin)]);
      artboardParams.iconsByLine = parseInt(settingsProvider.getSettings(context, 'default').iconsByLine.data);
      cb(context, params)
    })
  } else {
    params.prefix = utils.buildPrefix(context, params.artboardSize);
    artboardParams.height = artboardParams.width = params.artboardSize;
    artboardParams.iconsByLine = parseInt(settingsProvider.getSettings(context, 'default').iconsByLine.data)
    cb(context, params)
  }
  const importedIcons = params.listIcon.length * ((Array.isArray(params.presets)) ? params.presets.length : 1)
  context.document.showMessage(
    `🎉 Tadaaa! 🎉 ${importedIcons} icon${params.listIcon.length > 1 ? 's' : ''} imported`
  );
  return importedIcons
}

function newText(preset, xOrigin) {
  const text = MSTextLayer.new();
  text.setStringValue_(`${preset.artboardSize}px`)
  const fontManager = NSFontManager.sharedFontManager();
  const boldItalic = fontManager.fontWithFamily_traits_weight_size("Helvetica neue", NSBoldFontMask, 0, artboardParams.titleFontSize)
  text.setFont(boldItalic)
  text.lineHeight = 48
  text.setName(`${preset.artboardSize}px`)
  const textFrame = text.frame();
  textFrame.setX(xOrigin)
  textFrame.setY(-(32 + text.lineHeight()))
  return text
}

/**
 * @name setArtboardsPosition
 * @param params
 * @param preset
 */
function setArtboardsSize(params, preset) {
  params.iconPadding = preset.iconPadding
  artboardParams.height = artboardParams.width = preset.artboardSize;
}

/**
 * @name processSVG
 * @param context
 * @param rootObject
 * @param params
 * @param svgData
 * @return {Promise<*>}
 */
function processSVG(context, rootObject, params, svgData) {
  importerProvider.addSVG(context, rootObject, params, svgData, true);
  if (params.withColor) maskProvider.addColor(context, rootObject, params);
  return context.command.setValue_forKey_onLayer(params.iconPadding, 'padding', rootObject);
}

/**
 * @name getPaddingAndSize
 * @description get padding and size by artboard
 * @param context
 * @param artboard {Object} : MSArtboardGroup
 * @returns {{iconPadding: Number, artboardSize: Number}}
 */
function getPaddingAndSize(context, artboard) {
  let iconPadding = context.command.valueForKey_onLayer('padding', artboard);

  if (!iconPadding) {
    const icon = artboard.layers()[0].rect();
    iconPadding = Math.min(icon.origin.x, icon.origin.y);
  }

  return {
    iconPadding: parseInt(iconPadding),
    artboardSize: parseInt(artboard.rect().size.width)
  };
}

/**
 * @name resizeRootObject
 * @param rootObject
 * @param size
 */
function resizeRootObject(rootObject, size) {
  const rootObjectFrame = rootObject.frame()
  rootObjectFrame.setWidth(size);
  rootObjectFrame.setHeight(size);
}
