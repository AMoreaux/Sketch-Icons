import MochaJSDelegate from './MochaJSDelegate.js'
import logger from './logger'
import settingsProvider from "../providers/settings";

export default {
  clearSelection,
  getIconNameByNSUrl,
  createLabel,
  getSelectedArtboardsAndSymbols,
  createWebview,
  createDivider,
  runFramework,
  getImageByColor,
  hasMask,
  layerToSvg,
  svgHasStroke,
  convertMSColorToString,
  convertStringToMSColor,
  getBorderColor,
  getRootObject,
  getSizeBetweenIcon,
  buildPrefix
}


/**
 * @name clearSelection
 * @description unselect all
 * @param context
 */
function clearSelection(context) {
  context.api().selectedDocument.selectedLayers.clear()
}

/**
 * @name getIconNameByNSUrl
 * @description get name of icon by NSUrl
 * @param icon {Object} : NSUrl
 * @returns {String}
 */
function getIconNameByNSUrl(icon) {
  return icon.lastPathComponent().split('.')[0]
}

/**
 * @name createLabel
 * @description create label in NSTextField
 * @param name {String}
 * @param x {Number}
 * @param y {Number}
 * @param w {Number}
 * @param h {Number}
 * @param isDescription {Boolean}
 * @returns {Object} : NSTextField
 */
function createLabel(name, x, y, w, h, isDescription) {

  const label = NSTextField.alloc().initWithFrame_(NSMakeRect(x, y, w, h));
  if (isDescription) {
    label.setTextColor(NSColor.colorWithCalibratedRed_green_blue_alpha(0 / 255, 0 / 255, 0 / 255, 0.6));
  }
  label.setEditable_(false);
  label.setSelectable_(false);
  label.setBezeled_(false);
  label.setDrawsBackground_(false);
  label.setFont(NSFont.systemFontOfSize((isDescription) ? 11 : 13));
  label.setStringValue_(name);

  return label;
}

/**
 * @name getSelectedArtboards
 * @description get selected artboards
 * @param context
 * @returns {Array} : MSArtboardGroup
 */
function getSelectedArtboardsAndSymbols(context) {
  let selectedArtboardsAndSymbols = []

  context.selection.forEach(function (layer) {
    let className = String(layer.class())
    if (className !== 'MSArtboardGroup' || className !== 'MSSymbolMaster') {
      layer = layer.parentRoot()
      className = String(layer.class())
    }

    if (selectedArtboardsAndSymbols.indexOf(String(layer.objectID())) === -1 && (className === 'MSArtboardGroup' || className === 'MSSymbolMaster')) {
      selectedArtboardsAndSymbols.push({
        'object': layer,
        'type': className,
        'id': layer.objectID()
      })
    }
  })

  selectedArtboardsAndSymbols = selectedArtboardsAndSymbols.filter((rootElement, index, self) =>
    index === self.findIndex((compareElement) => (
      compareElement.id === rootElement.id
    ))
  )

  return selectedArtboardsAndSymbols
}

/**
 * @name createWebview
 * @param context
 * @param pickerButton
 * @param setColor {function}
 * @return {Object} : WebView
 */
function createWebview(context, pickerButton, setColor) {

  const webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, 220, 300));
  const windowObject = webView.windowScriptObject();
  const delegate = new MochaJSDelegate({
    "webView:didFinishLoadForFrame:": (function (webView, webFrame) {

      logger.log('loaded')
    }),
    "webView:didChangeLocationWithinPageForFrame:": (function (webView, webFrame) {
      const query = windowObject.evaluateWebScript('window.location.hash')
      const color = JSON.parse(decodeURIComponent(query).split('color=')[1])
      color.r = parseInt(color.r) / 255
      color.g = parseInt(color.g) / 255
      color.b = parseInt(color.b) / 255
      color.a = parseFloat(color.a)

      const colorNS = NSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a)
      const colorMS = MSImmutableColor.colorWithNSColor(colorNS)

      pickerButton.setImage(getImageByColor(colorNS, { width: 40, height: 30 }))
      setColor(colorMS)
    })
  })

  webView.setDrawsBackground(false)
  webView.setMainFrameURL_(context.plugin.urlForResourceNamed("webview.html").path());
  webView.setFrameLoadDelegate_(delegate.getClassInstance());
  return webView
}


/**
 * @name createDivider
 * @param frame
 * @return {*}
 */
function createDivider(frame) {
  const divider = NSView.alloc().initWithFrame(frame);

  divider.setWantsLayer(1);
  divider.layer().setBackgroundColor(CGColorCreateGenericRGB(204 / 255, 204 / 255, 204 / 255, 1.0));

  return divider;
}

/**
 * @name runFramework
 * @param context
 * @return {boolean}
 */
function runFramework(context) {

  const mocha = Mocha.sharedRuntime();

  const frameworkName = "SketchIconsFramework";
  const directory = context.scriptPath.stringByDeletingLastPathComponent();

  if (mocha.valueForKey(frameworkName)) {
    return true;
  } else if (mocha.loadFrameworkWithName_inDirectory(frameworkName, directory)) {
    mocha.setValue_forKey_(true, frameworkName);
    return true;
  } else {
    log("❌ loadFramework: `" + frameworkName + "` failed!: " + directory + ". Please define SketchIcons_FrameworkPath if you're trying to @import in a custom plugin");
    return false;
  }
}


/**
 * @name getImageByColor
 * @param color
 * @param colorSize
 * @return {Object} : NSImage
 */
function getImageByColor(color, colorSize = { width: 14, height: 14 }) {
  const size = CGSizeMake(colorSize.width, colorSize.height);
  const image = NSImage.alloc().init()
  image.size = size
  image.lockFocus()
  const colorCell = MSBackgroundColorView.alloc().init()
  colorCell.backgroundColor = color
  colorCell.drawRect(NSMakeRect(0, 0, colorSize.width, colorSize.height))
  image.unlockFocus()

  return image
}

/**
 * @name iconHasColor
 * @param artboard
 * @return {Boolean}
 */
function hasMask(artboard) {
  return !!artboard.firstLayer().hasClippingMask()
}

function layerToSvg(layer) {
  const svgExporter = SketchSVGExporter.alloc().init();
  const svgData = svgExporter.exportLayers([layer.immutableModelObject()]);
  return NSString.alloc().initWithData_encoding(svgData, NSUTF8StringEncoding);
}

function svgHasStroke(rootObject) {
  let hasBorder = false
  rootObject.children().forEach((layer) => {
    if (layer.styledLayer().style().hasEnabledBorder()) {
      hasBorder = true
    }
  })
  return hasBorder
}

function getBorderColor(rootObject) {
  let color;
  const layers = rootObject.children()

  for (let i = 0; i < layers.length; i++) {
    let style = layers[i].styledLayer().style()
    color = style.firstEnabledBorder()
    if (color) break
  }

  return color
}

function convertMSColorToString(colorMS) {
  return JSON.stringify({ r: colorMS.red(), g: colorMS.green(), b: colorMS.blue(), a: colorMS.alpha() })
}

function convertStringToMSColor(string) {
  const color = (typeof string !== 'object') ? string : JSON.parse(string)
  const colorNS = NSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a)

  return MSImmutableColor.colorWithNSColor(colorNS)
}

function getRootObject(context) {
  const result = [];
  context.api().selectedDocument.selectedPage.sketchObject.layers().forEach((layer) => {
    let className = String(layer.class())
    if (className === 'MSArtboardGroup' || className === 'MSSymbolMaster') {
      result.push(layer)
    }
  })

  return result;
}

function getSizeBetweenIcon(rootObjectSize, size) {
  const value = parseInt(size)
  const unit = size.replace(value, '')
  return (unit && unit === '%') ? rootObjectSize + rootObjectSize * (value / 100) : rootObjectSize + value;
}

function buildPrefix(context, rootObjectSize) {
  const settings = settingsProvider.getSettings(context, 'default')
  // console.log('>>>>>>>>>>>', (settings.prefixRootObject.data !== 'null'));
  // console.log('>>>>>>>>>>>', settings.prefixRootObject.data);
  return (settings.prefixRootObject.data !== 'null') ? settings.prefixRootObject.data.replace('$size', rootObjectSize) : '';

}

// function zoomOutOfPage(context){
//   const currentPage = context.document.currentPage()
//   const artboards = [];
//     currentPage.layers().forEach(layer => {
//       artboards.push(layer)
//     })
//   currentPage.changeSelectionBySelectingLayers(artboards);
//
//
//   MSDocument.currentDocument().eventHandlerManager().currentHandler().zoomToSelection()
// }
