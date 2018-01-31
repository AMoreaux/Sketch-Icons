import maskProvider from './mask';
import artboardProvider from './artboard';
import settingsProvider from './settings';
import utils from '../utils/utils';
import logger from '../utils/logger';
import svgo from '../svgo/lib/svgo';

export default {
  initUpdateIconsSelectedArtboards,
  addSVG,
  replaceSVG,
  addPDF
};

/**
 * @name initUpdateIconsSelectedArtboards
 * @description main function to update multiple icons on selected artboard
 * @param context
 * @param params {Object}
 * @param rootObjects {Array} : MSArtboardGroup && MSSymbolMaster
 */
function initUpdateIconsSelectedArtboards(context, rootObjects, params) {
  rootObjects.forEach(function (rootObject, index) {
    const svgData = String(NSString.alloc().initWithContentsOfURL(params.listIcon[index]));

    params = {...maskProvider.getMaskPropertiesFromArtboard(context, rootObject.object), ...params};
    
    params.withMask = !!(params.colorLib || params.colorPicker || params.color);

    replaceSVG(context, rootObject.object, svgData, params, true).then(() => {
      rootObject.object.setName(utils.getIconNameByNSUrl(params.listIcon[index]));
      if (params.withMask) maskProvider.addColor(context, rootObject.object, params);
    });
  });

  utils.clearSelection(context);
}

/**
 * @name addSVG
 * @description  add svg on specific artboard
 * @param context {Object}
 * @param rootObject {Object} : MSArtboardGroup
 * @param params {Object}
 * @param svgData {String}
 * @param withResize {Boolean}
 */
async function addSVG(context, rootObject, params, svgData, withResize) {
  let viewBox;

  const settingsParams = settingsProvider.getSettings(context)

  if (params.withMask) svgData = await convertLayersToPathWithSVGO(context, svgData);
  svgData = NSString.stringWithString(svgData);
  if (params.viewBoxWidth && params.viewBoxHeight){
    svgData = updateViewBox(svgData, params)
    viewBox = {width: params.viewBoxWidth, height: params.viewBoxHeight }
  }else{
    viewBox = getViewBox(svgData);
  }
  if (withResize) svgData = addRectToResize(svgData, viewBox);
  const svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(svgData.dataUsingEncoding(NSUTF8StringEncoding));
  const svgLayer = svgImporter.importAsLayer();

  removeTxt(svgLayer);
  rootObject.addLayer(svgLayer);
  if (utils.svgHasStroke(rootObject) && settingsParams.convertStroke) {
    convertStrokeToLine(rootObject)

  //   const diagContainer = artboardSize - iconPadding * 2
  //   setThicknessProportionnally(svgLayer, diagContainer, viewBox)
  }
  if (params.withMask) cleanSvg(svgLayer, rootObject);
  if (withResize) resizeIcon(rootObject, params.iconPadding);
  if (withResize) removeDeleteMeRect(rootObject);
  // artboard.firstLayer().resizeToFitChildrenWithOption(1);
  center(params.artboardSize, rootObject.firstLayer());
}

function updateViewBox(svgData, params) {
  svgData = svgData.replace(/viewBox="[+-]?([0-9]*[.])?[0-9]+ [+-]?([0-9]*[.])?[0-9]+ [+-]?([0-9]*[.])?[0-9]+ [+-]?([0-9]*[.])?[0-9]+"/, `viewbox="0 0 ${params.viewBoxWidth} ${params.viewBoxHeight}"`)
  svgData = svgData.replace(/width="[0-9]+px"/, `width="${params.viewBoxWidth}px"`)
  svgData = svgData.replace(/height="[0-9]+px"/, `height="${params.viewBoxHeight}px"`)
  return svgData
}

async function addPDF(context, rootObject, iconPadding, artboardSize, icon) {
  const pdfImporter = MSPDFImporter.pdfImporter();
  pdfImporter.prepareToImportFromURL(icon);
  const pdfLayer = pdfImporter.importAsLayer();
  rootObject.addLayer(pdfLayer);
  resizeIcon(rootObject.firstLayer(), rootObject, iconPadding);
  center(artboardSize, rootObject.firstLayer());
  rootObject.firstLayer().setName(rootObject.name());
}

/**
 * @name convertLayersToPathWithSVGO
 * @description used svgo to initiate conversion in one path
 * @param context
 * @param svgString
 * @returns {Promise<void>}
 */
async function convertLayersToPathWithSVGO(context, svgString) {
  const svgoInstance = new svgo({}, context);
  const result = await svgoInstance.optimize(svgString);
  return result.data;
}

/**
 * @name addRectToResize
 * @description add rect to keep proportion on resize
 * @param svgString
 * @param viewBox
 * @returns {String}
 */
function addRectToResize(svgString, viewBox) {
  const addrect = `<rect width="${viewBox.width}" height="${viewBox.height}" id="delete-me"/></svg>`;
  return NSString.stringWithString(svgString.replace('</svg>', addrect));
}

/**
 * @name cleanSvg
 * @description main function which used sketch properties to convert icon in one path
 * @param svgLayer
 * @param rootObject
 */
function cleanSvg(svgLayer, rootObject) {
  unGroup(svgLayer);
  rootObject.firstLayer().setName(rootObject.name());
  removeNoFillLayer(rootObject);
  mergeLayer(rootObject);
  rootObject.firstLayer().resizeToFitChildrenWithOption(1);
}

/**
 * @name center
 * @description center svg in artboard
 * @param artboardSize
 * @param svgLayer
 */
function center(artboardSize, svgLayer) {
  const shapeGroupWidth = svgLayer.frame().width();
  const shapeGroupHeight = svgLayer.frame().height();
  svgLayer.frame().setX((artboardSize - shapeGroupWidth) / 2);
  svgLayer.frame().setY((artboardSize - shapeGroupHeight) / 2);
}

/**
 * @name resizeIcon
 * @description resize layer by artboard
 * @param rootObject {Object}
 * @param iconPadding {Number}
 */
function resizeIcon(rootObject, iconPadding) {
  const svgLayer = rootObject.firstLayer()
  const svgLayerFrame = svgLayer.frame();

  svgLayer.resizeToFitChildrenWithOption(1);

  const currentArtboardRect = rootObject.rect();
  const currentArtboardSize = {
    width: parseInt(currentArtboardRect.size.width),
    height: parseInt(currentArtboardRect.size.height)
  };
  const width = svgLayerFrame.width();
  const height = svgLayerFrame.height();

  svgLayerFrame.constrainProportions = true;

  if (width >= height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding);
  } else {
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding);
  }
}

/**
 * @name removeTxt
 * @description remove text form svg
 * @param svgLayer {Object}
 */
function removeTxt(svgLayer) {
  const scope = svgLayer.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat('(className == %@)', 'MSTextLayer');

  const layers = scope.filteredArrayUsingPredicate(predicateTextLayers);

  const loop = layers.objectEnumerator();
  let layer;
  while ((layer = loop.nextObject())) {
    layer.removeFromParent();
  }
}

/**
 * @name removeUnecessaryGroup
 * @description ungroup all group
 * @param svgLayer
 */
function unGroup(svgLayer) {
  const scope = svgLayer.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat('(className == %@)', 'MSLayerGroup');
  const layers = scope.filteredArrayUsingPredicate(predicateTextLayers);

  const loop = layers.objectEnumerator();
  let layer;
  while ((layer = loop.nextObject())) {
    layer.ungroup();
  }
}

/**
 * @name removeDeleteMeRect
 * @description remove rect used to keep proportion on resize
 * @param rootObject
 * @returns {*}
 */
function removeDeleteMeRect(rootObject) {
  const scope = rootObject.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat('(name == %@)', 'delete-me');
  const layers = scope.filteredArrayUsingPredicate(predicateTextLayers);

  if (!layers.length)
    return rootObject
      .firstLayer()
      .lastLayer()
      .removeFromParent();

  const loop = layers.objectEnumerator();
  let layer;
  while ((layer = loop.nextObject())) {
    layer.removeFromParent();
  }
}

/**
 * @description remove transparent layers
 * @name removeNoFillLayer
 * @param rootObject
 */
function removeNoFillLayer(rootObject) {
  const indexes = NSMutableIndexSet.indexSet();
  rootObject.layers().forEach(function (layer, index) {
    if (!layer.style().hasEnabledFill() && !layer.style().hasEnabledBorder())
      indexes.addIndex(index);
  });
  rootObject.removeLayersAtIndexes(indexes);
}

/**
 * @name mergeLayer
 * @description merge all path in one path
 * @param rootObject
 */
function mergeLayer(rootObject) {
  const layers = rootObject.layers();

  if (layers.length > 1) {
    for (let i = 0; i <= layers.length - 1; i++) {
      layers[1].moveToLayer_beforeLayer(layers[0], layers[1]);
    }
  }

  if (rootObject.layers().length > 1) return mergeLayer(rootObject);

  rootObject.children().forEach(function (children) {
    if (String(children.class()) === 'MSShapePathLayer' && children.booleanOperation() !== -1)
      children.setBooleanOperation(-1);
  });

  layers[0].resizeToFitChildrenWithOption(0);
  layers[0].setName(rootObject.name());
}

/**
 * @name getViewBox
 * @description return values of viewbox
 * @param svgData
 * @returns {{width: number, height: number}}
 */
function getViewBox(svgData) {
  let viewBox = svgData.match(/viewBox="[+-]?([0-9]*[.])?[0-9]+ [+-]?([0-9]*[.])?[0-9]+ [+-]?([0-9]*[.])?[0-9]+ [+-]?([0-9]*[.])?[0-9]+"/);
  let size;
  let result;
  if (Array.isArray(viewBox)) {
    size = viewBox[0].match(/[+-]?([0-9]*[.])?[0-9]+/g);
    result = { width: parseFloat(size[2]), height: parseFloat(size[3]) };
  }

  return result;
}

async function replaceSVG(context, rootObject, svgData, params, withResize) {
  params = {...artboardProvider.getPaddingAndSize(context, rootObject), ...params};
  rootObject.removeAllLayers();
  try {
    await addSVG(
      context,
      rootObject,
      params,
      String(svgData),
      withResize
    );
  } catch (e) {
    logger.error(e);
  }
}

function convertStrokeToLine(rootObject) {

  rootObject.children().forEach(layer => {
    if(layer.canConvertToOutlines()){
      layer.layersByConvertingToOutlines()
      layer.splitPathsIntoShapes()
    }
  })

  rootObject.children().forEach(layer => {
    layer.styledLayer().style().disableAllBorders()
  })
}

// function setThicknessProportionnally(svgLayer, diagContainer, viewBox) {
//
//   const diagViewbox = Math.sqrt(Math.pow(viewBox.width, 2) + Math.pow(viewBox.height, 2))
//   const diagArtboard = Math.sqrt(Math.pow(diagContainer, 2) * 2)
//   const ratio = diagArtboard / diagViewbox
//
//   svgLayer.children().forEach((layer) => {
//     if (layer.styledLayer().style().hasEnabledBorder() && String(layer.class()) === 'MSShapePathLayer') {
//       const style = layer.styledLayer().style()
//       const thickness = style.firstEnabledBorder().thickness()
//       style.firstEnabledBorder().thickness = Math.round(thickness * ratio)
//     }
//   })
// }
