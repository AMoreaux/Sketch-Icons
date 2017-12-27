import maskProvider from './mask'
import artboardProvider from './artboard'
import utils from '../utils/utils'
import logger from '../utils/logger'
import * as xmljs from "xml-js";
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

  const svgoInstance= new svgo({plugins: ['convertShapeToPath', 'mergePaths', 'removeEmptyRect']}, context)
  svgoInstance.optimize(String(NSString.alloc().initWithContentsOfURL(iconPath)))
    .then(function(result){
      const sizeWrapper = artboardSize - iconPadding * 2
      const addrect = `<rect width=${sizeWrapper} height=${sizeWrapper} id="delete-me"/></svg>`
      const svgData = NSString.stringWithString(result.data.replace('</svg>', addrect))
      const svgImporter = MSSVGImporter.svgImporter();
      svgImporter.prepareToImportFromData(svgData.dataUsingEncoding(NSUTF8StringEncoding));
      const svgLayer = svgImporter.importAsLayer();
      removeTxt(svgLayer)
      const group = MSLayerGroup.new();
      artboard.addLayer(group)
      group.addLayer(svgLayer)
      group.setName('icon')
      group.resizeToFitChildrenWithOption(0)
      resizeSVG(svgLayer.frame(), artboard, iconPadding)
      removeUnecessaryGroup(svgLayer)
      group.resizeToFitChildrenWithOption(0)
      center(artboardSize, group.frame())
      group.ungroup()
      removeNoFillLayer(artboard)
      mergeLayer(artboard)
    }).catch(function(err){
      logger.error(err)
  })
}

function center(artboardSize, svgLayerFrame) {
  const shapeGroupWidth = svgLayerFrame.width()
  const shapeGroupHeight = svgLayerFrame.height()
  svgLayerFrame.setX((artboardSize - shapeGroupWidth) / 2)
  svgLayerFrame.setY((artboardSize - shapeGroupHeight) / 2)
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
  let newHeight, newWidth;

  if (width === height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding)
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding)
  } else if (width >= height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding)
    newHeight = height * (currentArtboardSize.height - 2 * iconPadding) / width
    newHeight = (newHeight < 1) ? 1 : newHeight
    svgLayerFrame.setHeight(newHeight)
  } else {
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding)
    newWidth = width * (currentArtboardSize.width - 2 * iconPadding) / height
    newWidth = (newWidth < 1) ? 1 : newWidth
    svgLayerFrame.setWidth(newWidth)
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

    layers = scope.filteredArrayUsingPredicate(predicateTextLayers)
      .arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicateId))

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

function removeNoFillLayer(artboard){
  const indexes = NSMutableIndexSet.indexSet()
  artboard.layers().forEach(function(layer, index){
    if(!layer.style().hasEnabledFill()){
      indexes.addIndex(index)
    }
  })
  artboard.removeLayersAtIndexes(indexes)
}

/**
 *
 * @param artboard
 */
function mergeLayer(artboard){

  const layers = artboard.layers()

  if(layers.length <= 1)return

  for(var i = 1; i <= layers.length; i++){
    layers[1].moveToLayer_beforeLayer(layers[0], layers[1]);
  }

  layers[0].resizeToFitChildrenWithOption(0)
  layers[0].setName(artboard.name())
}