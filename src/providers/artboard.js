// @import './utils/utils.js'
// @import './providers/mask.cocoascript'
// @import './providers/svg.cocoascript'

import utils from '../utils/utils'
import logger from '../utils/logger'
import mask from '../providers/mask'
import svg from '../providers/svg'

export default {
  initImportIcons,
  getPaddingAndSize
}

const artboardParams = {
  position: {
    x: 0,
    y: 0
  },
  size: {
    height: 0,
    width: 0
  }
}

/**
 * @name createArtboard
 * @description set position and size and create artboard
 * @param context {Object} :
 * @param index {Number}
 * @param icon {Object} : NSurl
 * @returns {Object} : MSArtboardGroup
 */
function createArtboard(context, index, icon) {
  if (index % 10 === 0) {
    artboardParams.position.y += artboardParams.size.width * 2
    artboardParams.position.x = artboardParams.size.width
  } else {
    artboardParams.position.x += 2 * artboardParams.size.width
  }
  const newArtboard = MSArtboardGroup.new()
  newArtboard.setName(utils.getIconNameByNSUrl(icon))
  const newArtboardFrame = newArtboard.frame()
  newArtboardFrame.setWidth(artboardParams.size.width)
  newArtboardFrame.setHeight(artboardParams.size.height)
  newArtboardFrame.setX(artboardParams.position.x)
  newArtboardFrame.setY(artboardParams.position.y)
  context.document.currentPage().addLayers([newArtboard])

  return newArtboard
}

/**
 * @name initArtboardsParams
 * @description initialisation for new artboard position
 * @param context
 */
function initArtboardsParams(context) {
  const currentPage = context.api().selectedDocument.selectedPage
  if (currentPage.sketchObject.children().length === 1) {
    artboardParams.position.x = artboardParams.position.y = artboardParams.size.width * 2
  } else {
    const Y = []
    currentPage.sketchObject.layers().some(function(layer){
      Y.push(layer.origin().y)
    })
    artboardParams.position.x = artboardParams.size.width * 2
    artboardParams.position.y = Math.max(...Y)
  }
}

/**
 * @name initImportIcons
 * @description main function to import multiple icons and mask on new artboard
 * @param context {Object}
 * @param params: {Object}
 */
function initImportIcons(context, params) {

  utils.clearSelection(context)
  artboardParams.size.height = artboardParams.size.width = params.artboardSize
  initArtboardsParams(context)

  params.listIcon.forEach((icon, index) => {
    try{
      const newArtboard = createArtboard(context, index, icon)
      const newRootObject = (params.convertSymbol) ? MSSymbolMaster.convertArtboardToSymbol(newArtboard) : newArtboard
      if(String(icon.toString().split('.').pop()) === 'pdf'){
        return svg.addPDF(context, newRootObject, params.iconPadding, params.artboardSize, icon)
      }else{
        const svgData = String(NSString.alloc().initWithContentsOfURL(icon))
        svg.addSVG(context, newRootObject, params.iconPadding, params.artboardSize, svgData, params.withMask, true)
        if (params.withMask) mask.addMask(context, newRootObject, params)
      }
      context.command.setValue_forKey_onLayer(params.iconPadding, "padding", newRootObject)
    }catch (e){
      logger.error(e)
    }
  })
  utils.clearSelection(context)
  context.document.showMessage(`🎉 Tadaaa! 🎉 ${params.listIcon.length} icon${(params.listIcon.length > 1) ? 's' : ''} imported`)
}

/**
 * @name getPaddingAndSize
 * @description get padding and size by artboard
 * @param context
 * @param artboard {Object} : MSArtboardGroup
 * @returns {{iconPadding: Number, artboardSize: Number}}
 */
function getPaddingAndSize(context, artboard){
  return {
    iconPadding: parseInt(context.command.valueForKey_onLayer("padding", artboard)),
    artboardSize: parseInt(artboard.rect().size.width)
  }
}
