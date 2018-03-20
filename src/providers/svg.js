import maskProvider from './mask';
import artboardProvider from './artboard';
import settingsProvider from './settings';
import utils from '../utils/utils';

export default {
  initUpdateIconsSelectedArtboards,
  addSVG,
  addPDF,
  addBITMAP,
  cleanSvg
};

/**
 * @name initUpdateIconsSelectedArtboards
 * @description main function to update multiple icons on selected artboard
 * @param context
 * @param params {Object}
 * @param rootObjects {Array} : MSArtboardGroup && MSSymbolMaster
 */
function initUpdateIconsSelectedArtboards(context, rootObjects, params) {
  rootObjects.forEach((rootObject, index) => {

    const iconParams = {
      ...maskProvider.getMaskPropertiesFromArtboard(context, rootObject.object),
      ...artboardProvider.getPaddingAndSize(context, rootObject.object),
      ...params
    };
    const replaceBy = (params.listIcon.length === 1) ? params.listIcon[0] : params.listIcon[index];

    const svgData = String(NSString.alloc().initWithContentsOfURL(replaceBy));
    iconParams.withMask = !!(iconParams.colorLib || iconParams.colorPicker || iconParams.color);

    rootObject.object.removeAllLayers();

    addSVG(context, rootObject.object, iconParams, String(svgData), true);
    rootObject.object.setName(utils.getIconNameByNSUrl(replaceBy));
    if (iconParams.withMask) maskProvider.addColor(context, rootObject.object, iconParams);
  });

  utils.clearSelection(context);

  return rootObjects.length
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
function addSVG(context, rootObject, params, svgData, withResize) {
  let viewBox;

  const settingsParams = settingsProvider.getSettings(context, 'default')

  svgData = NSString.stringWithString(svgData);

  viewBox = getViewBox(svgData);

  if (withResize) svgData = addRectToResize(svgData, viewBox);
  const svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(svgData.dataUsingEncoding(NSUTF8StringEncoding));
  const svgLayer = svgImporter.importAsLayer();

  removeTxt(svgLayer);

  rootObject.addLayer(svgLayer);

  removeNoFillChildren(rootObject)

  if (utils.svgHasStroke(rootObject) && settingsParams.convertStroke.data === '1') convertStrokeToFill(rootObject)

  if (withResize) resizeIcon(rootObject, params.iconPadding);
  if (withResize) removeDeleteMeRect(rootObject);

  center(params.artboardSize, rootObject.firstLayer());
}

function addPDF(context, rootObject, params, icon) {
  const pdfImporter = MSPDFImporter.pdfImporter();
  pdfImporter.prepareToImportFromURL(icon);
  const pdfLayer = pdfImporter.importAsLayer();
  rootObject.addLayer(pdfLayer);
  resizeIcon(rootObject, params.iconPadding);
  center(params.artboardSize, rootObject.firstLayer());
  rootObject.firstLayer().setName(rootObject.name());
}

function addBITMAP(context, rootObject, params, icon) {

  if (String(icon.class()) === 'MSBitmapLayer') {
    MSLayerGroup.moveLayers_intoGroup([icon], rootObject)
  } else {
    rootObject.addLayer(MSBitmapLayer.bitmapLayerWithImageFromPath(icon));
  }

  resizeIcon(rootObject, params.iconPadding);
  center(params.artboardSize, rootObject.firstLayer());
  rootObject.firstLayer().setName(rootObject.name());
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
 * @param rootObject
 */
function cleanSvg(rootObject) {
  unGroup(rootObject);
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
  rootObject.layers().forEach((layer, index) => {
    if (!layer.style().hasEnabledFill() && !layer.style().hasEnabledBorder()) indexes.addIndex(index);
  });
  rootObject.removeLayersAtIndexes(indexes);
}

/**
 * @description remove transparent layers
 * @name removeNoFillLayer
 * @param rootObject
 */
function removeNoFillChildren(rootObject) {
  const toDelete = []
  rootObject.firstLayer().children().forEach(layer => {
    const style = layer.styledLayer().style()
    if (style.hasEnabledFill() && style.contextSettings().opacity() === 0) {
      toDelete.push(layer);
    }
  });

  toDelete.forEach(layer => {
    layer.removeFromParent()
  })
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

  rootObject.children().forEach(children => {
    if (children.booleanOperationCanBeReset()) children.setBooleanOperation(-1);
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

  let viewBox = svgData.match(/viewBox="(.*?)"/gm);

  let size;
  let result;
  if (Array.isArray(viewBox)) {
    size = viewBox[0].match(/[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g);
    result = { width: parseFloat(size[2]), height: parseFloat(size[3]) };
  }

  return result;
}

function convertStrokeToFill(rootObject) {

  rootObject.children().forEach(layer => {
    if (layer.canConvertToOutlines() && String(layer.name()) !== 'delete-me') {
      layer.layersByConvertingToOutlines()
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
