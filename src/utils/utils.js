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
  iconHasColor,
  networkRequest,
  layerToSvg,
  svgHasStroke,
  iconHasBorderColor
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
  let selectedArtboardsAndSymbols = []

  context.selection.some(function (layer) {
    let className = String(layer.class())
    if (className !== 'MSArtboardGroup' || className !== 'MSSymbolMaster') {
      layer = layer.parentRoot()
      className = String(layer.class())
    }

    if (selectedArtboardsAndSymbols.indexOf(String(layer.objectID())) === -1) {
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
 * @name flatten
 * @description flatten array
 * @param list
 * @return {Array}
 */
function flatten(list) {
  return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
}

/**
 * @name getDocumentColors
 * @description return list of document colors
 * @param context
 * @return {Array}
 */
function getDocumentColors(context) {
  return context.document.documentData().assets().colors()
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

      const newColor = MSImmutableColor.colorWithIntegerRed_green_blue_alpha(parseInt(color.r)/255, parseInt(color.g)/255, parseInt(color.b)/255, parseFloat(color.a))
      logger.log(newColor)
      pickerButton.setImage(getImageByColor(NSColor.colorWithRed_green_blue_alpha(
        parseInt(color.r) / 255,
        parseInt(color.g) / 255,
        parseInt(color.b) / 255,
        parseFloat(color.a)), {width: 40, height: 30})
      )
      setColor(newColor)
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
function getImageByColor(color, colorSize = {width: 14, height: 14}) {
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
function iconHasColor(artboard) {
  return !!artboard.firstLayer().hasClippingMask()
}

function layerToSvg(layer) {
  const svgExporter = SketchSVGExporter.alloc().init();
  const svgData = svgExporter.exportLayers([layer.immutableModelObject()]);
  return NSString.alloc().initWithData_encoding(svgData, NSUTF8StringEncoding);
}

function svgHasStroke(artboard){
  let hasBorder = false
  artboard.children().forEach((layer) => {
    if(layer.styledLayer().style().hasEnabledBorder()){
      hasBorder = true
    }
  })
  return hasBorder
}

function iconHasBorderColor(artboard){
  let color;
  const layers = artboard.children()

  for(let i = 0; i < layers.length; i++) {
    let style = layers[i].styledLayer().style()
    color = style.firstEnabledBorder()
    if (color) break
  }

  return color
}

function networkRequest(svg) {
  // var task = NSTask.alloc().init();
  // task.setLaunchPath("/usr/bin/curl");
  // task.setArguments(args);
  // var outputPipe = NSPipe.pipe();
  // task.setStandardOutput(outputPipe);
  // task.launch();
  // var responseData = outputPipe.fileHandleForReading().readDataToEndOfFile();
  // logger.log(responseData)


  // var request = NSMutableURLRequest.alloc().init();
  // request.setHTTPMethod_("POST");
  // request.setURL_(NSURL.URLWithString_('http://localhost:1337/'));
  // request.setHTTPBody(svg)
  // var responseData = NSURLConnection.sendSynchronousRequest_returningResponse_error_(request,null,null);


  // var stringResponse = NSString.alloc().initWithData_encoding_(responseData,NSUTF8StringEncoding);
  // var responseString = NSString.alloc().initWithData_encoding(responseData, NSUTF8StringEncoding);
  // if(!responseString) {
  //   log("Error invoking curl");
  //   log("args:");
  //   log(args);
  //   log("responseString");
  //   log(responseString);
  //   throw "Error communicating with server"
  // }
  return '';
}