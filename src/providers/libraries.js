import logger from "../utils/logger";

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

  if (!lib.title().length()) {
    return colorMenu.setEnabled(false)
  }

  const libraryInstance = lib.representedObject()
  libraryInstance.loadSynchronously()

  const colors = []

  libraryInstance.document().localSymbols().forEach(function(symbol){
    let hasStyle = symbol.layers()[0].style().hasEnabledFill()
    if(hasStyle){
      colors.push({
        color: (hasStyle) ? symbol.layers()[0].style().fills().firstObject().color() : null,
        symbol: symbol
      })
    }
  })

  if(colors.length > 0){
    initColorSelectList(colorMenu, colors);
    colorMenu.setEnabled(true)
  }else {
    colorMenu.setEnabled(false)
  }
}

/**
 * @name initLibsSelectList
 * @description get list of library in NSMenu
 * @param libs  {Array}
 * @param colorMenu {Object} : NSPopUpButton
 * @returns {Object} : NSMenu
 */
function initLibsSelectList(libs, colorMenu) {

  function addListener(item) {
    item.setCOSJSTargetFunction(function (lib) {
      loadColorFromSelectedLib(lib, colorMenu)
    })
  }

  const colorLibsMenu = NSMenu.alloc().init()
  const empty = NSMenuItem.alloc().init()
  empty.title = ""
  addListener(empty)
  colorLibsMenu.addItem(empty)
  libs.forEach(function(lib){
    let item = NSMenuItem.alloc().init()
    item.title = lib.name()
    item.representedObject = lib
    colorLibsMenu.addItem(item)
    addListener(item)
  })

  return colorLibsMenu
}

/**
 * @name initColorSelectList
 * @description get list of colors in NSMenu
 * @param popColorMenu {Object} : NSPopUpMenu
 * @param colors
 * @returns {Object} : NSMenu
 */
function initColorSelectList(popColorMenu, colors) {

  function swatch(color) {
    const size = CGSizeMake(14, 14);
    const image = NSImage.alloc().init()
    image.size = size
    image.lockFocus()
    const colorCell = MSBackgroundColorView.alloc().init()
    colorCell.backgroundColor = color
    colorCell.drawRect(NSMakeRect(0, 0, 14, 14))
    image.unlockFocus()

    return image
  }

  const menu = NSMenu.alloc().init()

  menu.cancelTracking()

  colors.forEach(function(color){
    let item = NSMenuItem.alloc().init()
    item.title = (color.symbol) ? color.symbol.name() : ""
    let colorRGBA = (color.color) ? NSColor.colorWithRed_green_blue_alpha(color.color.red(), color.color.green(), color.color.blue(), color.color.alpha()) : NSColor.colorWithRed_green_blue_alpha(color.red(), color.green(), color.blue(), color.alpha())
    item.representedObject = (color.symbol)  ? color.symbol : colorRGBA
    item.image = swatch(colorRGBA)
    menu.addItem(item)
  })

  popColorMenu.menu = menu
  return popColorMenu
}

