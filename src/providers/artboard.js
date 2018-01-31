// @import './utils/utils.js'
// @import './providers/mask.cocoascript'
// @import './providers/svg.cocoascript'

import utils from '../utils/utils';
import logger from '../utils/logger';
import svg from '../providers/svg';
import maskProvider from './mask';
import settingsProvider from './settings';

export default {
  initImportIcons,
  getPaddingAndSize,
  initOrganizeIcons
};

const artboardParams = {
  position: {
    x: 0,
    y: 0
  },
  size: {
    height: 0,
    width: 0
  },
  iconsByLine: 10
};

/**
 * @name createArtboard
 * @description set position and size and create artboard
 * @param context {Object} :
 * @param index {Number}
 * @param name {String}
 * @param convertToSymbol {Boolean}
 * @returns {Object} : MSArtboardGroup
 */
function createArtboard(context, index, name, convertToSymbol) {
  if (index % artboardParams.iconsByLine === 0) {
    artboardParams.position.y += artboardParams.size.width * 2;
    artboardParams.position.x = artboardParams.size.width;
  } else {
    artboardParams.position.x += 2 * artboardParams.size.width;
  }
  const newArtboard = MSArtboardGroup.new();
  newArtboard.setName(name);
  const newArtboardFrame = newArtboard.frame();
  newArtboardFrame.setWidth(artboardParams.size.width);
  newArtboardFrame.setHeight(artboardParams.size.height);
  newArtboardFrame.setX(artboardParams.position.x);
  newArtboardFrame.setY(artboardParams.position.y);
  context.document.currentPage().addLayers([newArtboard]);

  return convertToSymbol
    ? MSSymbolMaster.convertArtboardToSymbol(newArtboard)
    : newArtboard;
}

/**
 * @name initArtboardsParams
 * @description initialisation for new artboard position
 * @param context
 */
function initArtboardsParams(context) {
  const currentPage = context.api().selectedDocument.selectedPage;
  artboardParams.iconsByLine = parseInt(settingsProvider.getSettings(context).iconsByLine)
  if (currentPage.sketchObject.children().length === 1) {
    artboardParams.position.x = artboardParams.position.y = artboardParams.size.width * 2;
  } else {
    const Y = [];
    currentPage.sketchObject.layers().some(function(layer) {
      Y.push(layer.origin().y);
    });
    artboardParams.position.x = artboardParams.size.width * 2;
    artboardParams.position.y = Math.max(...Y);
  }
}

/**
 * @name initImportIcons
 * @description main function to import multiple icons and mask on new artboard
 * @param context {Object}
 * @param params: {Object}
 */
function initImportIcons(context, params) {
  utils.clearSelection(context);
  artboardParams.size.height = artboardParams.size.width = params.artboardSize;
  initArtboardsParams(context);
  params.listIcon.forEach(async (icon, index) => {
    try {
      const name = utils.getIconNameByNSUrl(icon)
      const newRootObject = createArtboard(context, index, name, params.convertSymbol);
      if (String(icon.toString().split('.').pop()) === 'pdf') return svg.addPDF(context, newRootObject, params.iconPadding, params.artboardSize, icon);
      const svgData = String(NSString.alloc().initWithContentsOfURL(icon));
      await processSVG(context, newRootObject, params, svgData)
    } catch (e) {
      logger.error(e);
    }
  });
  utils.clearSelection(context);
  context.document.showMessage(
    `🎉 Tadaaa! 🎉 ${params.listIcon.length} icon${params.listIcon.length > 1 ? 's' : ''} imported`
  );
}

function initOrganizeIcons(context, params){
  artboardParams.size.height = artboardParams.size.width = params.artboardSize;
  initArtboardsParams(context);
  params.listIcon.forEach((icon, index) => {
    try{
      const newRootObject = createArtboard(context, index, icon.name(), params.convertSymbol);

      const ancestry = MSImmutableLayerAncestry.ancestryWithMSLayer_(icon);
      const exportRequest = MSExportRequest.exportRequestsFromLayerAncestry_(ancestry).firstObject();
      exportRequest.format = 'svg';
      const exporter = MSExporter.exporterForRequest_colorSpace_(exportRequest, NSColorSpace.sRGBColorSpace());
      const svgData = NSString.alloc().initWithData_encoding(exporter.data(), NSUTF8StringEncoding);

      processSVG(context, newRootObject, params, svgData)

      icon.removeFromParent()
    }catch (e){
      logger.error(e);
    }
  })
}

async function processSVG(context, rootObject, params, svgData){
  // await svg.addSVG(context, rootObject, params.iconPadding, params.artboardSize, svgData, params.withMask, true);
  await svg.addSVG(context, rootObject, params, svgData, true);
  if (params.withMask) maskProvider.addColor(context, rootObject, params);
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
