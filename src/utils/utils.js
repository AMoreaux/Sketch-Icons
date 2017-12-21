import MochaJSDelegate from './MochaJSDelegate.js'
import logger from './logger'

export default {
  clearSelection,
  getIconNameByNSUrl,
  createLabel,
  getSelectedArtboardsAndSymbols,
  flatten,
  getDocumentColors,
  createWebview,
  createDivider,
  runFramework,
  getImageByColor,
  isArtboardMasked
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
 * @param fontSize {Number}
 * @returns {Object} : NSTextField
 */
function createLabel(name, x, y, w, h, fontSize = 13) {

  const label = NSTextField.alloc().initWithFrame_(NSMakeRect(x, y, w, h));
  label.setEditable_(false);
  label.setSelectable_(false);
  label.setBezeled_(false);
  label.setDrawsBackground_(false);
  label.setFont(NSFont.systemFontOfSize_(fontSize));
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
  const selectedArtboardsAndSymbols = []

  context.selection.forEach(function (layer) {
    let className = String(layer.class())
    if (className !== 'MSArtboardGroup' || className !== 'MSSymbolMaster') {
      layer = layer.parentRoot()
      className = String(layer.class())
    }

    selectedArtboardsAndSymbols.push({
      'object': layer,
      'type': className
    })

  })

  return selectedArtboardsAndSymbols
}

/**
 * @name flatten
 * @description flatten array
 * @param list
 * @return {Array}
 */
function flatten(list) {
  return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
)
  ;
}

/**
 * @name getDocumentColors
 * @param context
 * @return {Array}
 */
function getDocumentColors(context) {
  return context.document.documentData().assets().colors()
}

/**
 * @name createWebview
 * @param context
 * @param handlers
 * @param title
 * @param height
 * @return {WebUI}
 */
function createWebview(context, pickerButton, setColor) {

  const webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, 220, 300));
  const windowObject = webView.windowScriptObject();
  const delegate = new MochaJSDelegate({
    "webView:didFinishLoadForFrame:" : (function(webView, webFrame) {

      logger.log('loaded')
    }),
    "webView:didChangeLocationWithinPageForFrame:" : (function(webView, webFrame) {
      const query = windowObject.evaluateWebScript('window.location.hash')
      const color = JSON.parse(decodeURIComponent(query).split('color=')[1])

      newColor = MSImmutableColor.colorWithSVGString(`rgba(${color.r},${color.g},${color.b},${color.a})`).newMutableCounterpart()
      pickerButton.setImage(getImageByColor(NSColor.colorWithRed_green_blue_alpha(
        parseInt(color.r) / 255,
        parseInt(color.g) / 255,
        parseInt(color.b) / 255,
        parseInt(color.a)), {width: 40, height: 30})
      )
      setColor(newColor)
    })
  })

  webView.setDrawsBackground(false)
  webView.setMainFrameURL_(context.plugin.urlForResourceNamed("webview.html").path());
  webView.setFrameLoadDelegate_(delegate.getClassInstance());
  return webView
  // view.addSubview(webView);
}


/**
 * @name createDivider
 * @param frame
 * @return {*}
 */
function createDivider(frame) {
  const divider = NSView.alloc().initWithFrame(frame);

  divider.setWantsLayer(1);
  divider.layer().setBackgroundColor(CGColorCreateGenericRGB(204/255,204/255,204/255,1.0));

  return divider;
}

function runFramework(context){

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


function getImageByColor(color, colorSize = {width: 14, height: 14}){
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

function isArtboardMasked(artboard) {
  const layers = artboard.layers()
  if (layers.length > 1  && layers[1].isMasked())return true
}