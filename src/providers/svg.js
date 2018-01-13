import maskProvider from './mask'
import artboardProvider from './artboard'
import utils from '../utils/utils'
import logger from '../utils/logger'
import svgo from '../svgo/lib/svgo'

export default {
  initUpdateIconsSelectedArtboards,
  addSVG,
  replaceSVG
}

/**
 * @name initUpdateIconsSelectedArtboards
 * @description main function to update multiple icons on selected artboard
 * @param context
 * @param listIcon {Array} : NSUrl
 * @param rootObjects {Array} : MSArtboardGroup && MSSymbolMaster
 */
function initUpdateIconsSelectedArtboards(context, rootObjects, listIcon) {

  rootObjects.forEach(function (rootObject, index) {
    let isMasked;
    const svgData = String(NSString.alloc().initWithContentsOfURL(listIcon[index]))
    const hasStroke = utils.svgHasStroke(rootObject.object)

    isMasked = ((!hasStroke && utils.hasMask(rootObject.object)) || utils.iconHasBorderColor(rootObject.object))

    replaceSVG(context, rootObject.object, svgData, isMasked, true)
      .then(() => {
        rootObject.object.setName(utils.getIconNameByNSUrl(listIcon[index]))

        if (isMasked) {
          const params = maskProvider.getMaskPropertiesFromArtboard(context, rootObject.object)
          if (utils.svgHasStroke(rootObject.object)) {
            maskProvider.applyColor(rootObject.object, params)
          } else {
            maskProvider.applyMask(context, rootObject.object, params)
          }
        }
      })

  })

  utils.clearSelection(context)
}

/**
 * @name addSVG
 * @description  add svg on specific artboard
 * @param context {Object}
 * @param artboard {Object} : MSArtboardGroup
 * @param iconPadding {Number}
 * @param artboardSize {Number}
 * @param svgData {String}
 * @param withMask {Boolean}
 * @param withResize {Boolean}
 */
async function addSVG(context, artboard, iconPadding, artboardSize, svgData, withMask, withResize) {

  if (withMask) svgData = await convertLayersToPathWithSVGO(context, svgData)
  svgData = NSString.stringWithString(svgData)
  const viewBox = getViewBox(svgData)
  if (withResize) svgData = addRectToResize(svgData, viewBox)
  const svgImporter = MSSVGImporter.svgImporter()
  svgImporter.prepareToImportFromData(svgData.dataUsingEncoding(NSUTF8StringEncoding))
  const svgLayer = svgImporter.importAsLayer()
  removeTxt(svgLayer)
  artboard.addLayer(svgLayer)
  if (utils.svgHasStroke(artboard)) {
    const diagContainer = artboardSize - iconPadding
    setThicknessProportionnally(svgLayer, diagContainer, viewBox)
  }
  if (withMask) cleanSvg(svgLayer, artboard)
  if (withResize) resizeSVG(artboard.firstLayer(), artboard, iconPadding)
  if (withResize) removeDeleteMeRect(artboard)
  artboard.firstLayer().resizeToFitChildrenWithOption(1)
  center(artboardSize, artboard.firstLayer())
}

/**
 * @name convertLayersToPathWithSVGO
 * @description used svgo to initiate conversion in one path
 * @param context
 * @param svgString
 * @returns {Promise<void>}
 */
async function convertLayersToPathWithSVGO(context, svgString) {

  const svgoInstance = new svgo({}, context)
  const result = await svgoInstance.optimize(svgString)
  return result.data
}

/**
 * @name addRectToResize
 * @description add rect to keep proportion on resize
 * @param svgString
 * @param viewBox
 * @returns {String}
 */
function addRectToResize(svgString, viewBox) {
  const addrect = `<rect width=${viewBox.width} height=${viewBox.height} id="delete-me" name="delete-me"/></svg>`
  return NSString.stringWithString(svgString.replace('</svg>', addrect))
}

/**
 * @name cleanSvg
 * @description main function which used sketch properties to convert icon in one path
 * @param svgLayer
 * @param artboard
 */
function cleanSvg(svgLayer, artboard) {
  unGroup(svgLayer)
  artboard.firstLayer().setName(artboard.name())
  removeNoFillLayer(artboard)
  mergeLayer(artboard)
  artboard.firstLayer().resizeToFitChildrenWithOption(1)
}

/**
 * @name center
 * @description center svg in artboard
 * @param artboardSize
 * @param svgLayer
 */
function center(artboardSize, svgLayer) {
  const shapeGroupWidth = svgLayer.frame().width()
  const shapeGroupHeight = svgLayer.frame().height()
  svgLayer.frame().setX((artboardSize - shapeGroupWidth) / 2)
  svgLayer.frame().setY((artboardSize - shapeGroupHeight) / 2)
}


/**
 * @name resizeSVG
 * @description resize layer by artboard
 * @param svgLayer {Object} : MSLayer
 * @param artboard {Object} : MSArtboardGroup
 * @param iconPadding {Number}
 */
function resizeSVG(svgLayer, artboard, iconPadding) {
  const svgLayerFrame = svgLayer.frame()

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

/**
 * @name removeUnecessaryGroup
 * @description ungroup all group
 * @param svgLayer
 */
function unGroup(svgLayer) {
  const scope = svgLayer.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat("(className == %@)", "MSLayerGroup");
  layers = scope.filteredArrayUsingPredicate(predicateTextLayers)

  const loop = layers.objectEnumerator();
  let layer;
  while (layer = loop.nextObject()) {
    layer.ungroup()
  }
}

/**
 * @name removeDeleteMeRect
 * @description remove rect used to keep proportion on resize
 * @param artboard
 * @returns {*}
 */
function removeDeleteMeRect(artboard) {
  const scope = artboard.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat("(name == %@)", "delete-me");
  const layers = scope.filteredArrayUsingPredicate(predicateTextLayers)

  if (!layers.length) return artboard.firstLayer().lastLayer().removeFromParent()

  const loop = layers.objectEnumerator();
  let layer;
  while (layer = loop.nextObject()) {
    layer.removeFromParent()
  }

}

/**
 * @description remove transparent layers
 * @name removeNoFillLayer
 * @param artboard
 */
function removeNoFillLayer(artboard) {
  const indexes = NSMutableIndexSet.indexSet()
  artboard.layers().forEach(function (layer, index) {
    if (!layer.style().hasEnabledFill() && !layer.style().hasEnabledBorder()) indexes.addIndex(index)
  })
  artboard.removeLayersAtIndexes(indexes)
}


/**
 * @name mergeLayer
 * @description merge all path in one path
 * @param artboard
 */
function mergeLayer(artboard) {

  const layers = artboard.layers()

  if (layers.length > 1) {
    for (var i = 0; i <= layers.length - 1; i++) {
      layers[1].moveToLayer_beforeLayer(layers[0], layers[1]);
    }
  }

  if (artboard.layers().length > 1) return mergeLayer(artboard)

  artboard.children().forEach(function (children) {
    if (String(children.class()) === 'MSShapePathLayer' && children.booleanOperation() !== -1) children.setBooleanOperation(-1)
  })

  layers[0].resizeToFitChildrenWithOption(0)
  layers[0].setName(artboard.name())
}

/**
 * @name getViewBox
 * @description return values of viewbox
 * @param svg
 * @returns {{width: number, height: number}}
 */
function getViewBox(svg) {
  let viewBox = svg.match(/viewBox="[0-9]+ [0-9]+ [0-9]+ [0-9]+"/)
  let size;
  let result;
  if (Array.isArray(viewBox)) {
    size = viewBox[0].match(/[0-9]+/g)
    result = {width: parseFloat(size[2]), height: parseFloat(size[3])}
  }
  return result
}

async function replaceSVG(context, artboard, svgData, withMask, withResize) {
  const params = artboardProvider.getPaddingAndSize(context, artboard)
  artboard.removeAllLayers()
  try {
    await addSVG(context, artboard, params.iconPadding, params.artboardSize, String(svgData), withMask, withResize)
  } catch (e) {
    logger.error(e)
  }
}

function setThicknessProportionnally(svgLayer, diagContainer, viewBox) {

  const diagViewbox = Math.sqrt(Math.pow(viewBox.width, 2) + Math.pow(viewBox.height, 2))
  const diagArtboard = Math.sqrt(Math.pow(diagContainer, 2) * 2)
  const ratio = diagArtboard / diagViewbox

  svgLayer.children().forEach((layer) => {
    if (layer.styledLayer().style().hasEnabledBorder() && String(layer.class()) === 'MSShapePathLayer') {
      const style = layer.styledLayer().style()
      const thickness = style.firstEnabledBorder().thickness()
      style.firstEnabledBorder().thickness = Math.round(thickness * ratio)
    }
  })
}