import logger from "../utils/logger";
import utils from "../utils/utils"
import {setEnabledColorMenu} from "../modals/modals"

export default {
  getLibs,
  getLibById,
  loadColorFromSelectedLib,
  initLibsSelectList,
  initColorSelectList
}

/**
 * @name getLibs
 * @description get all libraries
 * @returns {Array}
 */
function getLibs() {
  return AppController.sharedInstance().librariesController().userLibraries().slice().map(function (lib) {
    return lib
  })
}

/**
 * @name getLibById
 * @description return library by id
 * @param libraryId
 * @returns {Object} : MSAssetLibrary
 */
function getLibById(libraryId) {
  return AppController.sharedInstance().librariesController().userLibraries().slice().filter(function (lib) {
    return (String(libraryId) === String(lib.libraryID()))
  })[0]
}

/**
 * @name loadColorFromSelectedLib
 * @description get colors form lib selected
 * @param lib
 * @param colorMenu
 * @returns {Array}
 */
function loadColorFromSelectedLib(lib, colorMenu) {
  colorMenu.removeAllItems()

  const libraryInstance = lib.representedObject()
  libraryInstance.loadSynchronously()

  return getColorSymbolsFromDocument(libraryInstance.document())
}

/**
 * @name initLibsSelectList
 * @description get list of library in NSMenu
 * @param libs  {Array}
 * @param colorMenu {Object} : NSPopUpButton
 * @returns {Object} : NSMenu
 */
function initLibsSelectList(context, libs, colorMenu) {

  function addListener(item) {
    item.setCOSJSTargetFunction(function (lib) {
      updateColorMenu(context, lib, colorMenu)
    })
  }

  const colorLibsMenu = NSMenu.alloc().init()
  const currentFile = NSMenuItem.alloc().init()
  currentFile.title = 'Current file'
  addListener(currentFile)
  colorLibsMenu.addItem(currentFile)
  libs.forEach(function(lib){
    let item = NSMenuItem.alloc().init()
    item.title = lib.name()
    item.representedObject = lib
    colorLibsMenu.addItem(item)
    addListener(item)
  })

  updateColorMenu(context, currentFile, colorMenu)

  return colorLibsMenu
}

function updateColorMenu(context, lib, colorMenu){
  let colors = []
  if(String(lib.title()) === 'Current file'){
    colors = getColorSymbolsFromDocument(context.document.documentData())
  }else{
    colors = loadColorFromSelectedLib(lib, colorMenu)
  }
  if(colors.length > 0){
    initColorSelectList(colorMenu, colors);
    setEnabledColorMenu(true)
  }else {
    setEnabledColorMenu(false)
  }
}

/**
 * @name initColorSelectList
 * @description get list of colors in NSMenu
 * @param popColorMenu {Object} : NSPopUpMenu
 * @param colors
 * @returns {Object} : NSMenu
 */
function initColorSelectList(popColorMenu, colors) {

  const menu = NSMenu.alloc().init()

  menu.cancelTracking()

  colors.forEach(function(color){
    let item = NSMenuItem.alloc().init()
    item.title = (color.symbol) ? color.symbol.name() : ""
    let colorRGBA = (color.color) ? NSColor.colorWithRed_green_blue_alpha(color.color.red(), color.color.green(), color.color.blue(), color.color.alpha()) : NSColor.colorWithRed_green_blue_alpha(color.red(), color.green(), color.blue(), color.alpha())
    item.representedObject = (color.symbol)  ? color.symbol : colorRGBA
    item.image = utils.getImageByColor(colorRGBA)
    menu.addItem(item)
  })

  popColorMenu.menu = menu
  return popColorMenu
}

/**
 * @name getColorSymbolsFromCurrentDocument
 * @param document
 * @return {Array}
 */
function getColorSymbolsFromDocument(document){
  const result = []
  let layers;
  document.localSymbols().forEach(function(symbol){
    layers = symbol.layers()

    if(symbol.children().length > 3) {
      return
    }

    if(layers.length === 0 && symbol.backgroundColor()){
      result.push({
        color: symbol.backgroundColor(),
        symbol: symbol
      })
    }
    else if(layers.length === 1 && layers[0].style().hasEnabledFill()){
      result.push({
        color: layers[0].style().fills()[0].color(),
        symbol: symbol
      })
    }
  })

  return result
}