import maskProvider from './mask'
import artboardProvider from './artboard'
import utils from '../utils/utils'
import logger from '../utils/logger'
import svgo from '../svgo/lib/svgo'

export default {
  initUpdateIconsSelectedArtboards,
  addSVG,
  resizeSVG,
  removeTxt
}

/**
 * @name initUpdateIconsSelectedArtboards
 * @description main function to update multiple icons on selected artboard
 * @param context
 * @param listIcon {Array} : NSUrl
 * @param artboards {Array} : MSArtboardGroup && MSSymbolMaster
 */
function initUpdateIconsSelectedArtboards(context, artboards, listIcon) {

  artboards.some(function (artboard, index) {
    const layers = artboard.object.layers()
    const isMasked = utils.isArtboardMasked(artboard.object)
    let params = Object.assign(artboardProvider.getPaddingAndSize(artboard.object), {iconPath: listIcon[index]})
    if (isMasked) params.mask = layers[1].copy()
    artboard.object.removeAllLayers()
    addSVG(context, artboard.object, params.iconPadding, params.artboardSize, params.iconPath)
    if (isMasked) maskProvider.applyMask(artboard.object, params.mask)
    artboard.object.setName(utils.getIconNameByNSUrl(params.iconPath))
  })

  utils.clearSelection(context)
}

/**
 * @name addSVG
 * @description  add svg on specific artboard
 * @param context {Object}
 * @param artboard {Object} : MSArtboardGroup
 * @param iconPadding {Number}
 * @param iconPath {Object} : NSUrl
 */
function addSVG(context, artboard, iconPadding, artboardSize, iconPath) {

  const svgoInstance = new svgo({}, context)
  svgoInstance.optimize(String(NSString.alloc().initWithContentsOfURL(iconPath)))
    .then(function (result) {
      const viewBox = getViewBox(result.data)
      const addrect = `<rect width=${viewBox.width} height=${viewBox.height} id="delete-me" name="delete-me"/></svg>`
      let svgData = NSString.stringWithString(result.data.replace('</svg>', addrect))
      const svgImporter = MSSVGImporter.svgImporter();
      svgImporter.prepareToImportFromData(svgData.dataUsingEncoding(NSUTF8StringEncoding));
      const svgLayer = svgImporter.importAsLayer();
      removeTxt(svgLayer)
      artboard.addLayer(svgLayer)
      removeUnecessaryGroup(svgLayer)
      artboard.firstLayer().setName(artboard.name())
      removeNoFillLayer(artboard)
      mergeLayer(artboard)
      artboard.firstLayer().resizeToFitChildrenWithOption(1)
      resizeSVG(artboard.firstLayer(), artboard, iconPadding)
      removeDeleteMeRect(artboard)
      artboard.firstLayer().resizeToFitChildrenWithOption(1)
      center(artboardSize, artboard.firstLayer())
    }).catch(function (err) {
    logger.error(err)
  })
}

function center(artboardSize, svgLayer) {
  const shapeGroupWidth = svgLayer.frame().width()
  const shapeGroupHeight = svgLayer.frame().height()
  svgLayer.frame().setX((artboardSize - shapeGroupWidth) / 2)
  svgLayer.frame().setY((artboardSize - shapeGroupHeight) / 2)
}


/**
 * @name resizeSVG
 * @description resize layer by artboard
 * @param svgLayerFrame {Object} : MSShape*
 * @param artboard {Object} : MSArtboardGroup
 * @param iconPadding {Number}
 */
function resizeSVG(svgLayer, artboard, iconPadding) {
  svgLayerFrame = svgLayer.frame()

  const currentArtboardRect = artboard.rect()
  const currentArtboardSize = {
    width: parseInt(currentArtboardRect.size.width),
    height: parseInt(currentArtboardRect.size.height)
  }
  const width = svgLayerFrame.width()
  const height = svgLayerFrame.height()


  svgLayerFrame.constrainProportions = true

  if (width >= height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding)
  } else {
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding)
  }
}

/**
 * @name removeTxt
 * @description remove text form svg
 * @param svgLayer {Object}
 */
function removeTxt(svgLayer) {

  const scope = svgLayer.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat("(className == %@)", "MSTextLayer")

  layers = scope.filteredArrayUsingPredicate(predicateTextLayers)

  const loop = layers.objectEnumerator();
  let layer;
  while (layer = loop.nextObject()) {
    layer.removeFromParent()
  }
}

function removeUnecessaryGroup(svgLayer) {
  const scope = svgLayer.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat("(className == %@)", "MSLayerGroup");
  layers = scope.filteredArrayUsingPredicate(predicateTextLayers)

  const loop = layers.objectEnumerator();
  let layer;
  while (layer = loop.nextObject()) {
    layer.ungroup()
  }
}

function removeDeleteMeRect(svgLayer) {
  const scope = svgLayer.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat("(name == %@)", "delete-me");
  layers = scope.filteredArrayUsingPredicate(predicateTextLayers)

  if (!layers.length) return svgLayer.firstLayer().lastLayer().removeFromParent()

  const loop = layers.objectEnumerator();
  let layer;
  while (layer = loop.nextObject()) {
    layer.removeFromParent()
  }

}

function removeNoFillLayer(artboard) {
  const indexes = NSMutableIndexSet.indexSet()
  artboard.layers().forEach(function (layer, index) {
    if (!layer.style().hasEnabledFill() && !layer.style().hasEnabledBorder()) {
      indexes.addIndex(index)
    }
  })
  artboard.removeLayersAtIndexes(indexes)
}


/**
 *
 * @param artboard
 */
function mergeLayer(artboard) {

  const layers = artboard.layers()

  for (var i = 0; i <= layers.length - 1; i++) {
    layers[1].moveToLayer_beforeLayer(layers[0], layers[1]);
  }

  if(artboard.layers().length > 1){
    mergeLayer(artboard)
  }

  artboard.children().forEach(function(children){
    if(String(children.class()) === 'MSShapePathLayer' && children.booleanOperation() !== -1){
      children.setBooleanOperation(-1)
    }
  })

  layers[0].resizeToFitChildrenWithOption(0)
  layers[0].setName(artboard.name())
}

function getViewBox(svg) {
  const viewBox = svg.match(/viewBox="[0-9]+ [0-9]+ [0-9]+ [0-9]+"/)[0]
  const size = viewBox.match(/[0-9]+/g)
  return {width: parseInt(size[2]), height: parseInt(size[3])}
}