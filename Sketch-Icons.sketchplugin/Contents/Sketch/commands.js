var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _MochaJSDelegate = __webpack_require__(13);

var _MochaJSDelegate2 = _interopRequireDefault(_MochaJSDelegate);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _settings = __webpack_require__(2);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  clearSelection: clearSelection,
  getIconNameByNSUrl: getIconNameByNSUrl,
  createLabel: createLabel,
  getSelectedArtboardsAndSymbols: getSelectedArtboardsAndSymbols,
  createWebview: createWebview,
  createDivider: createDivider,
  runFramework: runFramework,
  getImageByColor: getImageByColor,
  hasMask: hasMask,
  layerToSvg: layerToSvg,
  svgHasStroke: svgHasStroke,
  convertMSColorToString: convertMSColorToString,
  convertStringToMSColor: convertStringToMSColor,
  getBorderColor: getBorderColor,
  getRootObject: getRootObject,
  getSizeBetweenIcon: getSizeBetweenIcon,
  buildPrefix: buildPrefix

  /**
   * @name clearSelection
   * @description unselect all
   * @param context
   */
};
function clearSelection(context) {
  context.api().selectedDocument.selectedLayers.clear();
}

/**
 * @name getIconNameByNSUrl
 * @description get name of icon by NSUrl
 * @param icon {Object} : NSUrl
 * @returns {String}
 */
function getIconNameByNSUrl(icon) {
  return icon.lastPathComponent().split('.')[0];
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

  var label = NSTextField.alloc().initWithFrame_(NSMakeRect(x, y, w, h));
  if (isDescription) {
    label.setTextColor(NSColor.colorWithCalibratedRed_green_blue_alpha(0 / 255, 0 / 255, 0 / 255, 0.6));
  }
  label.setEditable_(false);
  label.setSelectable_(false);
  label.setBezeled_(false);
  label.setDrawsBackground_(false);
  label.setFont(NSFont.systemFontOfSize(isDescription ? 11 : 13));
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
  var selectedArtboardsAndSymbols = [];

  context.selection.forEach(function (layer) {
    var className = String(layer['class']());
    if (className !== 'MSArtboardGroup' || className !== 'MSSymbolMaster') {
      layer = layer.parentRoot();
      className = String(layer['class']());
    }

    if (selectedArtboardsAndSymbols.indexOf(String(layer.objectID())) === -1 && (className === 'MSArtboardGroup' || className === 'MSSymbolMaster')) {
      selectedArtboardsAndSymbols.push({
        'object': layer,
        'type': className,
        'id': layer.objectID()
      });
    }
  });

  selectedArtboardsAndSymbols = selectedArtboardsAndSymbols.filter(function (rootElement, index, self) {
    return index === self.findIndex(function (compareElement) {
      return compareElement.id === rootElement.id;
    });
  });

  return selectedArtboardsAndSymbols;
}

/**
 * @name createWebview
 * @param context
 * @param pickerButton
 * @param setColor {function}
 * @return {Object} : WebView
 */
function createWebview(context, pickerButton, setColor) {

  var webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, 220, 300));
  var windowObject = webView.windowScriptObject();
  var delegate = new _MochaJSDelegate2['default']({
    "webView:didFinishLoadForFrame:": function () {
      function webViewDidFinishLoadForFrame(webView, webFrame) {

        _logger2['default'].log('loaded');
      }

      return webViewDidFinishLoadForFrame;
    }(),
    "webView:didChangeLocationWithinPageForFrame:": function () {
      function webViewDidChangeLocationWithinPageForFrame(webView, webFrame) {
        var query = windowObject.evaluateWebScript('window.location.hash');
        var color = JSON.parse(decodeURIComponent(query).split('color=')[1]);
        color.r = parseInt(color.r) / 255;
        color.g = parseInt(color.g) / 255;
        color.b = parseInt(color.b) / 255;
        color.a = parseFloat(color.a);

        var colorNS = NSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a);
        var colorMS = MSImmutableColor.colorWithNSColor(colorNS);

        pickerButton.setImage(getImageByColor(colorNS, { width: 40, height: 30 }));
        setColor(colorMS);
      }

      return webViewDidChangeLocationWithinPageForFrame;
    }()
  });

  webView.setDrawsBackground(false);
  webView.setMainFrameURL_(context.plugin.urlForResourceNamed("webview.html").path());
  webView.setFrameLoadDelegate_(delegate.getClassInstance());
  return webView;
}

/**
 * @name createDivider
 * @param frame
 * @return {*}
 */
function createDivider(frame) {
  var divider = NSView.alloc().initWithFrame(frame);

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

  var mocha = Mocha.sharedRuntime();

  var frameworkName = "SketchIconsFramework";
  var directory = context.scriptPath.stringByDeletingLastPathComponent();

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
function getImageByColor(color) {
  var colorSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { width: 14, height: 14 };

  var size = CGSizeMake(colorSize.width, colorSize.height);
  var image = NSImage.alloc().init();
  image.size = size;
  image.lockFocus();
  var colorCell = MSBackgroundColorView.alloc().init();
  colorCell.backgroundColor = color;
  colorCell.drawRect(NSMakeRect(0, 0, colorSize.width, colorSize.height));
  image.unlockFocus();

  return image;
}

/**
 * @name iconHasColor
 * @param artboard
 * @return {Boolean}
 */
function hasMask(artboard) {
  return !!artboard.firstLayer().hasClippingMask();
}

function layerToSvg(layer) {
  var svgExporter = SketchSVGExporter.alloc().init();
  var svgData = svgExporter.exportLayers([layer.immutableModelObject()]);
  return NSString.alloc().initWithData_encoding(svgData, NSUTF8StringEncoding);
}

function svgHasStroke(rootObject) {
  var hasBorder = false;
  rootObject.children().forEach(function (layer) {
    if (layer.styledLayer().style().hasEnabledBorder()) {
      hasBorder = true;
    }
  });

  return hasBorder;
}

function getBorderColor(rootObject) {
  var color = void 0;
  var layers = rootObject.children();

  for (var i = 0; i < layers.length; i++) {
    var style = layers[i].styledLayer().style();
    color = style.firstEnabledBorder();
    if (color) break;
  }

  return color;
}

function convertMSColorToString(colorMS) {
  return JSON.stringify({ r: colorMS.red(), g: colorMS.green(), b: colorMS.blue(), a: colorMS.alpha() });
}

function convertStringToMSColor(string) {
  var color = (typeof string === 'undefined' ? 'undefined' : _typeof(string)) !== 'object' ? string : JSON.parse(string);
  var colorNS = NSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a);

  return MSImmutableColor.colorWithNSColor(colorNS);
}

function getRootObject(context) {
  var result = [];
  context.api().selectedDocument.selectedPage.sketchObject.layers().forEach(function (layer) {
    var className = String(layer['class']());
    if (className === 'MSArtboardGroup' || className === 'MSSymbolMaster') {
      result.push(layer);
    }
  });

  return result;
}

function getSizeBetweenIcon(rootObjectSize, size) {
  var value = parseInt(size);
  var unit = size.replace(value, '');
  return unit && unit === '%' ? rootObjectSize + rootObjectSize * (value / 100) : rootObjectSize + value;
}

function buildPrefix(context, rootObjectSize) {
  var settings = _settings2['default'].getSettings(context, 'default');
  // console.log('>>>>>>>>>>>', (settings.prefixRootObject.data !== 'null'));
  // console.log('>>>>>>>>>>>', settings.prefixRootObject.data);
  return settings.prefixRootObject.data !== 'null' ? settings.prefixRootObject.data.replace('$size', rootObjectSize) : '';
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function () {
  function _log(message) {
    log(message);
  }

  function debug(message) {
    log('DEBUG: ' + message);
  }

  function info(message) {
    log('INFO: ' + message);
  }

  function warn(message) {
    log('WARN: ' + message);
  }

  function error(message) {
    log('ERROR: ' + message);
  }

  return {
    log: _log,
    debug: debug,
    info: info,
    warn: warn,
    error: error
  };
}();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = {
  registerSettings: registerSettings,
  getSettings: getSettings,
  resetSettings: resetSettings,
  hasValue: hasValue
};


var LIST_SETTINGS_FIELDS = [
// {name: 'artboardSize', defaultValue: 24},
// {name: 'iconPadding', defaultValue: 4},
{ name: 'presets', 'default': '', placeholder: '24-4, 48-8...' },
// {name: 'modalReplaceIcon', defaultValue: false},
// {name: 'viewBoxParams', defaultValue: false},

{ name: 'convertStroke', 'default': '0', placeholder: '0' },
// {name: 'otherSize', defaultValue: true},
// {name: 'otherSizeParams', defaultValue: 48},
{ name: 'iconsByLine', 'default': '10', placeholder: '10' }, { name: 'marginBetweenRootObject', 'default': '100%', placeholder: '100%' }, { name: 'prefixRootObject', 'default': '', placeholder: 'icons/$size/...' }];

function registerSettings(context, params) {

  LIST_SETTINGS_FIELDS.forEach(function (field) {
    NSUserDefaults.standardUserDefaults().setObject_forKey(params[field.name], field.name);
    context.command.setValue_forKey_onDocument(params[field.name], field.name, context.document.documentData());
  });
}

function resetSettings(context) {
  LIST_SETTINGS_FIELDS.forEach(function (field) {
    context.command.setValue_forKey_onDocument(null, field.name, context.document.documentData());
  });
}

function getSettings(context, fallbackValue) {

  var result = {};

  LIST_SETTINGS_FIELDS.forEach(function (field) {

    result[field.name] = {
      // 'value': context.command.valueForKey_onDocument(field.name, context.document.documentData()) || NSUserDefaults.standardUserDefaults().objectForKey(field.name),
      'value': NSUserDefaults.standardUserDefaults().objectForKey(field.name),
      'default': field['default'],
      'placeholder': field.placeholder
    };

    if (hasValue(result[field.name])) {
      result[field.name].data = String(result[field.name].value);
    } else {
      result[field.name].data = String(result[field.name][fallbackValue]);
    }
  });

  return result;
}

function hasValue(setting) {
  return !(!setting.value || String(setting.value) === 'null' || String(setting.value).length === 0);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _svg = __webpack_require__(4);

var _svg2 = _interopRequireDefault(_svg);

var _libraries = __webpack_require__(5);

var _libraries2 = _interopRequireDefault(_libraries);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _switchV3ToV = __webpack_require__(21);

var _switchV3ToV2 = _interopRequireDefault(_switchV3ToV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  initAddMaskOnSelectedArtboards: initAddMaskOnSelectedArtboards,
  addColor: addColor,
  removeMask: removeMask,
  getMaskPropertiesFromArtboard: getMaskPropertiesFromArtboard,
  registerMask: registerMask

  /**
   * @name initAddMaskOnSelectedArtboards
   * @description main function to add mask on selected artboards
   * @param context {Object}
   * @param params {Object}
   * @param rootObjects {Array} : MSArtboardGroup
   */
};
function initAddMaskOnSelectedArtboards(context, params, rootObjects) {
  rootObjects.forEach(async function (rootObject) {
    try {
      if (_utils2['default'].hasMask(rootObject.object) && !_utils2['default'].svgHasStroke(rootObject.object)) removeMask(context, rootObject.object);
      await addColor(context, rootObject.object, params);
    } catch (e) {
      console.log('>>>>>>>>>>>', e);
    }
  });
  _utils2['default'].clearSelection(context);
}

/**
 * @name addColor
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param rootObject {Object} : MSArtboardGroup && MSSymbolMaster
 * @param params {Object}
 */
function addColor(context, rootObject, params) {

  if (String(rootObject.firstLayer()['class']()) === 'MSBitMapLayer') return;

  if (_utils2['default'].svgHasStroke(rootObject)) {
    applyColor(rootObject, params);
  } else {
    if (_utils2['default'].hasMask(rootObject)) removeMask(context, rootObject);
    _svg2['default'].cleanSvg(rootObject);
    applyMask(context, rootObject, params);
  }

  return registerMask(context, rootObject, params);
}

/**
 * @name applyColor
 * @description apply border color on svg with stroke
 * @param rootObject
 * @param params
 */
function applyColor(rootObject, params) {
  var color = params.colorPicker ? params.colorPicker : _libraries2['default'].getColorFromSymbol(params.color).color;
  rootObject.children().forEach(function (layer) {
    if (layer.styledLayer().style().hasEnabledBorder()) {
      var style = layer.styledLayer().style();
      style.enabledBorders().forEach(function (border) {
        border.color = color;
      });
    }
  });
}

/**
 * @name removeMask
 * @description remove all mask from artboard
 * @param context
 * @param rootObject {Object} : MSArtboardGroup
 */
function removeMask(context, rootObject) {

  context.command.setValue_forKey_onLayer(null, "colorLib", rootObject);
  context.command.setValue_forKey_onLayer(null, "color", rootObject);
  context.command.setValue_forKey_onLayer(null, "colorPicker", rootObject);

  if (_utils2['default'].svgHasStroke(rootObject)) {
    return applyColor(rootObject, { colorPicker: MSImmutableColor.blackColor() });
  }

  var iconLayer = rootObject.firstLayer();

  if (rootObject.layers().count() > 1 && iconLayer.hasClippingMask()) {
    iconLayer.hasClippingMask = false;
    iconLayer.clippingMaskMode = 1;
    var style = rootObject.firstLayer().style();
    var fills = style.fills();
    var fillColor = fills.count() > 0 ? style.fills()[0].color() : MSColor.blackColor();
    style.removeAllStyleFills();
    style.addStylePartOfType(0).color = fillColor;
    rootObject.lastLayer().removeFromParent();
  }
}

/**
 * @name registerMask
 * @description register properties of mask in artboard metadata
 * @param context
 * @param rootObject
 * @param params
 */
function registerMask(context, rootObject, params) {
  if (params.color) {
    var libraryId = params.colorLib ? params.colorLib.libraryID() : null;
    var colorId = typeof params.color === 'string' ? params.color : params.color.symbolID();

    context.command.setValue_forKey_onLayer(libraryId, "colorLib", rootObject);
    context.command.setValue_forKey_onLayer(colorId, "color", rootObject);
    context.command.setValue_forKey_onLayer(null, "colorPicker", rootObject);
  } else if (params.colorPicker) {
    context.command.setValue_forKey_onLayer(_utils2['default'].convertMSColorToString(params.colorPicker), "colorPicker", rootObject);
    context.command.setValue_forKey_onLayer(null, "colorLib", rootObject);
    context.command.setValue_forKey_onLayer(null, "color", rootObject);
  }
}

function getMaskPropertiesFromArtboard(context, rootObject) {

  var params = getColorParams(context, rootObject);

  var maskLayer = rootObject.firstLayer();
  if (!params.colorLibraryId && !params.colorSymbolId && !params.colorString && maskLayer && maskLayer.hasClippingMask()) {
    _switchV3ToV2['default'].switchToV4(context, rootObject);
    params = getColorParams(context, rootObject);
  }

  if (!params.colorLibraryId && params.colorSymbolId) {
    params.colorSymbol = _libraries2['default'].getSymbolFromDocument(context.document.documentData(), params.colorSymbolId);
  } else if (params.colorLibraryId) {
    params.colorLibrary = _libraries2['default'].getLibById(params.colorLibraryId);
    _libraries2['default'].loadLibrary(params.colorLibrary);
    params.colorSymbol = _libraries2['default'].getSymbolFromDocument(params.colorLibrary.document(), params.colorSymbolId);
  }

  params.colorPicker = params.colorString ? _utils2['default'].convertStringToMSColor(params.colorString) : null;

  var result = {
    colorLib: params.colorLibraryId ? params.colorLibrary : null,
    color: params.colorSymbolId ? params.colorSymbol : null,
    colorPicker: params.colorPicker
  };

  return !result.colorLib && !result.color && !result.colorPicker ? {} : result;
}

/**
 * @name getColorParams
 * @param context
 * @param rootObject
 * @returns {{colorLibraryId: *, colorSymbolId: *, colorString: *}}
 */
function getColorParams(context, rootObject) {
  return {
    colorLibraryId: context.command.valueForKey_onLayer("colorLib", rootObject),
    colorSymbolId: context.command.valueForKey_onLayer("color", rootObject),
    colorString: context.command.valueForKey_onLayer("colorPicker", rootObject)
  };
}

/**
 * @name createMaskFromNean
 * @param context
 * @param rootObject
 * @param color
 * @return {Object} : MSShapeGroup
 */
function createMaskFromNean(context, rootObject, color) {
  var currentRootObjectSize = rootObject.rect();

  var mask = MSShapeGroup.shapeWithRect({
    origin: { x: 0, y: 0 },
    size: { width: currentRootObjectSize.size.width, height: currentRootObjectSize.size.height }
  });

  var fill = mask.style().addStylePartOfType(0);
  fill.color = color;

  return mask;
}

/**
 * @name createMask
 * @description add mask from symbol master colors library to one artboard
 * @param context {Object}
 * @param colorSymbolMaster {Object}
 * @param colorLibrary {Object} : MSAssetLibrary
 * @return symbol {Object} : MSSymbolInstance
 */
function getMaskSymbolFromLib(context, colorSymbolMaster, colorLibrary) {
  _utils2['default'].clearSelection(context);
  var librairiesController = AppController.sharedInstance().librariesController();
  var symbolMaster = colorLibrary ? librairiesController.importForeignSymbol_fromLibrary_intoDocument(colorSymbolMaster, colorLibrary, context.document.documentData()).symbolMaster() : colorSymbolMaster;
  return symbolMaster.newSymbolInstance();
}

/**
 * @name applyMask
 * @param context
 * @param rootObject {Object} : MSArtboardGroup && MSSymbolMaster
 * @param params
 */
function applyMask(context, rootObject, params) {

  var mask = void 0;

  if (params.color) {
    mask = getMaskSymbolFromLib(context, params.color, params.colorLib);
  } else if (params.colorPicker) {
    mask = createMaskFromNean(context, rootObject, params.colorPicker);
  }

  var currentArtboardSize = rootObject.rect();
  mask.setHeightRespectingProportions(currentArtboardSize.size.height);
  mask.setWidthRespectingProportions(currentArtboardSize.size.width);
  mask.setName('🎨 color');
  rootObject.firstLayer().style().disableAllFills();
  rootObject.addLayers([mask]);
  var iconLayer = rootObject.firstLayer();
  iconLayer.hasClippingMask = true;
  iconLayer.clippingMaskMode = 0;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mask = __webpack_require__(3);

var _mask2 = _interopRequireDefault(_mask);

var _artboard = __webpack_require__(7);

var _artboard2 = _interopRequireDefault(_artboard);

var _settings = __webpack_require__(2);

var _settings2 = _interopRequireDefault(_settings);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  initUpdateIconsSelectedArtboards: initUpdateIconsSelectedArtboards,
  addSVG: addSVG,
  addPDF: addPDF,
  addBITMAP: addBITMAP,
  cleanSvg: cleanSvg
};

/**
 * @name initUpdateIconsSelectedArtboards
 * @description main function to update multiple icons on selected artboard
 * @param context
 * @param params {Object}
 * @param rootObjects {Array} : MSArtboardGroup && MSSymbolMaster
 */

function initUpdateIconsSelectedArtboards(context, rootObjects, params) {
  rootObjects.forEach(function (rootObject, index) {

    var iconParams = Object.assign({}, _mask2['default'].getMaskPropertiesFromArtboard(context, rootObject.object), _artboard2['default'].getPaddingAndSize(context, rootObject.object), params);
    var replaceBy = params.listIcon.length === 1 ? params.listIcon[0] : params.listIcon[index];

    var svgData = String(NSString.alloc().initWithContentsOfURL(replaceBy));
    iconParams.withMask = !!(iconParams.colorLib || iconParams.colorPicker || iconParams.color);

    rootObject.object.removeAllLayers();

    addSVG(context, rootObject.object, iconParams, String(svgData), true);
    rootObject.object.setName(_utils2['default'].getIconNameByNSUrl(replaceBy));
    if (iconParams.withMask) _mask2['default'].addColor(context, rootObject.object, iconParams);
  });

  _utils2['default'].clearSelection(context);

  return rootObjects.length;
}

/**
 * @name addSVG
 * @description  add svg on specific artboard
 * @param context {Object}
 * @param rootObject {Object} : MSArtboardGroup
 * @param params {Object}
 * @param svgData {String}
 * @param withResize {Boolean}
 */
function addSVG(context, rootObject, params, svgData, withResize) {
  var viewBox = void 0;

  var settingsParams = _settings2['default'].getSettings(context, 'default');

  svgData = NSString.stringWithString(svgData);

  viewBox = getViewBox(svgData);

  if (withResize) svgData = addRectToResize(svgData, viewBox);
  var svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(svgData.dataUsingEncoding(NSUTF8StringEncoding));
  var svgLayer = svgImporter.importAsLayer();

  removeTxt(svgLayer);

  rootObject.addLayer(svgLayer);

  removeNoFillChildren(rootObject);

  if (_utils2['default'].svgHasStroke(rootObject) && settingsParams.convertStroke.data === '1') convertStrokeToFill(rootObject);

  if (withResize) resizeIcon(rootObject, params.iconPadding);
  if (withResize) removeDeleteMeRect(rootObject);

  center(params.artboardSize, rootObject.firstLayer());
}

function addPDF(context, rootObject, params, icon) {
  var pdfImporter = MSPDFImporter.pdfImporter();
  pdfImporter.prepareToImportFromURL(icon);
  var pdfLayer = pdfImporter.importAsLayer();
  rootObject.addLayer(pdfLayer);
  resizeIcon(rootObject, params.iconPadding);
  center(params.artboardSize, rootObject.firstLayer());
  rootObject.firstLayer().setName(rootObject.name());
}

function addBITMAP(context, rootObject, params, icon) {

  if (String(icon['class']()) === 'MSBitmapLayer') {
    MSLayerGroup.moveLayers_intoGroup([icon], rootObject);
  } else {
    rootObject.addLayer(MSBitmapLayer.bitmapLayerWithImageFromPath(icon));
  }

  resizeIcon(rootObject, params.iconPadding);
  center(params.artboardSize, rootObject.firstLayer());
  rootObject.firstLayer().setName(rootObject.name());
}

/**
 * @name addRectToResize
 * @description add rect to keep proportion on resize
 * @param svgString
 * @param viewBox
 * @returns {String}
 */
function addRectToResize(svgString, viewBox) {
  var addrect = '<rect width="' + String(viewBox.width) + '" height="' + String(viewBox.height) + '" id="delete-me"/></svg>';
  return NSString.stringWithString(svgString.replace('</svg>', addrect));
}

/**
 * @name cleanSvg
 * @description main function which used sketch properties to convert icon in one path
 * @param rootObject
 */
function cleanSvg(rootObject) {
  unGroup(rootObject);
  rootObject.firstLayer().setName(rootObject.name());
  removeNoFillLayer(rootObject);
  mergeLayer(rootObject);
  rootObject.firstLayer().resizeToFitChildrenWithOption(1);
}

/**
 * @name center
 * @description center svg in artboard
 * @param artboardSize
 * @param svgLayer
 */
function center(artboardSize, svgLayer) {
  var shapeGroupWidth = svgLayer.frame().width();
  var shapeGroupHeight = svgLayer.frame().height();
  svgLayer.frame().setX((artboardSize - shapeGroupWidth) / 2);
  svgLayer.frame().setY((artboardSize - shapeGroupHeight) / 2);
}

/**
 * @name resizeIcon
 * @description resize layer by artboard
 * @param rootObject {Object}
 * @param iconPadding {Number}
 */
function resizeIcon(rootObject, iconPadding) {

  var svgLayer = rootObject.firstLayer();
  var svgLayerFrame = svgLayer.frame();

  var currentArtboardRect = rootObject.rect();
  var currentArtboardSize = {
    width: parseInt(currentArtboardRect.size.width),
    height: parseInt(currentArtboardRect.size.height)
  };

  var width = svgLayerFrame.width();
  var height = svgLayerFrame.height();

  svgLayerFrame.constrainProportions = true;

  if (width >= height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding);
  } else {
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding);
  }
}

/**
 * @name removeTxt
 * @description remove text form svg
 * @param svgLayer {Object}
 */
function removeTxt(svgLayer) {
  var scope = svgLayer.children(),
      predicateTextLayers = NSPredicate.predicateWithFormat('(className == %@)', 'MSTextLayer');

  var layers = scope.filteredArrayUsingPredicate(predicateTextLayers);

  var loop = layers.objectEnumerator();
  var layer = void 0;
  while (layer = loop.nextObject()) {
    layer.removeFromParent();
  }
}

/**
 * @name removeUnecessaryGroup
 * @description ungroup all group
 * @param svgLayer
 */
function unGroup(svgLayer) {
  var scope = svgLayer.children(),
      predicateTextLayers = NSPredicate.predicateWithFormat('(className == %@)', 'MSLayerGroup');
  var layers = scope.filteredArrayUsingPredicate(predicateTextLayers);

  var loop = layers.objectEnumerator();
  var layer = void 0;
  while (layer = loop.nextObject()) {
    layer.ungroup();
  }
}

/**
 * @name removeDeleteMeRect
 * @description remove rect used to keep proportion on resize
 * @param rootObject
 * @returns {*}
 */
function removeDeleteMeRect(rootObject) {
  var scope = rootObject.children(),
      predicateTextLayers = NSPredicate.predicateWithFormat('(name == %@)', 'delete-me');
  var layers = scope.filteredArrayUsingPredicate(predicateTextLayers);

  if (!layers.length) return rootObject.firstLayer().lastLayer().removeFromParent();

  var loop = layers.objectEnumerator();
  var layer = void 0;
  while (layer = loop.nextObject()) {
    layer.removeFromParent();
  }
}

/**
 * @description remove transparent layers
 * @name removeNoFillLayer
 * @param rootObject
 */
function removeNoFillLayer(rootObject) {
  var indexes = NSMutableIndexSet.indexSet();
  rootObject.layers().forEach(function (layer, index) {
    if (!layer.style().hasEnabledFill() && !layer.style().hasEnabledBorder()) indexes.addIndex(index);
  });
  rootObject.removeLayersAtIndexes(indexes);
}

/**
 * @description remove transparent layers
 * @name removeNoFillLayer
 * @param rootObject
 */
function removeNoFillChildren(rootObject) {
  var toDelete = [];
  rootObject.firstLayer().children().forEach(function (layer) {
    var style = layer.styledLayer().style();
    if (style.hasEnabledFill() && style.contextSettings().opacity() === 0) {
      toDelete.push(layer);
    }
  });

  toDelete.forEach(function (layer) {
    layer.removeFromParent();
  });
}

/**
 * @name mergeLayer
 * @description merge all path in one path
 * @param rootObject
 */
function mergeLayer(rootObject) {
  var layers = rootObject.layers();

  if (layers.length > 1) {
    for (var i = 0; i <= layers.length - 1; i++) {
      layers[1].moveToLayer_beforeLayer(layers[0], layers[1]);
    }
  }

  if (rootObject.layers().length > 1) return mergeLayer(rootObject);

  rootObject.children().forEach(function (children) {
    if (children.booleanOperationCanBeReset()) children.setBooleanOperation(-1);
  });

  layers[0].resizeToFitChildrenWithOption(0);
  layers[0].setName(rootObject.name());
}

/**
 * @name getViewBox
 * @description return values of viewbox
 * @param svgData
 * @returns {{width: number, height: number}}
 */
function getViewBox(svgData) {

  var viewBox = svgData.match(/viewBox="(.*?)"/gm);

  var size = void 0;
  var result = void 0;
  if (Array.isArray(viewBox)) {
    size = viewBox[0].match(/[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g);
    result = { width: parseFloat(size[2]), height: parseFloat(size[3]) };
  }

  return result;
}

function convertStrokeToFill(rootObject) {

  rootObject.children().forEach(function (layer) {
    if (layer.canConvertToOutlines() && String(layer.name()) !== 'delete-me') {
      layer.layersByConvertingToOutlines();
    }
  });

  rootObject.children().forEach(function (layer) {
    layer.styledLayer().style().disableAllBorders();
  });
}

// function setThicknessProportionnally(svgLayer, diagContainer, viewBox) {
//
//   const diagViewbox = Math.sqrt(Math.pow(viewBox.width, 2) + Math.pow(viewBox.height, 2))
//   const diagArtboard = Math.sqrt(Math.pow(diagContainer, 2) * 2)
//   const ratio = diagArtboard / diagViewbox
//
//   svgLayer.children().forEach((layer) => {
//     if (layer.styledLayer().style().hasEnabledBorder() && String(layer.class()) === 'MSShapePathLayer') {
//       const style = layer.styledLayer().style()
//       const thickness = style.firstEnabledBorder().thickness()
//       style.firstEnabledBorder().thickness = Math.round(thickness * ratio)
//     }
//   })
// }

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _modals = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = {
  getLibById: getLibById,
  initLibsSelectList: initLibsSelectList,
  getColorFromSymbol: getColorFromSymbol,
  getSymbolFromDocument: getSymbolFromDocument,
  loadLibrary: loadLibrary

  /**
   * @name getLibById
   * @description return library by id
   * @param libraryId
   * @returns {Object} : MSAssetLibrary
   */
};
function getLibById(libraryId) {

  var library = void 0,
      availableLibraries = AppController.sharedInstance().librariesController().availableLibraries();

  for (var i = 0; i < availableLibraries.length; i++) {
    if (String(libraryId) === String(availableLibraries[i].libraryID())) {
      library = availableLibraries[i];
      break;
    }
  }

  return library;
}

/**
 * @name loadColorFromSelectedLib
 * @description get colors form library selected
 * @param library
 * @param colorMenu
 * @returns {Array}
 */
function loadColorFromSelectedLib(library, colorMenu) {

  colorMenu.removeAllItems();
  library = library.representedObject();

  return getColorSymbolsFromDocument(library.document());
}

function loadLibrary(library) {
  return library.loadSynchronously();
}

/**
 * @name initLibsSelectList
 * @description get list of library in NSMenu
 * @param context
 * @param libraries  {Array}
 * @param colorMenu {Object} : NSPopUpButton
 * @returns {Object} : NSMenu
 */
function initLibsSelectList(context, libraries, colorMenu) {

  function addListener(item) {
    item.setCOSJSTargetFunction(function (libraryItem) {
      updateColorMenu(context, libraryItem, colorMenu);
    });
  }

  var colorLibsMenu = NSMenu.alloc().init();
  var currentDocument = NSMenuItem.alloc().init();
  currentDocument.title = 'Current file';
  addListener(currentDocument);
  colorLibsMenu.addItem(currentDocument);
  libraries.forEach(function (library) {
    var item = NSMenuItem.alloc().init();
    item.title = library.name();
    item.representedObject = library;
    colorLibsMenu.addItem(item);
    addListener(item);
  });

  updateColorMenu(context, currentDocument, colorMenu);

  return colorLibsMenu;
}

function updateColorMenu(context, libraryItem, colorMenu) {
  var colors = [];
  if (!libraryItem.representedObject()) {
    colors = getColorSymbolsFromDocument(context.document.documentData());
  } else {
    colors = loadColorFromSelectedLib(libraryItem, colorMenu);
  }
  if (colors.length > 0) {
    initColorSelectList(colorMenu, colors);
    (0, _modals.setEnabledColorMenu)(true);
  } else {
    (0, _modals.setEnabledColorMenu)(false);
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

  var menu = NSMenu.alloc().init();

  menu.cancelTracking();

  colors.forEach(function (color) {
    var item = NSMenuItem.alloc().init();
    item.title = color.symbol ? color.symbol.name() : "";
    var colorRGBA = color.color ? NSColor.colorWithRed_green_blue_alpha(color.color.red(), color.color.green(), color.color.blue(), color.color.alpha()) : NSColor.colorWithRed_green_blue_alpha(color.red(), color.green(), color.blue(), color.alpha());
    item.representedObject = color.symbol ? color.symbol : colorRGBA;
    item.image = _utils2["default"].getImageByColor(colorRGBA);
    menu.addItem(item);
  });

  popColorMenu.menu = menu;
  return popColorMenu;
}

/**
 * @name getColorSymbolsFromDocument
 * @param document
 * @return {Array}
 */
function getColorSymbolsFromDocument(document) {
  var result = [];

  document.localSymbols().forEach(function (symbol) {
    var color = getColorFromSymbol(symbol);
    if (color) result.push(color);
  });

  return result;
}

/**
 * @name getSymbolFromDocument
 * @param document
 * @param symbolId
 * @return {*}
 */
function getSymbolFromDocument(document, symbolId) {

  var symbol = void 0,
      localSymbols = document.localSymbols();

  for (var i = 0; i < localSymbols.length; i++) {
    if (String(localSymbols[i].symbolID()) === String(symbolId)) {
      symbol = localSymbols[i];
      break;
    }
  }

  return symbol;
}

/**
 * @name getColorFromSymbol
 * @param symbol
 * @return {*}
 */
function getColorFromSymbol(symbol) {
  var layers = symbol.layers();
  var result = void 0;

  if (layers.length === 0 && symbol.backgroundColor()) {
    result = {
      color: symbol.backgroundColor(),
      symbol: symbol
    };
  } else if (layers.length === 1 && layers[0].children().length === 2 && layers[0].style().hasEnabledFill()) {

    result = {
      color: layers[0].style().fills()[0].color(),
      symbol: symbol
    };
  }
  return result;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constructBase = exports.maskModal = exports.importModal = exports.setEnabledColorMenu = undefined;

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _libraries = __webpack_require__(5);

var _libraries2 = _interopRequireDefault(_libraries);

var _settings = __webpack_require__(2);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var disabledColor = NSColor.colorWithCalibratedRed_green_blue_alpha(170 / 255, 170 / 255, 170 / 255, 1);

exports.setEnabledColorMenu = setEnabledColorMenu;
exports.importModal = importModal;
exports.maskModal = maskModal;
exports.constructBase = constructBase;


function maskModal(context) {

  this.modalParams = {
    messageText: 'Configure your color mask',
    informativeText: 'Select your library and choose a color to apply as mask. Your layers will all be combined.',
    height: 160,
    width: 300,
    lineHeight: 35
  };

  this.coeffCurrentHeight = 0;
  this.isLibrarySource = true;
  this.adjustHeight = 0;

  constructBase();

  makeMaskRadioButtonParams();
  makeMaskLibraryParams(context);
  makeMaskColorPickerParams(context);

  var result = {
    button: this.modal.runModal()
  };

  if (this.isLibrarySource) {
    var colorMenu = this.colorsMenuParams.selectedItem();
    result.color = colorMenu ? this.colorsMenuParams.representedObject() : null;

    var colorLib = this.colorLibsMenuParams.selectedItem();
    result.colorLib = colorLib ? this.colorLibsMenuParams.representedObject() : null;
  } else {
    result.colorPicker = this.colorPickerColor;
  }

  return result;
}

function importModal(context) {

  var usePresets = void 0;
  this.settingsValues = _settings2['default'].getSettings(context, 'default');

  this.modalParams = {
    messageText: 'Configure your import',
    informativeText: 'Your icons will be arranged in artboards. Set size and padding of your artboards.',
    width: 300,
    lineHeight: 35
  };

  if (_settings2['default'].hasValue(this.settingsValues.presets)) {
    this.modalParams.height = 300 + this.settingsValues.presets.data.split(',').length * 30;
    usePresets = true;
  } else {
    this.modalParams.height = 300;
    usePresets = false;
  }

  this.modalParams.height = _settings2['default'].hasValue(this.settingsValues.presets) ? 300 + this.settingsValues.presets.data.split(',').length * 30 : 300;

  this.coeffCurrentHeight = 0;
  this.isLibrarySource = true;
  this.adjustHeight = 0;

  constructBase();
  if (usePresets) {
    makePresetsParams();
  } else {
    makeArtboardParams();
  }

  this.view.addSubview(_utils2['default'].createDivider(NSMakeRect(0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - 10, this.modalParams.width, 1)));
  this.adjustHeight = 5;
  makeSymbolParams();
  this.view.addSubview(_utils2['default'].createDivider(NSMakeRect(0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - 15, this.modalParams.width, 1)));
  this.adjustHeight = 8;
  makeMaskCheckboxParams();
  makeMaskRadioButtonParams();
  makeMaskLibraryParams(context);
  setEnabledColorLibraryMenu(false);
  setEnabledColorMenu(false);
  setEnabledRadioButton(false);
  makeMaskColorPickerParams(context);
  addListenerOnMaskCheckbox();

  var result = {
    button: this.modal.runModal(),
    convertSymbol: this.symbolParams.state(),
    withMask: !!this.checkboxMaskParams.state()
  };

  if (usePresets) {
    result.presets = [];
    this.presets.forEach(function (preset) {
      if (preset.presetCheckBox.state()) {
        result.presets.push({
          artboardSize: parseInt(preset.sizeBox.stringValue()),
          iconPadding: parseFloat(preset.paddingBox.stringValue())
        });
      }
    });
  } else {
    result.artboardSize = parseInt(this.artboardSize.stringValue());
    result.iconPadding = parseFloat(this.artboardPadding.stringValue());
  }

  if (result.withMask && this.isLibrarySource) {
    var colorMenu = this.colorsMenuParams.selectedItem();
    result.color = colorMenu ? this.colorsMenuParams.representedObject() : null;

    var colorLib = this.colorLibsMenuParams.selectedItem();
    result.colorLib = colorLib ? this.colorLibsMenuParams.representedObject() : null;

    if (!result.color) result.withMask = false;
  } else if (result.withMask) {
    result.colorPicker = this.colorPickerColor || MSColor.blackColor();
  }

  return result;
}

function artboardModal(context) {

  this.settingsValues = _settings2['default'].getSettings(context, 'placeholder');

  this.modalParams = {
    messageText: 'Configure your icons',
    informativeText: 'Your icons will be moved in artboards. Set size and padding of your artboards.',
    height: 100,
    width: 300,
    lineHeight: 35
  };

  this.coeffCurrentHeight = 0;
  this.adjustHeight = 0;

  constructBase();
  makeArtboardParams();

  return {
    button: this.modal.runModal(),
    artboardSize: parseInt(this.artboardSize.stringValue()),
    iconPadding: parseFloat(this.artboardPadding.stringValue())
  };
}

function constructBase() {
  var button1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Continue';


  this.modal = COSAlertWindow['new']();

  this.view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, this.modalParams.width, this.modalParams.height));

  this.modal.addAccessoryView(this.view);
  this.modal.setMessageText(this.modalParams.messageText);
  this.modal.addButtonWithTitle(button1);
  this.modal.setInformativeText(this.modalParams.informativeText);
  this.modal.addButtonWithTitle('Cancel');
}

function makePresetsParams() {
  var _this = this;

  var presets = this.settingsValues.presets.data.split(',').map(function (preset) {
    var properties = preset.split('-');
    return {
      artboardSize: properties[0],
      padding: properties[1] ? properties[1] : 0
    };
  });

  this.presets = [];

  var presetLabel = _utils2['default'].createLabel('Presets', 0, this.modalParams.height - this.modalParams.lineHeight, 150, 20);
  this.view.addSubview(presetLabel);

  var sizeLabel = _utils2['default'].createLabel('Size', 180, this.modalParams.height - this.modalParams.lineHeight, 100, 20);
  this.view.addSubview(sizeLabel);

  var paddingLabel = _utils2['default'].createLabel('Padding', 240, this.modalParams.height - this.modalParams.lineHeight, 100, 20);
  this.view.addSubview(paddingLabel);

  this.coeffCurrentHeight++;

  presets.forEach(function (preset) {
    _this.coeffCurrentHeight++;
    makePreset(preset, _this.modalParams.height - _this.modalParams.lineHeight * _this.coeffCurrentHeight);
  });
}

function makeArtboardParams() {

  this.coeffCurrentHeight++;

  var textBoxLabel = _utils2['default'].createLabel('Artboard size', 0, this.modalParams.height - this.modalParams.lineHeight, 150, 20);
  this.view.addSubview(textBoxLabel);
  var textBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight, 50, 20));
  textBox.setStringValue(24);
  this.view.addSubview(textBox);
  var textBoxUnit = _utils2['default'].createLabel('px', 205, this.modalParams.height - this.modalParams.lineHeight, 50, 20);
  this.view.addSubview(textBoxUnit);

  this.coeffCurrentHeight++;

  var paddingBoxLabel = _utils2['default'].createLabel('Artboard Padding', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 150, 20);
  this.view.addSubview(paddingBoxLabel);
  var paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 50, 20));
  paddingBox.setStringValue(4);
  this.view.addSubview(paddingBox);
  var paddingBoxUnit = _utils2['default'].createLabel('px', 205, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 50, 20);
  this.view.addSubview(paddingBoxUnit);

  this.artboardPadding = paddingBox;
  this.artboardSize = textBox;

  this.artboardSize.setNextKeyView(this.artboardPadding);
}

function makePreset(preset, yAxis) {

  var presetCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, yAxis, 30, 20));
  presetCheckBox.setState(true);
  presetCheckBox.setButtonType(NSSwitchButton);
  presetCheckBox.setFont(NSFont.systemFontOfSize_(13));
  presetCheckBox.setTitle('');

  this.view.addSubview(presetCheckBox);

  var sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(180, yAxis, 50, 20));
  sizeBox.setStringValue(preset.artboardSize);
  this.view.addSubview(sizeBox);

  var paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(240, yAxis, 50, 20));
  paddingBox.setStringValue(preset.padding);
  this.view.addSubview(paddingBox);

  var newPreset = { sizeBox: sizeBox, paddingBox: paddingBox, presetCheckBox: presetCheckBox };

  addListenerPreset(newPreset);

  this.presets.push(newPreset);
}

function makeSymbolParams() {

  this.coeffCurrentHeight++;

  var maskCheckboxLabel = _utils2['default'].createLabel('Symbols', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 150, 20);
  this.view.addSubview(maskCheckboxLabel);

  var symbolCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 200, 20));
  symbolCheckBox.setButtonType(NSSwitchButton);
  symbolCheckBox.setState(true);
  symbolCheckBox.setFont(NSFont.systemFontOfSize_(13));
  symbolCheckBox.setTitle('Convert to symbol');
  this.view.addSubview(symbolCheckBox);

  this.symbolParams = symbolCheckBox;
}

function makeMaskCheckboxParams() {

  this.coeffCurrentHeight++;

  var maskCheckboxLabel = _utils2['default'].createLabel('Mask', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 150, 20);
  this.view.addSubview(maskCheckboxLabel);

  var maskCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 200, 20));
  maskCheckBox.setButtonType(NSSwitchButton);
  maskCheckBox.setState(false);
  maskCheckBox.setFont(NSFont.systemFontOfSize_(13));
  maskCheckBox.setTitle('Add color mask');
  this.view.addSubview(maskCheckBox);

  this.checkboxMaskParams = maskCheckBox;
}

function makeMaskRadioButtonParams() {

  this.coeffCurrentHeight++;
  this.coeffCurrentHeight++;

  var radioButtonLabel = _utils2['default'].createLabel('Color Source', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight + 40, 150, 20);
  this.view.addSubview(radioButtonLabel);

  var buttonFormat = NSButtonCell.alloc().init();
  buttonFormat.setButtonType(NSRadioButton);
  var matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 300, 60), NSRadioModeMatrix, buttonFormat, 2, 1);
  matrixFormat.setCellSize(CGSizeMake(300, 25));
  var cells = matrixFormat.cells();
  cells[0].setTitle("From Symbols");
  cells[0].setFont(NSFont.systemFontOfSize_(13));
  cells[1].setTitle("From Color picker");
  cells[1].setFont(NSFont.systemFontOfSize_(13));

  this.view.addSubview(matrixFormat);

  setListenerRadioButon(cells);

  this.radioParams = matrixFormat;
  this.radioButtonLabel = radioButtonLabel;
}

function makeMaskLibraryParams(context) {

  this.coeffCurrentHeight++;

  var colorLibsLabel = _utils2['default'].createLabel('Document Source', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 150, 25);
  this.view.addSubview(colorLibsLabel);
  var colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 130, 30));

  this.coeffCurrentHeight++;

  var colorMenuLabel = _utils2['default'].createLabel('Color', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 150, 25);
  this.view.addSubview(colorMenuLabel);
  var colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 130, 30));

  this.view.addSubview(colorLibsMenu);
  this.view.addSubview(colorMenu);

  this.colorLibsMenuParams = colorLibsMenu;
  this.colorsMenuParams = colorMenu;
  this.colorLibsMenuParamsLabel = colorLibsLabel;
  this.colorsMenuParamsLabel = colorMenuLabel;

  colorLibsMenu.menu = _libraries2['default'].initLibsSelectList(context, AppController.sharedInstance().librariesController().availableLibraries(), colorMenu);
}

function makeMaskColorPickerParams(context) {
  var _this2 = this;

  var colorPickerLabel = _utils2['default'].createLabel('Color picker', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight + 20, 150, 20);

  var pickerView = NSView.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 130, 60));
  pickerView.setWantsLayer(true);
  pickerView.layer().setBackgroundColor(CGColorCreateGenericRGB(1, 1, 1, 1.0));
  pickerView.layer().setBorderColor(CGColorCreateGenericRGB(186 / 255, 186 / 255, 186 / 255, 1));
  pickerView.layer().borderWidth = 1;

  var hexLabel = _utils2['default'].createLabel('#000000', 60, 20, 100, 20);
  pickerView.addSubview(hexLabel);

  var pickerButton = NSButton.alloc().initWithFrame(NSMakeRect(5, 15, 50, 30));
  pickerButton.setButtonType(NSMomentaryChangeButton);
  pickerButton.setImage(_utils2['default'].getImageByColor(NSColor.colorWithRed_green_blue_alpha(0, 0, 0, 1), {
    width: 40,
    height: 30
  }));

  pickerButton.setBordered(false);

  var main = AMOMain.alloc().init();

  pickerButton.setCOSJSTargetFunction(function () {
    main.openPopover_onView_withWebview(pickerButton, _this2.view, _utils2['default'].createWebview(context, pickerButton, function (color) {
      _this2.colorPickerColor = color;
      hexLabel.setStringValue_('#' + String(color.immutableModelObject().hexValue()));
    }));
  });

  pickerView.addSubview(pickerButton);

  this.pickerView = pickerView;
  this.colorPickerLabel = colorPickerLabel;
}

function addListenerOnMaskCheckbox() {
  var _this3 = this;

  this.checkboxMaskParams.setCOSJSTargetFunction(function (mask) {
    if (mask.state()) {
      setEnabledRadioButton(true);
      setEnabledColorLibraryMenu(true);
      if (_this3.colorsMenuParams.numberOfItems() > 0) setEnabledColorMenu(true);
    } else {
      setEnabledRadioButton(false);
      setEnabledColorLibraryMenu(false);
      setEnabledColorMenu(false);
      addLibraryColorsFields();
      removePickerButton();
      _this3.radioParams.cells()[0].state = true;
      _this3.radioParams.cells()[1].state = false;
    }
  });
}

function setListenerRadioButon(cells) {
  function setState(item) {
    if (String(item.selectedCells()[0].title()) === 'From Symbols') {
      addLibraryColorsFields();
      removePickerButton();
      this.isLibrarySource = true;
    } else {
      removeLibraryColorsFields();
      addPickerButton();
      this.isLibrarySource = false;
    }
  }

  cells[0].setCOSJSTargetFunction(setState);
  cells[1].setCOSJSTargetFunction(setState);
}

function setEnabledColorLibraryMenu(enabled) {
  var color = enabled ? NSColor.controlTextColor() : disabledColor;
  this.colorLibsMenuParamsLabel.setTextColor(color);
  this.colorLibsMenuParams.setEnabled(enabled);
}

function setEnabledColorMenu(enabled) {
  this.colorsMenuParamsLabel.setTextColor(getStateColor(enabled));
  this.colorsMenuParams.setEnabled(enabled);
}

function setEnabledRadioButton(enabled) {
  this.radioParams.setEnabled(enabled);
  this.radioButtonLabel.setTextColor(getStateColor(enabled));
}

function removeLibraryColorsFields() {
  this.colorLibsMenuParams.removeFromSuperview();
  this.colorsMenuParams.removeFromSuperview();
  this.colorLibsMenuParamsLabel.removeFromSuperview();
  this.colorsMenuParamsLabel.removeFromSuperview();
}

function addLibraryColorsFields() {
  this.view.addSubview(this.colorLibsMenuParams);
  this.view.addSubview(this.colorsMenuParams);
  this.view.addSubview(this.colorLibsMenuParamsLabel);
  this.view.addSubview(this.colorsMenuParamsLabel);
}

function addPickerButton() {
  this.view.addSubview(this.pickerView);
  this.view.addSubview(this.colorPickerLabel);
}

function removePickerButton() {
  this.pickerView.removeFromSuperview();
  this.colorPickerLabel.removeFromSuperview();
}

function getStateColor(enabled) {
  return enabled ? NSColor.controlTextColor() : disabledColor;
}

function addListenerPreset(newPreset) {
  newPreset.presetCheckBox.setCOSJSTargetFunction(function () {
    newPreset.sizeBox.setEnabled(newPreset.presetCheckBox.state());
    newPreset.paddingBox.setEnabled(newPreset.presetCheckBox.state());
  });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _svg = __webpack_require__(4);

var _svg2 = _interopRequireDefault(_svg);

var _mask = __webpack_require__(3);

var _mask2 = _interopRequireDefault(_mask);

var _settings = __webpack_require__(2);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// import dom from 'sketch'

// import { Text } from 'sketch'

exports['default'] = {
  initImport: initImport,
  initImportIcons: initImportIcons,
  getPaddingAndSize: getPaddingAndSize,
  initOrganizeIcons: initOrganizeIcons
};


var artboardParams = {
  iconsByLine: 10,
  sizeBetweenPreset: 200,
  titleFontSize: 32
};

var workingRootObject = [];

/**
 * @name createArtboard
 * @description set position and size and create artboard
 * @param context {Object} :
 * @param index {Number}
 * @param name {String}
 * @param params {Object}
 * @returns {Object} : MSArtboardGroup
 */
function createArtboard(context, index, name, params) {

  var marginBetweenRootObject = _settings2['default'].getSettings(context, 'default').marginBetweenRootObject;
  var space = _utils2['default'].getSizeBetweenIcon(artboardParams.width, marginBetweenRootObject.data);

  if (index === 0) {
    artboardParams.y = params.yOrigin;
    artboardParams.x = params.xOrigin || 0;
  } else if (index % artboardParams.iconsByLine === 0) {
    artboardParams.y += space;
    artboardParams.x = params.xOrigin || 0;
  } else {
    artboardParams.x += space;
  }

  var rootObject = MSArtboardGroup['new']();
  rootObject.setName('' + String(params.prefix) + String(name));

  setPositionRootObject(rootObject, artboardParams);

  context.document.currentPage().addLayers([rootObject]);

  return params.convertSymbol ? MSSymbolMaster.convertArtboardToSymbol(rootObject) : rootObject;
}

/**
 * @name setPositionRootObject
 * @param rootObject
 * @param mensuration
 */
function setPositionRootObject(rootObject, mensuration) {

  var rootObjectFrame = rootObject.frame();
  rootObjectFrame.setWidth(mensuration.width);
  rootObjectFrame.setHeight(mensuration.height);
  rootObjectFrame.setX(mensuration.x);
  rootObjectFrame.setY(mensuration.y);
}

function setOrigin(context, setOfRootObject) {
  var Y = [];
  var X = [];
  var size = 0;

  setOfRootObject.forEach(function (layer) {
    var layerSize = layer.frame().height();
    var origin = layer.origin();
    Y.push(origin.y - size);
    X.push(origin.x - size);
    if (layerSize > size) size = layerSize;
  });

  var yOrigin = Y.length !== 0 ? Math.max.apply(Math, Y) : 0;
  var xOrigin = X.length !== 0 ? Math.max.apply(Math, X) + size : 0;

  return {
    yOrigin: setOfRootObject.length === 0 ? yOrigin : yOrigin + 100 + size,
    xOrigin: setOfRootObject.length === 0 ? xOrigin : xOrigin + 100 + size
  };
}

/**
 * @name initImportIcons
 * @description main function to import multiple icons and mask on new artboard
 * @param context {Object}
 * @param params: {Object}
 */
async function initImportIcons(context, params) {
  _utils2['default'].clearSelection(context);
  params.listIcon.forEach(function (icon, index) {
    try {
      var name = _utils2['default'].getIconNameByNSUrl(icon);
      var newRootObject = createArtboard(context, index, name, params);
      var ext = String(icon.toString().split('.').pop()).toLowerCase();
      if (ext === 'pdf') return _svg2['default'].addPDF(context, newRootObject, params, icon);
      if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return _svg2['default'].addBITMAP(context, newRootObject, params, icon);
      var svgData = String(NSString.alloc().initWithContentsOfURL(icon));
      processSVG(context, newRootObject, params, svgData);
      workingRootObject.push(newRootObject);
    } catch (e) {
      _logger2['default'].error(e);
    }
  });
  _utils2['default'].clearSelection(context);
}

/**
 * @name initOrganizeIcons
 * @param context
 * @param params
 */
function initOrganizeIcons(context, params) {

  params.listIcon.forEach(async function (icon, index) {
    try {
      var newRootObject = createArtboard(context, index, icon.name(), params);
      if (String(icon['class']()) === 'MSBitmapLayer') return _svg2['default'].addBITMAP(context, newRootObject, params, icon);
      var ancestry = MSImmutableLayerAncestry.ancestryWithMSLayer_(icon);
      var exportRequest = MSExportRequest.exportRequestsFromLayerAncestry_(ancestry).firstObject();
      exportRequest.format = 'svg';
      var exporter = MSExporter.exporterForRequest_colorSpace_(exportRequest, NSColorSpace.sRGBColorSpace());
      var svgData = NSString.alloc().initWithData_encoding(exporter.data(), NSUTF8StringEncoding);
      await processSVG(context, newRootObject, params, String(svgData));
      workingRootObject.push(newRootObject);
    } catch (e) {
      _logger2['default'].error(e);
    }
  });
}

/**
 * @name initImport
 * @param context
 * @param params
 * @param cb
 */
function initImport(context, params, cb) {
  var rootObjects = _utils2['default'].getRootObject(context);
  params.yOrigin = setOrigin(context, rootObjects).yOrigin;
  if (params.presets) {
    var withPresetTitle = rootObjects;
    params.presets.forEach(function (preset) {
      setArtboardsSize(params, preset);
      params.xOrigin = setOrigin(context, workingRootObject).xOrigin;
      params.artboardSize = preset.artboardSize;
      params.prefix = _utils2['default'].buildPrefix(context, params.artboardSize);
      if (withPresetTitle && rootObjects.length === 0) context.document.currentPage().addLayers([newText(preset, params.xOrigin)]);
      artboardParams.iconsByLine = parseInt(_settings2['default'].getSettings(context, 'default').iconsByLine.data);
      cb(context, params);
    });
  } else {
    params.prefix = _utils2['default'].buildPrefix(context, params.artboardSize);
    artboardParams.height = artboardParams.width = params.artboardSize;
    artboardParams.iconsByLine = parseInt(_settings2['default'].getSettings(context, 'default').iconsByLine.data);
    cb(context, params);
  }
  var importedIcons = params.listIcon.length * (Array.isArray(params.presets) ? params.presets.length : 1);
  context.document.showMessage('\uD83C\uDF89 Tadaaa! \uD83C\uDF89 ' + importedIcons + ' icon' + (params.listIcon.length > 1 ? 's' : '') + ' imported');
  return importedIcons;
}

function newText(preset, xOrigin) {
  var text = MSTextLayer['new']();
  text.setStringValue_(String(preset.artboardSize) + 'px');
  var fontManager = NSFontManager.sharedFontManager();
  var boldItalic = fontManager.fontWithFamily_traits_weight_size("Helvetica neue", NSBoldFontMask, 0, artboardParams.titleFontSize);
  text.setFont(boldItalic);
  text.lineHeight = 48;
  text.setName(String(preset.artboardSize) + 'px');
  var textFrame = text.frame();
  textFrame.setX(xOrigin);
  textFrame.setY(-(32 + text.lineHeight()));
  return text;
}

/**
 * @name setArtboardsPosition
 * @param params
 * @param preset
 */
function setArtboardsSize(params, preset) {
  params.iconPadding = preset.iconPadding;
  artboardParams.height = artboardParams.width = preset.artboardSize;
}

/**
 * @name processSVG
 * @param context
 * @param rootObject
 * @param params
 * @param svgData
 * @return {Promise<*>}
 */
function processSVG(context, rootObject, params, svgData) {
  _svg2['default'].addSVG(context, rootObject, params, svgData, true);
  if (params.withMask) _mask2['default'].addColor(context, rootObject, params);
  return context.command.setValue_forKey_onLayer(params.iconPadding, 'padding', rootObject);
}

/**
 * @name getPaddingAndSize
 * @description get padding and size by artboard
 * @param context
 * @param artboard {Object} : MSArtboardGroup
 * @returns {{iconPadding: Number, artboardSize: Number}}
 */
function getPaddingAndSize(context, artboard) {
  var iconPadding = context.command.valueForKey_onLayer('padding', artboard);

  if (!iconPadding) {
    var icon = artboard.layers()[0].rect();
    iconPadding = Math.min(icon.origin.x, icon.origin.y);
  }

  return {
    iconPadding: parseFloat(iconPadding),
    artboardSize: parseInt(artboard.rect().size.width)
  };
}

/**
 * @name resizeRootObject
 * @param rootObject
 * @param size
 */
function resizeRootObject(rootObject, size) {
  var rootObjectFrame = rootObject.frame();
  rootObjectFrame.setWidth(size);
  rootObjectFrame.setHeight(size);
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, console) {/* globals log */

if (process.env.NODE_ENV !== 'production') {
  var sketchUtils = __webpack_require__(16)
  var sketchDebugger = __webpack_require__(18)
  var actions = __webpack_require__(20)

  function getStack() {
    return sketchUtils.prepareStackTrace(new Error().stack)
  }
}

console._skpmPrefix = 'console> '

function logEverywhere(type, args) {
  var values = Array.prototype.slice.call(args)

  // log to the System logs
  values.forEach(function(v) {
    try {
      log(console._skpmPrefix + indentString() + v)
    } catch (e) {
      log(v)
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    if (!sketchDebugger.isDebuggerPresent()) {
      return
    }

    var payload = {
      ts: Date.now(),
      type: type,
      plugin: String(context.scriptPath),
      values: values.map(sketchUtils.prepareValue),
      stack: getStack(),
    }

    sketchDebugger.sendToDebugger(actions.ADD_LOG, payload)
  }
}

var indentLevel = 0
function indentString() {
  var indent = ''
  for (var i = 0; i < indentLevel; i++) {
    indent += '  '
  }
  if (indentLevel > 0) {
    indent += '| '
  }
  return indent
}

var oldGroup = console.group

console.group = function() {
  // log to the JS context
  oldGroup && oldGroup.apply(this, arguments)
  indentLevel += 1
  if (process.env.NODE_ENV !== 'production') {
    sketchDebugger.sendToDebugger(actions.GROUP, {
      plugin: String(context.scriptPath),
      collapsed: false,
    })
  }
}

var oldGroupCollapsed = console.groupCollapsed

console.groupCollapsed = function() {
  // log to the JS context
  oldGroupCollapsed && oldGroupCollapsed.apply(this, arguments)
  indentLevel += 1
  if (process.env.NODE_ENV !== 'production') {
    sketchDebugger.sendToDebugger(actions.GROUP, {
      plugin: String(context.scriptPath),
      collapsed: true
    })
  }
}

var oldGroupEnd = console.groupEnd

console.groupEnd = function() {
  // log to the JS context
  oldGroupEnd && oldGroupEnd.apply(this, arguments)
  indentLevel -= 1
  if (indentLevel < 0) {
    indentLevel = 0
  }
  if (process.env.NODE_ENV !== 'production') {
    sketchDebugger.sendToDebugger(actions.GROUP_END, {
      plugin: context.scriptPath,
    })
  }
}

var counts = {}
var oldCount = console.count

console.count = function(label) {
  label = typeof label !== 'undefined' ? label : 'Global'
  counts[label] = (counts[label] || 0) + 1

  // log to the JS context
  oldCount && oldCount.apply(this, arguments)
  return logEverywhere('log', [label + ': ' + counts[label]])
}

var timers = {}
var oldTime = console.time

console.time = function(label) {
  // log to the JS context
  oldTime && oldTime.apply(this, arguments)

  label = typeof label !== 'undefined' ? label : 'default'
  if (timers[label]) {
    return logEverywhere('warn', ['Timer "' + label + '" already exists'])
  }

  timers[label] = Date.now()
  return
}

var oldTimeEnd = console.timeEnd

console.timeEnd = function(label) {
  // log to the JS context
  oldTimeEnd && oldTimeEnd.apply(this, arguments)

  label = typeof label !== 'undefined' ? label : 'default'
  if (!timers[label]) {
    return logEverywhere('warn', ['Timer "' + label + '" does not exist'])
  }

  var duration = Date.now() - timers[label]
  delete timers[label]
  return logEverywhere('log', [label + ': ' + (duration / 1000) + 'ms'])
}

var oldLog = console.log

console.log = function() {
  // log to the JS context
  oldLog && oldLog.apply(this, arguments)
  return logEverywhere('log', arguments)
}

var oldWarn = console.warn

console.warn = function() {
  // log to the JS context
  oldWarn && oldWarn.apply(this, arguments)
  return logEverywhere('warn', arguments)
}

var oldError = console.error

console.error = function() {
  // log to the JS context
  oldError && oldError.apply(this, arguments)
  return logEverywhere('error', arguments)
}

var oldAssert = console.assert

console.assert = function(condition, text) {
  // log to the JS context
  oldAssert && oldAssert.apply(this, arguments)
  if (!condition) {
    return logEverywhere('assert', [text])
  }
  return undefined
}

var oldInfo = console.info

console.info = function() {
  // log to the JS context
  oldInfo && oldInfo.apply(this, arguments)
  return logEverywhere('info', arguments)
}

var oldClear = console.clear

console.clear = function() {
  oldClear && oldClear()
  if (process.env.NODE_ENV !== 'production') {
    return sketchDebugger.sendToDebugger(actions.CLEAR_LOGS)
  }
}

console._skpmEnabled = true

module.exports = console

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), __webpack_require__(8)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var fiberAvailable = __webpack_require__(15)

var setTimeout
var clearTimeout

var fibers = []

if (fiberAvailable()) {
  var fibers = []

  setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    // fibers takes care of keeping coscript around
    var id = fibers.length
    fibers.push(coscript.scheduleWithInterval_jsFunction(
      (delay || 0) / 1000,
      function () {
        func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
      }
    ))
    return id
  }

  clearTimeout = function (id) {
    var timeout = fibers[id]
    if (timeout) {
      timeout.cancel() // fibers takes care of keeping coscript around
      fibers[id] = undefined // garbage collect the fiber
    }
  }
} else {
  setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    coscript.shouldKeepAround = true
    var id = fibers.length
    fibers.push(true)
    coscript.scheduleWithInterval_jsFunction(
      (delay || 0) / 1000,
      function () {
        if (fibers[id]) { // if not cleared
          func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
        }
        clearTimeout(id)
        if (fibers.every(function (_id) { return !_id })) { // if everything is cleared
          coscript.shouldKeepAround = false
        }
      }
    )
    return id
  }

  clearTimeout = function (id) {
    fibers[id] = false
  }
}

module.exports = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */

module.exports = function prepareStackTrace(stackTrace) {
  var stack = stackTrace.split('\n')
  stack = stack.map(function (s) {
    return s.replace(/\sg/, '')
  })

  stack = stack.map(function (entry) {
    // entry is something like `functionName@path/to/my/file:line:column`
    // or `path/to/my/file:line:column`
    // or `path/to/my/file`
    // or `path/to/@my/file:line:column`
    var parts = entry.split('@')
    var fn = parts.shift()
    var filePath = parts.join('@') // the path can contain @

    if (fn.indexOf('/Users/') === 0) {
      // actually we didn't have a fn so just put it back in the filePath
      filePath = fn + (filePath ? ('@' + filePath) : '')
      fn = null
    }

    if (!filePath) {
      // we should always have a filePath, so if we don't have one here, it means that the function what actually anonymous and that it is the filePath instead
      filePath = entry
      fn = null
    }

    var filePathParts = filePath.split(':')
    filePath = filePathParts[0]

    // the file is the last part of the filePath
    var file = filePath.split('/')
    file = file[file.length - 1]

    return {
      fn: fn,
      file: file,
      filePath: filePath,
      line: filePathParts[1],
      column: filePathParts[2],
    }
  })

  return stack
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function toArray(object) {
  if (Array.isArray(object)) {
    return object
  }
  var arr = []
  for (var j = 0; j < (object || []).length; j += 1) {
    arr.push(object[j])
  }
  return arr
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importIcons = importIcons;
exports.updateIconsOnSelectedArtboards = updateIconsOnSelectedArtboards;
exports.organizeIcons = organizeIcons;
exports.addMaskOnSelectedArtboards = addMaskOnSelectedArtboards;
exports.removeMaskOnSelectedArtboards = removeMaskOnSelectedArtboards;
exports.setSettings = setSettings;
exports.executeImport = executeImport;

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _artboard = __webpack_require__(7);

var _artboard2 = _interopRequireDefault(_artboard);

var _mask = __webpack_require__(3);

var _mask2 = _interopRequireDefault(_mask);

var _modals = __webpack_require__(22);

var _modals2 = _interopRequireDefault(_modals);

var _files = __webpack_require__(23);

var _files2 = _interopRequireDefault(_files);

var _svg = __webpack_require__(4);

var _svg2 = _interopRequireDefault(_svg);

var _modals3 = __webpack_require__(6);

var _settings = __webpack_require__(24);

var _settings2 = _interopRequireDefault(_settings);

var _settings3 = __webpack_require__(2);

var _settings4 = _interopRequireDefault(_settings3);

var _analytics = __webpack_require__(25);

var _analytics2 = _interopRequireDefault(_analytics);

var _dom = __webpack_require__(26);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @name importIcons
 * @description trigger to start feature to import icons
 * @param context
 */
function importIcons(context) {
  _utils2['default'].runFramework(context);
  var params = (0, _modals3.importModal)(context);
  if (params.button !== 1000) return;
  params.listIcon = _files2['default'].selectIconsFiles();
  if (!params.listIcon.length) return;
  var importedIcons = _artboard2['default'].initImport(context, params, _artboard2['default'].initImportIcons);
  var label = params.withMask ? 'import-mask' : 'import';
  _analytics2['default'].action(context, 'icons', 'import', label, importedIcons);
}

/**
 * @name updateIconsOnSelectedArtboards
 * @description trigger to start feature to update icon
 * @param context
 */
function updateIconsOnSelectedArtboards(context) {
  var selectedArtboardsAndSymbols = _utils2['default'].getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return _modals2['default'].newErrorModal('No artboards selected', 'Please select one or more artboards to replace icons.');
  var params = {};
  params.listIcon = _files2['default'].selectIconsFiles();
  if (!params.listIcon.length) return;
  if (selectedArtboardsAndSymbols.length > params.listIcon.length && params.listIcon.length !== 1) return _modals2['default'].newErrorModal('Too much artboards selected', 'Please select as many artboards as icons.');
  if (selectedArtboardsAndSymbols.length < params.listIcon.length && params.listIcon.length !== 1) return _modals2['default'].newErrorModal('Too much icons selected', 'Please select as many icons as artboards.');
  var replacedIcons = _svg2['default'].initUpdateIconsSelectedArtboards(context, selectedArtboardsAndSymbols, params);
  _analytics2['default'].action(context, 'icons', 'replace', 'replace', replacedIcons);
}

/**
 * @name organizeIcons
 * @param context
 */
function organizeIcons(context) {
  var selectedLayers = context.selection;
  if (selectedLayers.length === 0) return _modals2['default'].newErrorModal('No layers selected', 'Please select one or more layers.');
  _utils2['default'].runFramework(context);
  var params = (0, _modals3.importModal)(context);
  if (params.button !== 1000) return;
  params.listIcon = selectedLayers;
  _artboard2['default'].initImport(context, params, _artboard2['default'].initOrganizeIcons);
  params.listIcon.forEach(function (icon) {
    return icon.removeFromParent();
  });
  var label = params.withMask ? 'organize-mask' : 'organize';
  _analytics2['default'].action(context, 'icons', 'organize', label, params.listIcon.length);
}

/**
 * @name addMaskOnSelectedArtboards
 * @description trigger to start feature to add mask
 * @param context
 */
function addMaskOnSelectedArtboards(context) {
  _utils2['default'].runFramework(context);
  var selectedArtboardsAndSymbols = _utils2['default'].getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return _modals2['default'].newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.');
  var params = (0, _modals3.maskModal)(context);
  if (params.button !== 1000) return;
  _mask2['default'].initAddMaskOnSelectedArtboards(context, params, selectedArtboardsAndSymbols);
  _analytics2['default'].action(context, 'icons', 'mask', 'mask', selectedArtboardsAndSymbols.length);
}

/**
 * @name removeMaskOnSelectedArtboards
 * @description remove masks layer
 * @param context
 */
function removeMaskOnSelectedArtboards(context) {
  var selectedArtboardsAndSymbols = _utils2['default'].getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return _modals2['default'].newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.');
  selectedArtboardsAndSymbols.forEach(function (rootElement) {
    _mask2['default'].removeMask(context, rootElement.object);
  });
  _analytics2['default'].action(context, 'icons', 'remove mask', 'remove mask', selectedArtboardsAndSymbols.length);
}

/**
 * @name setSettings
 * @description set settings
 * @param context
 */
function setSettings(context) {
  var params = (0, _settings2['default'])(context);
  if (params.button === 1001) return;
  _settings4['default'].registerSettings(context, params);
  _analytics2['default'].action(context, 'settings', 'settings', 'settings');
}

async function executeImport(context) {

  if (String(context.document.hudClientName()) === 'icons.sketch') {
    var params = {
      artboardSize: 16,
      iconPadding: 2
    };

    if (MSDocument.currentDocument().artboards().length !== 0) {
      MSDocument.currentDocument().artboards().forEach(function (artboard) {
        artboard.removeFromParent();
      });
    }

    var result = [];
    _files2['default'].getFilesByUrls([NSURL.fileURLWithPath('/tmp/icons')], result);
    params.listIcon = result;
    console.log('>>>>>>>>>>> step 1', result);
    await _artboard2['default'].initImport(context, params, _artboard2['default'].initImportIcons);
    console.log('>>>>>>>>>>> step 2');
    var document = _dom2['default'].fromNative(context.document);
    document.save('~/icons.sketch');
    document.close();
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
//  MochaJSDelegate.js
//  MochaJSDelegate
//
//  Created by Matt Curtis
//  Copyright (c) 2015. All rights reserved.
//
exports["default"] = MochaJSDelegate;


function MochaJSDelegate(selectorHandlerDict) {
  var uniqueClassName = "MochaJSDelegate_DynamicClass_" + NSUUID.UUID().UUIDString();

  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, NSObject);

  delegateClassDesc.registerClass();

  //	Handler storage

  var handlers = {};

  //	Define interface

  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers;
    var selector = NSSelectorFromString(selectorString);

    handlers[selectorString] = func;

    if (!handlerHasBeenSet) {
      /*
        For some reason, Mocha acts weird about arguments:
        https://github.com/logancollins/Mocha/issues/28
        We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
      */

      var dynamicHandler = function dynamicHandler() {
        var functionToCall = handlers[selectorString];

        if (!functionToCall) return;

        return functionToCall.apply(delegateClassDesc, arguments);
      };

      var args = [],
          regex = /:/g;
      while (match = regex.exec(selectorString)) {
        args.push("arg" + args.length);
      }dynamicFunction = eval("(function(" + args.join(",") + "){ return dynamicHandler.apply(this, arguments); })");

      delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction);
    }
  };

  this.removeHandlerForSelector = function (selectorString) {
    delete handlers[selectorString];
  };

  this.getHandlerForSelector = function (selectorString) {
    return handlers[selectorString];
  };

  this.getAllHandlers = function () {
    return handlers;
  };

  this.getClass = function () {
    return NSClassFromString(uniqueClassName);
  };

  this.getClassInstance = function () {
    return NSClassFromString(uniqueClassName)["new"]();
  };

  //	Conveience

  if ((typeof selectorHandlerDict === "undefined" ? "undefined" : _typeof(selectorHandlerDict)) == "object") {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString]);
    }
  }
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setTimeout, clearTimeout) {// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)["setTimeout"], __webpack_require__(9)["clearTimeout"]))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function () {
  return typeof coscript !== 'undefined' && coscript.createFiber
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var prepareValue = __webpack_require__(17)

module.exports.toArray = __webpack_require__(11)
module.exports.prepareStackTrace = __webpack_require__(10)
module.exports.prepareValue = prepareValue
module.exports.prepareObject = prepareValue.prepareObject
module.exports.prepareArray = prepareValue.prepareArray


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */
var prepareStackTrace = __webpack_require__(10)
var toArray = __webpack_require__(11)

function prepareArray(array, options) {
  return array.map(function(i) {
    return prepareValue(i, options)
  })
}

function prepareObject(object, options) {
  const deep = {}
  Object.keys(object).forEach(function(key) {
    deep[key] = prepareValue(object[key], options)
  })
  return deep
}

function getName(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.name()),
  }
}

function getSelector(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.selector()),
  }
}

function introspectMochaObject(value, options) {
  options = options || {}
  var mocha = value.class().mocha()
  var introspection = {
    properties: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['properties' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getName),
    },
    classMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['classMethods' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getSelector),
    },
    instanceMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['instanceMethods' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getSelector),
    },
    protocols: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['protocols' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getName),
    },
  }
  if (mocha.treeAsDictionary && options.withTree) {
    introspection.treeAsDictionary = {
      type: 'Object',
      primitive: 'Object',
      value: prepareObject(mocha.treeAsDictionary())
    }
  }
  return introspection
}

function prepareValue(value, options) {
  var type = 'String'
  var primitive = 'String'
  const typeOf = typeof value
  if (value instanceof Error) {
    type = 'Error'
    primitive = 'Error'
    value = {
      message: value.message,
      name: value.name,
      stack: prepareStackTrace(value.stack),
    }
  } else if (Array.isArray(value)) {
    type = 'Array'
    primitive = 'Array'
    value = prepareArray(value, options)
  } else if (value === null || value === undefined || Number.isNaN(value)) {
    type = 'Empty'
    primitive = 'Empty'
    value = String(value)
  } else if (typeOf === 'object') {
    if (value.isKindOfClass && typeof value.class === 'function') {
      type = String(value.class())
      // TODO: Here could come some meta data saved as value
      if (
        type === 'NSDictionary' ||
        type === '__NSDictionaryM' ||
        type === '__NSSingleEntryDictionaryI' ||
        type === '__NSDictionaryI' ||
        type === '__NSCFDictionary'
      ) {
        primitive = 'Object'
        value = prepareObject(Object(value), options)
      } else if (
        type === 'NSArray' ||
        type === 'NSMutableArray' ||
        type === '__NSArrayM' ||
        type === '__NSSingleObjectArrayI' ||
        type === '__NSArray0'
      ) {
        primitive = 'Array'
        value = prepareArray(toArray(value), options)
      } else if (
        type === 'NSString' ||
        type === '__NSCFString' ||
        type === 'NSTaggedPointerString' ||
        type === '__NSCFConstantString'
      ) {
        primitive = 'String'
        value = String(value)
      } else if (type === '__NSCFNumber' || type === 'NSNumber') {
        primitive = 'Number'
        value = 0 + value
      } else if (type === 'MOStruct') {
        type = String(value.name())
        primitive = 'Object'
        value = value.memberNames().reduce(function(prev, k) {
          prev[k] = prepareValue(value[k], options)
          return prev
        }, {})
      } else if (value.class().mocha) {
        primitive = 'Mocha'
        value = (options || {}).skipMocha ? type : introspectMochaObject(value, options)
      } else {
        primitive = 'Unknown'
        value = type
      }
    } else {
      type = 'Object'
      primitive = 'Object'
      value = prepareObject(value, options)
    }
  } else if (typeOf === 'function') {
    type = 'Function'
    primitive = 'Function'
    value = String(value)
  } else if (value === true || value === false) {
    type = 'Boolean'
    primitive = 'Boolean'
  } else if (typeOf === 'number') {
    primitive = 'Number'
    type = 'Number'
  }

  return {
    value,
    type,
    primitive,
  }
}

module.exports = prepareValue
module.exports.prepareObject = prepareObject
module.exports.prepareArray = prepareArray


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */
var remoteWebview = __webpack_require__(19)

module.exports.identifier = 'skpm.debugger'

module.exports.isDebuggerPresent = remoteWebview.isWebviewPresent.bind(
  this,
  module.exports.identifier
)

module.exports.sendToDebugger = function sendToDebugger(name, payload) {
  return remoteWebview.sendToWebview(
    module.exports.identifier,
    'sketchBridge(' +
      JSON.stringify({
        name: name,
        payload: payload,
      }) +
      ');'
  )
}


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/* globals NSThread */

var threadDictionary = NSThread.mainThread().threadDictionary()

module.exports.isWebviewPresent = function isWebviewPresent (identifier) {
  return !!threadDictionary[identifier]
}

module.exports.sendToWebview = function sendToWebview (identifier, evalString) {
  if (!module.exports.isWebviewPresent(identifier)) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  var webview = threadDictionary[identifier]
    .contentView()
    .subviews()
  webview = webview[webview.length - 1]

  return webview.stringByEvaluatingJavaScriptFromString(evalString)
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports.SET_TREE = 'elements/SET_TREE'
module.exports.SET_PAGE_METADATA = 'elements/SET_PAGE_METADATA'
module.exports.SET_LAYER_METADATA = 'elements/SET_LAYER_METADATA'
module.exports.ADD_LOG = 'logs/ADD_LOG'
module.exports.CLEAR_LOGS = 'logs/CLEAR_LOGS'
module.exports.GROUP = 'logs/GROUP'
module.exports.GROUP_END = 'logs/GROUP_END'
module.exports.TIMER_START = 'logs/TIMER_START'
module.exports.TIMER_END = 'logs/TIMER_END'
module.exports.ADD_REQUEST = 'network/ADD_REQUEST'
module.exports.SET_RESPONSE = 'network/SET_RESPONSE'
module.exports.ADD_ACTION = 'actions/ADD_ACTION'
module.exports.SET_SCRIPT_RESULT = 'playground/SET_SCRIPT_RESULT'


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mask = __webpack_require__(3);

var _mask2 = _interopRequireDefault(_mask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  switchToV4: switchToV4
};


function switchToV4(context, rootObject) {
  var mask = rootObject.lastLayer();
  var params = { color: null, colorLib: null, colorPicker: null };
  if (String(mask['class']()) === 'MSSymbolInstance') {
    var color = mask.symbolMaster();
    var foreign = color.foreignSymbol();
    params.color = color;
    if (foreign) {
      params.color = String(foreign.originalMaster().symbolID());
      params.colorLib = foreign;
    }
  } else {
    params.colorPicker = mask.style().fills()[0].color();
  }

  _mask2['default'].registerMask(context, rootObject, params);
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _libraries = __webpack_require__(5);

var _libraries2 = _interopRequireDefault(_libraries);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  newModal: newModal,
  runModal: runModal,
  getMainButtonParam: getMainButtonParam,
  createArtboardFields: createArtboardFields,
  createCheckBoxes: createCheckBoxes,
  createMaskFields: createMaskFields,
  appendsFields: appendsFields,
  getParams: getParams,
  setNextKey: setNextKey,
  newErrorModal: newErrorModal

  /**
   * @name newModal
   * @description instantiate modal
   * @param context
   * @param viewSize {Object}
   * @param modalParams
   * @returns {{modal: *, view: *, viewSize: *}}
   */
};
function newModal(context, viewSize, modalParams) {

  var modal = COSAlertWindow['new']();

  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewSize.width, viewSize.height));
  modal.addAccessoryView(view);
  modal.setMessageText(modalParams.messageText);
  modal.setInformativeText(modalParams.informativeText);
  modal.addButtonWithTitle('Continue');
  modal.addButtonWithTitle('Cancel');
  modal.layout();

  return { modal: modal, view: view, viewSize: viewSize };
}

/**
 * @name runModal
 * @description run modal
 * @param modal
 * @returns {Object} : NSView
 */
function runModal(_ref) {
  var modal = _ref.modal;

  return modal.runModal();
}

/**
 * @name getMainButtonParam
 * @description get value of main button of view
 * @param button
 * @returns {Object}
 */
function getMainButtonParam(button) {
  return { button: button };
}

/**
 * @name createArtboardFields
 * @description create fields for new artboards params
 * @returns {[Object,Object]}
 */
function createArtboardFields() {

  var textBox = NSTextField.alloc().initWithFrame(NSMakeRect(0, 10, 130, 20));
  textBox.setStringValue('24');

  var textBoxPadding = NSTextField.alloc().initWithFrame(NSMakeRect(140, 10, 130, 20));
  textBoxPadding.setStringValue('3');

  return [{
    item: textBox,
    getter: function () {
      function getter() {
        return parseInt(textBox.stringValue());
      }

      return getter;
    }(),
    name: 'artboardSize',
    label: _utils2['default'].createLabel('Size', 0, 30, 130, 20)
  }, {
    item: textBoxPadding,
    getter: function () {
      function getter() {
        return parseInt(textBoxPadding.stringValue());
      }

      return getter;
    }(),
    name: 'iconPadding',
    label: _utils2['default'].createLabel('Padding', 140, 30, 130, 20)
  }];
}

/**
 * @name createCheckBoxMask
 * @description create field for checkbox for add mask
 * @returns {[Object]}
 */
function createCheckBoxes() {

  var symbolCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(0, 30, 200, 14));
  symbolCheckBox.setButtonType(NSSwitchButton);
  symbolCheckBox.setState(true);
  symbolCheckBox.setFont(NSFont.systemFontOfSize_(13));
  symbolCheckBox.setTitle('Convert to symbol');

  var maskCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(0, 5, 200, 14));
  maskCheckBox.setButtonType(NSSwitchButton);
  maskCheckBox.setState(false);
  maskCheckBox.setFont(NSFont.systemFontOfSize_(13));
  maskCheckBox.setTitle('Add color mask');

  return [{
    item: symbolCheckBox,
    name: 'convertSymbol',
    getter: symbolCheckBox.state
  }, {
    item: maskCheckBox,
    name: 'withMask',
    getter: maskCheckBox.state
  }];
}

/**
 * @name createMaskFields
 * @description create fields for mask params to add mask
 * @param context {Object}
 * @param modal {Object}
 * @param checkboxFields {Object}
 * @returns {[null,null]}
 */
function createMaskFields(context, modal, checkboxFields) {

  var colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 130, 20));
  var colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(140, 0, 130, 20));

  colorLibsMenu.setEnabled(false);
  colorMenu.setEnabled(false);

  colorLibsMenu.menu = _libraries2['default'].initLibsSelectList(AppController.sharedInstance().librariesController().availableLibraries(), colorMenu);

  if (checkboxFields) {
    checkboxFields[1].item.setCOSJSTargetFunction(function (mask) {
      if (mask.state()) {
        colorLibsMenu.setEnabled(true);
        // documentColorMenu.setEnabled(true)
        if (colorMenu.selectedItem()) colorMenu.setEnabled(true);
      } else {
        colorLibsMenu.setEnabled(false);
        colorMenu.setEnabled(false);
        // documentColorMenu.setEnabled(false)
      }
    });
  } else {
    colorLibsMenu.setEnabled(true);
  }

  return [{
    item: colorMenu,
    label: _utils2['default'].createLabel('Color', 140, 25, 130, 20),
    name: 'color',
    getter: function () {
      function getter() {
        var currentItem = this.item.selectedItem();
        return currentItem ? currentItem.representedObject() : null;
      }

      return getter;
    }()
  }, {
    item: colorLibsMenu,
    label: _utils2['default'].createLabel('Colors Library', 0, 25, 130, 20),
    name: 'colorLib',
    getter: function () {
      function getter() {
        var currentItem = this.item.selectedItem();
        return currentItem ? currentItem.representedObject() : null;
      }

      return getter;
    }()
  }];
}

/**
 * @name appendsFields
 * @description append fields on view to create modal
 * @param view {Object} : NSView
 * @param viewSize {Object} :
 * @param withLabelBottom {Boolean}
 * @param allFields
 */
function appendsFields(_ref2, allFields, withLabelBottom) {
  var view = _ref2.view,
      viewSize = _ref2.viewSize;

  allFields.reverse().forEach(function (fields) {
    var y = withLabelBottom ? view.subviews().length * 50 + 25 : view.subviews().length * 50;
    var viewCell = NSView.alloc().initWithFrame(NSMakeRect(0, y, viewSize.width, 50));
    fields.forEach(function (field) {
      if (field.label) viewCell.addSubview(field.label);
      if (field.item) viewCell.addSubview(field.item);
    });
    view.addSubview(viewCell);
  });
}

/**
 * @name getParams
 * @description get value of multiple fields
 * @param allFields [Array,Array,...]
 * @returns {Object}
 */
function getParams(allFields) {
  var result = {};
  allFields.forEach(function (fields) {
    fields.forEach(function (field) {
      result[field.name] = field.getter();
    });
  });

  return result;
}

/**
 * @name setNextKey
 * @description set tab path in form
 * @param fields
 */
function setNextKey(fields) {
  fields.forEach(function (field, index) {
    if (fields[index + 1] && field.item) field.item.setNextKeyView(fields[index + 1].item);
  });
}

/**
 * @name newErrorModal
 * @description display error  modal
 * @param message
 */
function newErrorModal(message, informativeText) {
  var modal = COSAlertWindow['new']();
  modal.setMessageText(message);
  modal.setInformativeText(informativeText);
  modal.runModal();
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = {
  selectIconsFiles: selectIconsFiles,
  getFilesByUrls: getFilesByUrls
};


var AVAILABLE_EXT = ["svg", "pdf", "png", "jpg", "jpeg"];

/**
 * @name selectIconsFiles
 * @description display modal selection file and return them
 * @returns {Array}
 */
function selectIconsFiles() {

  var panel = NSOpenPanel.openPanel();
  panel.setAllowsMultipleSelection(true);
  panel.setCanChooseDirectories(true);
  panel.setAllowedFileTypes(AVAILABLE_EXT);
  panel.setCanChooseFiles(true);
  panel.setPrompt("Select");

  if (panel.runModal() !== NSFileHandlingPanelOKButton) return [];

  var result = [];

  getFilesByUrls(panel.URLs(), result);

  return result;
}

/**
 * @name getFilesByUrls
 * @description get file from list of folder and path
 * @param urls {Array}
 * @param result {Array}
 * @returns {Array}
 */
function getFilesByUrls(urls, result) {

  for (var i = 0; i < urls.length; i++) {
    if (!!urls[i].hasDirectoryPath()) {
      getFilesByUrls(NSFileManager.defaultManager().contentsOfDirectoryAtURL_includingPropertiesForKeys_options_error(urls[i], null, null, null), result);
    } else {
      var ext = String(urls[i].pathExtension()).toLowerCase();
      if (AVAILABLE_EXT.indexOf(ext) !== -1) {
        result.push(urls[i]);
      }
    }
  }
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _modals = __webpack_require__(6);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _settings = __webpack_require__(2);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = settingsModal;


function settingsModal(context) {

  this.settingsValues = _settings2['default'].getSettings(context, 'placeholder');

  this.modalParams = {
    messageText: 'Settings',
    informativeText: 'Customize your imports using presets and other features.',
    height: (Object.keys(this.settingsValues).length + 1) * 73,
    width: 340,
    lineHeight: 45
  };

  this.coeffCurrentHeight = 0;
  this.adjustHeight = 0;
  this.marginLeftColRight = 130;
  this.adjust = -5;
  this.lineOne = 15;
  this.lineTwo = 0;

  (0, _modals.constructBase)('Save');

  makePresetParams();
  prefixRootObjectParams();
  quantityIconsByLine();
  marginBetweenRootObject();
  convertStrokeToFillParams();

  return {
    button: this.modal.runModal(),
    presets: String(this.presets.stringValue()).replace(/ /g, ''),
    iconsByLine: parseInt(this.iconsByLine.stringValue()) || null,
    convertStroke: this.convertStroke.state(),
    marginBetweenRootObject: this.marginBetweenRootObject.stringValue().replace(/ /g, ''),
    prefixRootObject: this.prefixRootObject.stringValue()
  };
}

function makePresetParams() {
  this.coeffCurrentHeight++;
  var yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + this.adjust;

  var textBoxLabel = _utils2['default'].createLabel('Size Presets', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(textBoxLabel);

  var presetsBox = NSTextField.alloc().initWithFrame(NSMakeRect(this.marginLeftColRight, yAxis, 145, 21));

  if (_settings2['default'].hasValue(this.settingsValues.presets)) {
    presetsBox.setStringValue(String(this.settingsValues.presets.value));
  } else {
    presetsBox.setPlaceholderString(String(this.settingsValues.presets.placeholder));
  }

  this.view.addSubview(presetsBox);

  this.coeffCurrentHeight++;
  addDescription('Set your artboard sizes and padding.', this.lineOne);
  addDescription('Format: size-padding', this.lineTwo);

  this.presets = presetsBox;
}

function convertStrokeToFillParams() {

  this.coeffCurrentHeight++;
  var yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + 30;

  var convertStrokeCheckboxLabel = _utils2['default'].createLabel('Stroke to Fill', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(convertStrokeCheckboxLabel);

  var convertStrokeCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(this.marginLeftColRight, yAxis, 200, 21));
  convertStrokeCheckBox.setButtonType(NSSwitchButton);
  convertStrokeCheckBox.setState(parseInt(this.settingsValues.convertStroke.data));
  convertStrokeCheckBox.setFont(NSFont.systemFontOfSize_(13));
  convertStrokeCheckBox.setTitle('Auto-Convert');
  this.view.addSubview(convertStrokeCheckBox);

  this.coeffCurrentHeight++;
  addDescription('This will allow you to add a dynamic color mask ', this.lineOne + 30);
  addDescription('over your outlined icons.', this.lineTwo + 30);

  this.convertStroke = convertStrokeCheckBox;
}

function quantityIconsByLine() {
  this.coeffCurrentHeight++;
  var yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + this.adjust;

  var iconByLineParamsLabel = _utils2['default'].createLabel('Icons Grid', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(iconByLineParamsLabel);
  var sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(this.marginLeftColRight, yAxis, 50, 21));

  if (String(this.settingsValues.iconsByLine.value) === 'null') {
    sizeBox.setPlaceholderString('10');
  } else {
    sizeBox.setStringValue(String(this.settingsValues.iconsByLine.value));
  }

  this.view.addSubview(sizeBox);
  var sizeBoxUnit = _utils2['default'].createLabel('icons per row', this.marginLeftColRight + 55, yAxis, 100, 20);
  this.view.addSubview(sizeBoxUnit);

  this.coeffCurrentHeight++;
  addDescription('Set the number of imported icons per row.', this.lineOne);
  // addDescription('Format: size-padding', this.lineTwo)

  this.iconsByLine = sizeBox;
}

function marginBetweenRootObject() {
  this.coeffCurrentHeight++;
  var yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + 15;

  var marginBetweenRootObjectParamsLabel = _utils2['default'].createLabel('Spacing', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(marginBetweenRootObjectParamsLabel);
  var sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(this.marginLeftColRight, yAxis, 50, 21));

  if (_settings2['default'].hasValue(this.settingsValues.marginBetweenRootObject)) {
    sizeBox.setStringValue(String(this.settingsValues.marginBetweenRootObject.value));
  } else {
    sizeBox.setPlaceholderString(String(this.settingsValues.marginBetweenRootObject.placeholder));
  }

  this.view.addSubview(sizeBox);
  var sizeBoxUnit = _utils2['default'].createLabel('px or %', this.marginLeftColRight + 55, yAxis, 100, 20);
  this.view.addSubview(sizeBoxUnit);

  this.coeffCurrentHeight++;
  addDescription('Set the spacing between the imported icons.', this.lineOne + 15);
  // addDescription('Format: size-padding', this.lineTwo)

  this.marginBetweenRootObject = sizeBox;
}

function prefixRootObjectParams() {
  this.coeffCurrentHeight++;
  var yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + this.adjust;

  var prefixRootObjectParamsLabel = _utils2['default'].createLabel('Add Prefix ', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(prefixRootObjectParamsLabel);
  var sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(this.marginLeftColRight, yAxis, 145, 21));

  if (_settings2['default'].hasValue(this.settingsValues.prefixRootObject)) {
    sizeBox.setStringValue(String(this.settingsValues.prefixRootObject.value));
  } else {
    sizeBox.setPlaceholderString(String(this.settingsValues.prefixRootObject.placeholder));
  }

  this.view.addSubview(sizeBox);

  this.coeffCurrentHeight++;
  addDescription('Add a path structure to the name of yours icons.', this.lineOne);
  addDescription('$size is equal to the size of the artboard.', this.lineTwo);

  this.prefixRootObject = sizeBox;
}

function addDescription(text, ajust) {

  var yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + ajust;

  var descriptionLabel = _utils2['default'].createLabel(text, 0, yAxis, 400, 20, true);

  this.view.addSubview(descriptionLabel);
}

/***/ }),
/* 25 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var kUUIDKey = 'google.analytics.uuid';
var uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey);
if (!uuid) {
  uuid = NSUUID.UUID().UUIDString();
  NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey);
}

function jsonToQueryString(json) {
  return '?' + Object.keys(json).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
  }).join('&');
}

exports['default'] = {
  action: action
};


function action(context, category, action, label, value) {
  var payload = {
    v: 1,
    t: 'event',
    cid: uuid,
    tid: 'UA-115448236-1',
    ec: category,
    ea: action,
    el: label,
    ev: value
  };
  send(payload);
}

function send(payload) {

  try {
    var url = NSURL.URLWithString(NSString.stringWithFormat("https://www.google-analytics.com/collect%@", jsonToQueryString(payload)));

    if (url) {
      var task = NSTask.alloc().init();
      task.setLaunchPath("/usr/bin/curl");
      task.setArguments(['-X', 'POST', String(url)]);
      var outputPipe = NSPipe.pipe();
      task.setStandardOutput(outputPipe);
      task.launch();
    }
  } catch (e) {}
}

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['importIcons'] = __skpm_run.bind(this, 'importIcons');
that['onRun'] = __skpm_run.bind(this, 'default');
that['updateIconsOnSelectedArtboards'] = __skpm_run.bind(this, 'updateIconsOnSelectedArtboards');
that['addMaskOnSelectedArtboards'] = __skpm_run.bind(this, 'addMaskOnSelectedArtboards');
that['addMaskOnSelectedArtboards'] = __skpm_run.bind(this, 'addMaskOnSelectedArtboards');
that['removeMaskOnSelectedArtboards'] = __skpm_run.bind(this, 'removeMaskOnSelectedArtboards');
that['setSettings'] = __skpm_run.bind(this, 'setSettings');
that['organizeIcons'] = __skpm_run.bind(this, 'organizeIcons');
that['executeImport'] = __skpm_run.bind(this, 'executeImport')
