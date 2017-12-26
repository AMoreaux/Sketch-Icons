import maskProvider from './mask'
import artboardProvider from './artboard'
import utils from '../utils/utils'
import logger from '../utils/logger'
import * as xmljs from "xml-js";

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
    const layers = artboard.object.firstLayer().layers()
    const isMasked = utils.isArtboardMasked(artboard.object)
    let params = Object.assign(artboardProvider.getPaddingAndSize(artboard.object), {iconPath: listIcon[index]})
    if (isMasked) params.mask = layers[1].copy()
    artboard.object.firstLayer().removeFromParent()
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
  utils.clearSelection(context)
  const svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(readFile(iconPath, iconPadding, artboardSize));
  const svgLayer = svgImporter.importAsLayer();
  removeTxt(svgLayer)
  const group = MSLayerGroup.new();
  artboard.addLayer(group)
  group.addLayer(svgLayer)
  group.setName('icon')
  resizeSVG(svgLayer.frame(), artboard, iconPadding)
  removeUnecessaryGroup(svgLayer)
  group.resizeToFitChildrenWithOption(1)
  center(artboardSize, group.frame())
}

function center(artboardSize, svgLayerFrame) {

  const shapeGroupWidth = svgLayerFrame.width()
  const shapeGroupHeight = svgLayerFrame.height()
  svgLayerFrame.setX((artboardSize - shapeGroupWidth) / 2)
  svgLayerFrame.setY((artboardSize - shapeGroupHeight) / 2)

}

function readFile(url, iconPadding, artboardSize) {
  let content = NSString.alloc().initWithContentsOfURL(url)
  const sizeWrapper = artboardSize - iconPadding * 2
  const wrapper = {_attributes: {width: sizeWrapper, height: sizeWrapper, id: 'delete-me'}}
  const contentJson = xmljs.xml2js(String(content), {compact: true, ignoreComment: true});

  removeTransparentRect(contentJson.svg)

  if (Array.isArray(contentJson.svg.rect)) contentJson.svg.rect.push(wrapper)
  else contentJson.svg.rect = wrapper

  const options = {
    spaces: 0,
    compact: true,
    fullTagEmptyElement: true
  };

  content = xmljs.js2xml(contentJson, options)

  return NSString.alloc().initWithString(content).dataUsingEncoding(NSUTF8StringEncoding);
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

function removeTransparentRect(object) {

  for (var property in object) {
    if (property === 'g') removeTransparentRect(object[property])

    if (property === 'rect') {
      const style = (object[property]._attributes && object[property]._attributes.style) ? object[property]._attributes.style : ''
      if (style.includes('opacity:0') || style.includes('fill:none')) {
        delete object[property]
      }
    }
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