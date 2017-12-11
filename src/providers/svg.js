import maskProvider from './mask'
import artboardProvider from './artboard'
import utils from '../utils/utils'

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
    let params = Object.assign(artboardProvider.getPaddingAndSize(artboard.object), maskProvider.getMaskProperties(artboard.object), {iconPath : listIcon[index]})
    artboard.object.removeAllLayers()
    addSVG(context, artboard.object, params.iconPadding, params.iconPath)
    if (params.color && params.colorLib) maskProvider.addMask(context, artboard.object, params)
    artboard.object.setName(utils.getIconNameByNSUrl(params.iconPath))
  })
}

/**
 * @name addSVG
 * @description  add svg on specific artboard
 * @param context {Object}
 * @param artboard {Object} : MSArtboardGroup
 * @param iconPadding {Number}
 * @param iconPath {Object} : NSUrl
 */
function addSVG(context, artboard, iconPadding, iconPath) {
  utils.clearSelection(context)
  const svgImporter = MSSVGImporter.svgImporter();
  const svgURL = NSURL.fileURLWithPath(iconPath.path());
  svgImporter.prepareToImportFromURL(svgURL);
  const svgLayer = svgImporter.importAsLayer();
  removeTxt(svgLayer)
  artboard.addLayer(svgLayer)
  const svgLayerFrame = svgLayer.frame()
  resizeSVG(svgLayerFrame, artboard, iconPadding)
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
    svgLayerFrame.setX(iconPadding)
    svgLayerFrame.setY(iconPadding)
  } else if (width >= height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding)
    svgLayerFrame.setX(iconPadding)
    newHeight = height * (currentArtboardSize.height - 2 * iconPadding) / width
    newHeight = (newHeight < 1) ? 1 : newHeight
    newPadding = (currentArtboardSize.width - 2 * iconPadding) / 2 + iconPadding - newHeight / 2

    svgLayerFrame.setHeight(newHeight)
    svgLayerFrame.setY(newPadding)

  } else {
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding)
    svgLayerFrame.setY(iconPadding)

    newWidth = width * (currentArtboardSize.width - 2 * iconPadding) / height
    newWidth = (newWidth < 1) ? 1 : newWidth
    newPadding = (currentArtboardSize.height - 2 * iconPadding) / 2 + iconPadding - newWidth / 2

    svgLayerFrame.setWidth(newWidth)
    svgLayerFrame.setX(newPadding)
  }
}

/**
 * @name removeTxt
 * @description remove text form svg
 * @param svgLayer {Object}
 */
function removeTxt(svgLayer) {

  const scope = svgLayer.children(),
    predicate = NSPredicate.predicateWithFormat("(className == %@)", "MSTextLayer"),
    layers = scope.filteredArrayUsingPredicate(predicate);

  const loop = layers.objectEnumerator();
  let layer;
  while (layer = loop.nextObject()) {
    layer.removeFromParent()
  }
}
