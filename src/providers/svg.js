import maskProvider from './mask'
import artboardProvider from './artboard'
import utils from '../utils/utils'
import logger from '../utils/logger'

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

  artboards.forEach(function(artboard, index){
    const layers = artboard.object.layers()
    const isMasked = utils.isArtboardMasked(artboard.object)
    let params = Object.assign(artboardProvider.getPaddingAndSize(artboard.object), {iconPath : listIcon[index]})
    layers[0].removeFromParent()
    if (isMasked) {
      params.mask = layers[0].copy()
      layers[0].removeFromParent()
      // maskProvider.addMask(context, artboard.object, params)
    }
    addSVG(context, artboard.object, params.iconPadding, params.artboardSize, params.iconPath)
    if(isMasked)maskProvider.applyMask(artboard.object, params.mask)

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
  utils.clearSelection(context)
  const svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(readFile(iconPath, iconPadding, artboardSize));
  const svgLayer = svgImporter.importAsLayer();
  removeTxt(svgLayer)
  artboard.addLayer(svgLayer)
  const svgLayerFrame = svgLayer.frame()
  resizeSVG(svgLayerFrame, artboard, iconPadding)
  maskProvider.formatSvg(artboard, true)
  maskProvider.dedupeLayers(artboard)
  center(artboardSize, artboard.layers()[0].frame())
}

function center(artboardSize, svgLayerFrame){

  const shapeGroupWidth = svgLayerFrame.width()
  const shapeGroupHeight = svgLayerFrame.height()
  svgLayerFrame.setX((artboardSize - shapeGroupWidth) / 2)
  svgLayerFrame.setY((artboardSize - shapeGroupHeight) / 2)

}

function readFile(url, iconPadding, artboardSize){
  let content = NSString.alloc().initWithContentsOfURL(url)

  const sizeWrapper = artboardSize - iconPadding * 2
  const addrect = `<rect width=${sizeWrapper} height=${sizeWrapper} id="delete-me"/></svg>`
  content = NSString.stringWithString(content.replace('</svg>', addrect))

  return content.dataUsingEncoding(NSUTF8StringEncoding);
}



/**
 * @name resizeSVG
 * @description resize layer by artboard
 * @param svgLayerFrame {Object} : MSShape*
 * @param artboard {Object} : MSArtboardGroup
 * @param iconPadding {Number}
 */
function resizeSVG(svgLayerFrame, artboard, iconPadding) {

  const currentArtboardRect = artboard.rect()
  const currentArtboardSize = {
    width: parseInt(currentArtboardRect.size.width),
    height: parseInt(currentArtboardRect.size.height)
  }
  const width = svgLayerFrame.width()
  const height = svgLayerFrame.height()
  let newPadding, newHeight, newWidth;

  if (width === height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding)
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding)
    // svgLayerFrame.setX(iconPadding)
    // svgLayerFrame.setY(iconPadding)
  } else if (width >= height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding)
    // svgLayerFrame.setX(iconPadding)
    newHeight = height * (currentArtboardSize.height - 2 * iconPadding) / width
    newHeight = (newHeight < 1) ? 1 : newHeight
    // newPadding = (currentArtboardSize.width - 2 * iconPadding) / 2 + iconPadding - newHeight / 2

    svgLayerFrame.setHeight(newHeight)
    // svgLayerFrame.setY(newPadding)

  } else {
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding)
    // svgLayerFrame.setY(iconPadding)

    newWidth = width * (currentArtboardSize.width - 2 * iconPadding) / height
    newWidth = (newWidth < 1) ? 1 : newWidth
    // newPadding = (currentArtboardSize.height - 2 * iconPadding) / 2 + iconPadding - newWidth / 2

    svgLayerFrame.setWidth(newWidth)
    // svgLayerFrame.setX(newPadding)
  }
}

/**
 * @name removeTxt
 * @description remove text form svg
 * @param svgLayer {Object}
 */
function removeTxt(svgLayer) {

  const scope = svgLayer.children(),
    predicateTextLayers = NSPredicate.predicateWithFormat("(className == %@)", "MSTextLayer"),
    predicateId = NSPredicate.predicateWithFormat("(name == %@)", "delete-me"),
    // predicateRectangle = NSPredicate.predicateWithFormat("(name == %@)", "Rectangle-path"),

    layers = scope.filteredArrayUsingPredicate(predicateTextLayers)
      .arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicateId))
      // .arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicateRectangle))

  const loop = layers.objectEnumerator();
  let layer;
  while (layer = loop.nextObject()) {
    layer.removeFromParent()
  }
}
