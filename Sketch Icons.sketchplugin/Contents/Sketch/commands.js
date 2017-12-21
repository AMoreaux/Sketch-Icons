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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MochaJSDelegate = __webpack_require__(8);

var _MochaJSDelegate2 = _interopRequireDefault(_MochaJSDelegate);

var _logger = __webpack_require__(0);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  clearSelection: clearSelection,
  getIconNameByNSUrl: getIconNameByNSUrl,
  createLabel: createLabel,
  getSelectedArtboardsAndSymbols: getSelectedArtboardsAndSymbols,
  flatten: flatten,
  getDocumentColors: getDocumentColors,
  createWebview: createWebview,
  createDivider: createDivider,
  runFramework: runFramework,
  getImageByColor: getImageByColor,
  isArtboardMasked: isArtboardMasked

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
 * @param fontSize {Number}
 * @returns {Object} : NSTextField
 */
function createLabel(name, x, y, w, h) {
  var fontSize = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 13;


  var label = NSTextField.alloc().initWithFrame_(NSMakeRect(x, y, w, h));
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
  var selectedArtboardsAndSymbols = [];

  context.selection.forEach(function (layer) {
    var className = String(layer['class']());
    if (className !== 'MSArtboardGroup' || className !== 'MSSymbolMaster') {
      layer = layer.parentRoot();
      className = String(layer['class']());
    }

    selectedArtboardsAndSymbols.push({
      'object': layer,
      'type': className
    });
  });

  return selectedArtboardsAndSymbols;
}

/**
 * @name flatten
 * @description flatten array
 * @param list
 * @return {Array}
 */
function flatten(list) {
  return list.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
}

/**
 * @name getDocumentColors
 * @param context
 * @return {Array}
 */
function getDocumentColors(context) {
  return context.document.documentData().assets().colors();
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

        newColor = MSImmutableColor.colorWithSVGString('rgba(' + String(color.r) + ',' + String(color.g) + ',' + String(color.b) + ',' + String(color.a) + ')').newMutableCounterpart();
        pickerButton.setImage(getImageByColor(NSColor.colorWithRed_green_blue_alpha(parseInt(color.r) / 255, parseInt(color.g) / 255, parseInt(color.b) / 255, parseInt(color.a)), { width: 40, height: 30 }));
        setColor(newColor);
      }

      return webViewDidChangeLocationWithinPageForFrame;
    }()
  });

  webView.setDrawsBackground(false);
  webView.setMainFrameURL_(context.plugin.urlForResourceNamed("webview.html").path());
  webView.setFrameLoadDelegate_(delegate.getClassInstance());
  return webView;
  // view.addSubview(webView);
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

function isArtboardMasked(artboard) {
  var layers = artboard.layers();
  if (layers.length > 1 && layers[1].isMasked()) return true;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(0);

var _logger2 = _interopRequireDefault(_logger);

var _libraries = __webpack_require__(3);

var _libraries2 = _interopRequireDefault(_libraries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  initAddMaskOnSelectedArtboards: initAddMaskOnSelectedArtboards,
  addMask: addMask,
  formatSvg: formatSvg,
  dedupeLayers: dedupeLayers,
  applyMask: applyMask

  /**
   * @name initAddMaskOnSelectedArtboards
   * @description main function to add mask on selected artboards
   * @param context {Object}
   * @param params {Object}
   * @param artboards {Array} : MSArtboardGroup
   */
};
function initAddMaskOnSelectedArtboards(context, params, artboards) {
  artboards.forEach(function (artboard) {
    if (_utils2['default'].isArtboardMasked(artboard.object)) {
      MSMaskWithShape.toggleMaskForSingleShape(artboard.object.layers()[0]);
      artboard.object.layers()[1].removeFromParent();
    }
    addMask(context, artboard.object, params);
  });
  _utils2['default'].clearSelection(context);
}

/**
 * @name addMask
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param params {Object}
 */
function addMask(context, currentArtboard, params) {
  var mask = params.mask ? params.mask : null;
  formatSvg(currentArtboard);
  dedupeLayers(currentArtboard);
  if (params.color) {
    mask = getMaskSymbolFromLib(context, currentArtboard, params.color, params.colorLib);
  } else if (params.colorPicker) {
    mask = createMaskFromNean(context, currentArtboard, params.colorPicker);
  }
  applyMask(currentArtboard, mask);
}

function createMaskFromNean(context, currentArtboard, color) {
  var currentArtboardSize = currentArtboard.rect();

  var mask = MSShapeGroup.shapeWithRect({ origin: { x: 0, y: 0 }, size: { width: currentArtboardSize.size.width, height: currentArtboardSize.size.height } });
  var fill = mask.style().addStylePartOfType(0);
  fill.color = color;

  return mask;
}

/**
 * @name createMask
 * @description add mask from symbol master colors library to one artboard
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param colorSymbolMaster {Object}
 * @param colorLibrary {Object} : MSAssetLibrary
 * @return symbol {Object} : MSSymbolInstance
 */
function getMaskSymbolFromLib(context, currentArtboard, colorSymbolMaster, colorLibrary) {
  _utils2['default'].clearSelection(context);
  var librairiesController = AppController.sharedInstance().librariesController();
  var symbolMaster = librairiesController.importForeignSymbol_fromLibrary_intoDocument(colorSymbolMaster, colorLibrary, context.document.documentData());
  return symbolMaster.symbolMaster().newSymbolInstance();
}

/**
 * @name applyMask
 * @param currentArtboard
 * @param symbolInstance
 */
function applyMask(currentArtboard, mask) {
  var currentArtboardSize = currentArtboard.rect();
  mask.setHeightRespectingProportions(currentArtboardSize.size.height);
  mask.setWidthRespectingProportions(currentArtboardSize.size.width);
  mask.setName('🎨 color');
  currentArtboard.addLayer(mask);
  MSMaskWithShape.toggleMaskForSingleShape(currentArtboard.layers()[0]);
}

/**
 * @name formatSvg
 * @description ungroup all layers in an artboard
 * @param currentArtboard {Object} : MSArtboardGroup
 */
function formatSvg(currentArtboard) {
  currentArtboard.children().forEach(function (layer) {
    var layerClass = String(layer['class']());
    if (layerClass === "MSLayerGroup" || layerClass === "MSShapeGroup") {
      layer.ungroup();
    }
  });
}

/**
 * @name dedupeLayers
 * @description get all shapes and merge them in one shape group
 * @param currentArtboard {Object} : MSArtboardGroup
 */
function dedupeLayers(currentArtboard) {
  var container = MSShapeGroup.shapeWithRect(null);
  container.setName('container-random-string-9246392');
  currentArtboard.addLayer(container);
  var reg = new RegExp("Shape");

  currentArtboard.children().forEach(function (layer) {

    var layerClass = String(layer['class']());

    if (layerClass === 'MSRectangleShape' && String(layer.name()) === 'container-random-string-9246392') {
      return layer.removeFromParent();
    }

    if (reg.test(layerClass) && layerClass !== 'MSShapeGroup') {
      layer.moveToLayer_beforeLayer(container, layer);
    }
  });

  container.setName("icon");
  // container.resizeToFitChildrenWithOption(0)
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = __webpack_require__(0);

var _logger2 = _interopRequireDefault(_logger);

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _modals = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = {
  getLibs: getLibs,
  getLibById: getLibById,
  loadColorFromSelectedLib: loadColorFromSelectedLib,
  initLibsSelectList: initLibsSelectList,
  initColorSelectList: initColorSelectList

  /**
   * @name getLibs
   * @description get all libraries
   * @returns {Array}
   */
};
function getLibs() {
  return AppController.sharedInstance().librariesController().userLibraries().slice().map(function (lib) {
    return lib;
  });
}

/**
 * @name getLibById
 * @description return library by id
 * @param libraryId
 * @returns {Object} : MSAssetLibrary
 */
function getLibById(libraryId) {
  return AppController.sharedInstance().librariesController().userLibraries().slice().filter(function (lib) {
    return String(libraryId) === String(lib.libraryID());
  })[0];
}

/**
 * @name loadColorFromSelectedLib
 * @description get colors form lib selected
 * @param lib
 * @param colorMenu
 * @returns {Array}
 */
function loadColorFromSelectedLib(lib, colorMenu) {
  colorMenu.removeAllItems();

  var libraryInstance = lib.representedObject();
  libraryInstance.loadSynchronously();

  return getColorSymbolsFromDocument(libraryInstance.document());
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
      updateColorMenu(context, lib, colorMenu);
    });
  }

  var colorLibsMenu = NSMenu.alloc().init();
  var currentFile = NSMenuItem.alloc().init();
  currentFile.title = 'Current file';
  addListener(currentFile);
  colorLibsMenu.addItem(currentFile);
  libs.forEach(function (lib) {
    var item = NSMenuItem.alloc().init();
    item.title = lib.name();
    item.representedObject = lib;
    colorLibsMenu.addItem(item);
    addListener(item);
  });

  updateColorMenu(context, currentFile, colorMenu);

  return colorLibsMenu;
}

function updateColorMenu(context, lib, colorMenu) {
  var colors = [];
  if (String(lib.title()) === 'Current file') {
    colors = getColorSymbolsFromDocument(context.document.documentData());
  } else {
    colors = loadColorFromSelectedLib(lib, colorMenu);
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

function getColorSymbolsFromDocument(document) {
  var result = [];
  var layers = void 0;
  document.localSymbols().forEach(function (symbol) {
    layers = symbol.layers();
    if (layers.length === 0 && symbol.backgroundColor()) {
      result.push({
        color: symbol.backgroundColor(),
        symbol: symbol
      });
    } else if (layers.length === 1 && layers[0].style().hasEnabledFill()) {
      result.push({
        color: layers[0].style().fills()[0].color(),
        symbol: symbol
      });
    }
  });

  return result;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(0);

var _logger2 = _interopRequireDefault(_logger);

var _mask = __webpack_require__(2);

var _mask2 = _interopRequireDefault(_mask);

var _svg = __webpack_require__(6);

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// @import './utils/utils.js'
// @import './providers/mask.cocoascript'
// @import './providers/svg.cocoascript'

exports['default'] = {
  createArtboard: createArtboard,
  initArtboardsParams: initArtboardsParams,
  initImportIcons: initImportIcons,
  getPaddingAndSize: getPaddingAndSize
};


var artboardParams = {
  position: {
    x: 0,
    y: 0
  },
  size: {
    height: 0,
    width: 0
  }

  /**
   * @name createArtboard
   * @description set position and size and create artboard
   * @param context {Object} :
   * @param index {Number}
   * @param icon {Object} : NSurl
   * @returns {Object} : MSArtboardGroup
   */
};function createArtboard(context, index, icon) {
  if (index % 10 === 0) {
    artboardParams.position.y += artboardParams.size.width * 2;
    artboardParams.position.x = artboardParams.size.width;
  } else {
    artboardParams.position.x += 2 * artboardParams.size.width;
  }
  var newArtboard = MSArtboardGroup['new']();
  newArtboard.setName(_utils2['default'].getIconNameByNSUrl(icon));
  var newArtboardFrame = newArtboard.frame();
  newArtboardFrame.setWidth(artboardParams.size.width);
  newArtboardFrame.setHeight(artboardParams.size.height);
  newArtboardFrame.setX(artboardParams.position.x);
  newArtboardFrame.setY(artboardParams.position.y);
  context.document.currentPage().addLayers([newArtboard]);

  return newArtboard;
}

/**
 * @name initArtboardsParams
 * @description initialisation for new artboard position
 * @param context
 */
function initArtboardsParams(context) {
  var currentPage = context.api().selectedDocument.selectedPage;
  if (currentPage.sketchObject.children().length === 1) {
    artboardParams.position.x = artboardParams.position.y = artboardParams.size.width * 2;
  } else {
    var Y = [];
    currentPage.iterateWithFilter('isArtboard', function (layer) {
      Y.push(layer.sketchObject.origin().y);
    });
    currentPage.sketchObject.symbols().forEach(function (symbols) {
      Y.push(symbols.origin().y);
    });
    artboardParams.position.x = artboardParams.size.width * 2;
    artboardParams.position.y = Math.max.apply(Math, Y);
  }
}

/**
 * @name initImportIcons
 * @description main function to import multiple icons and mask on new artboard
 * @param context {Object}
 * @param params: {Object}
 */
function initImportIcons(context, params) {
  _utils2['default'].clearSelection(context);
  artboardParams.size.height = artboardParams.size.width = params.artboardSize;
  initArtboardsParams(context);
  var newArtboard = void 0;
  params.listIcon.forEach(function (icon, index) {
    try {
      newArtboard = createArtboard(context, index, icon);
      _svg2['default'].addSVG(context, newArtboard, params.iconPadding, icon);
      if (params.withMask) _mask2['default'].addMask(context, newArtboard, params);
      if (params.convertSymbol) MSSymbolMaster.convertArtboardToSymbol(newArtboard);
    } catch (e) {
      _logger2['default'].log("Sorry, Error !!!");
      _logger2['default'].log(e);
      _logger2['default'].log(icon);
    }
  });
  _utils2['default'].clearSelection(context);
}

/**
 * @name getPaddingAndSize
 * @description get padding and size by artboard
 * @param artboard {Object} : MSArtboardGroup
 * @returns {{iconPadding: Number, artboardSize: Number}}
 */
function getPaddingAndSize(artboard) {
  return {
    iconPadding: parseInt(artboard.layers()[0].rect().origin.x),
    artboardSize: parseInt(artboard.rect().size.width)
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maskModal = exports.importModal = exports.setEnabledColorMenu = undefined;

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(0);

var _logger2 = _interopRequireDefault(_logger);

var _libraries = __webpack_require__(3);

var _libraries2 = _interopRequireDefault(_libraries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var disabledColor = NSColor.colorWithCalibratedRed_green_blue_alpha(170 / 255, 170 / 255, 170 / 255, 1);

exports.setEnabledColorMenu = setEnabledColorMenu;
exports.importModal = importModal;
exports.maskModal = maskModal;


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

  constructBase(this.modalParams);

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

  this.modalParams = {
    messageText: 'Configure your import',
    informativeText: 'Your icons will be arranged in artboards. Set size and padding of your artboards.',
    height: 300,
    width: 300,
    lineHeight: 35
  };

  this.coeffCurrentHeight = 0;
  this.isLibrarySource = true;

  constructBase(this.modalParams);
  makeArtboardParams();
  this.view.addSubview(_utils2['default'].createDivider(NSMakeRect(0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - 10, this.modalParams.width, 1)));
  makeSymbolParams();
  this.view.addSubview(_utils2['default'].createDivider(NSMakeRect(0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - 10, this.modalParams.width, 1)));
  makeMaskCheckboxParams();
  makeMaskRadioButtonParams();
  this.radioParams.setEnabled(false);
  makeMaskLibraryParams(context);
  setEnabledColorLibraryMenu(false);
  setEnabledColorMenu(false);
  makeMaskColorPickerParams(context);
  addListenerOnMaskCheckbox();

  var result = {
    button: this.modal.runModal(),
    artboardSize: parseInt(this.artboardSize.stringValue()),
    iconPadding: parseInt(this.artboardPadding.stringValue()),
    convertSymbol: this.symbolParams.state(),
    withMask: this.checkboxMaskParams.state()
  };

  if (result.withMask && this.isLibrarySource) {
    var colorMenu = this.colorsMenuParams.selectedItem();
    result.color = colorMenu ? this.colorsMenuParams.representedObject() : null;

    var colorLib = this.colorLibsMenuParams.selectedItem();
    result.colorLib = colorLib ? this.colorLibsMenuParams.representedObject() : null;
  } else if (result.withMask) {
    result.colorPicker = this.colorPickerColor;
  }

  return result;
}

function constructBase() {

  this.modal = COSAlertWindow['new']();

  this.view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, this.modalParams.width, this.modalParams.height));

  this.modal.addAccessoryView(this.view);
  this.modal.setMessageText(this.modalParams.messageText);
  this.modal.setInformativeText(this.modalParams.informativeText);
  this.modal.addButtonWithTitle('Continue');
  this.modal.addButtonWithTitle('Cancel');
}

function makeArtboardParams() {

  this.coeffCurrentHeight++;

  var textBoxLabel = _utils2['default'].createLabel('Artboard size', 0, this.modalParams.height - this.modalParams.lineHeight, 150, 20);
  this.view.addSubview(textBoxLabel);
  var textBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight, 50, 20));
  textBox.setStringValue('24');
  this.view.addSubview(textBox);
  var textBoxUnit = _utils2['default'].createLabel('px', 205, this.modalParams.height - this.modalParams.lineHeight, 50, 20);
  this.view.addSubview(textBoxUnit);

  this.coeffCurrentHeight++;

  var paddingBoxLabel = _utils2['default'].createLabel('Artboard Padding', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 150, 20);
  this.view.addSubview(paddingBoxLabel);
  var paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 50, 20));
  paddingBox.setStringValue('3');
  this.view.addSubview(paddingBox);
  var paddingBoxUnit = _utils2['default'].createLabel('px', 205, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 50, 20);
  this.view.addSubview(paddingBoxUnit);

  this.artboardPadding = paddingBox;
  this.artboardSize = textBox;

  return;
}

function makeSymbolParams() {

  this.coeffCurrentHeight++;

  var maskCheckboxLabel = _utils2['default'].createLabel('Symbols', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 150, 20);
  this.view.addSubview(maskCheckboxLabel);

  var symbolCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 200, 20));
  symbolCheckBox.setButtonType(NSSwitchButton);
  symbolCheckBox.setState(true);
  symbolCheckBox.setFont(NSFont.systemFontOfSize_(13));
  symbolCheckBox.setTitle('Convert to symbol');
  this.view.addSubview(symbolCheckBox);

  this.symbolParams = symbolCheckBox;
}

function makeMaskCheckboxParams() {

  this.coeffCurrentHeight++;

  var maskCheckboxLabel = _utils2['default'].createLabel('Mask', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 150, 20);
  this.view.addSubview(maskCheckboxLabel);

  var maskCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 200, 20));
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

  var radioButtonLabel = _utils2['default'].createLabel('Color Source', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + 40, 150, 20);
  this.view.addSubview(radioButtonLabel);

  var buttonFormat = NSButtonCell.alloc().init();
  buttonFormat.setButtonType(NSRadioButton);
  var matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 300, 60), NSRadioModeMatrix, buttonFormat, 2, 1);
  matrixFormat.setCellSize(CGSizeMake(300, 25));
  var cells = matrixFormat.cells();
  cells[0].setTitle("From symbols");
  cells[0].setFont(NSFont.systemFontOfSize_(13));
  cells[1].setTitle("From color picker");
  cells[1].setFont(NSFont.systemFontOfSize_(13));

  this.view.addSubview(matrixFormat);

  setListenerRadioButon(cells);

  this.radioParams = matrixFormat;
}

function makeMaskLibraryParams(context) {

  this.coeffCurrentHeight++;

  var colorLibsLabel = _utils2['default'].createLabel('Document Source', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 150, 25);
  this.view.addSubview(colorLibsLabel);
  var colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 130, 30));

  this.coeffCurrentHeight++;

  var colorMenuLabel = _utils2['default'].createLabel('Color', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 150, 25);
  this.view.addSubview(colorMenuLabel);
  var colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 130, 30));

  this.view.addSubview(colorLibsMenu);
  this.view.addSubview(colorMenu);

  this.colorLibsMenuParams = colorLibsMenu;
  this.colorsMenuParams = colorMenu;
  this.colorLibsMenuParamsLabel = colorLibsLabel;
  this.colorsMenuParamsLabel = colorMenuLabel;

  colorLibsMenu.menu = _libraries2['default'].initLibsSelectList(context, _libraries2['default'].getLibs(), colorMenu);
}

function makeMaskColorPickerParams(context) {
  var _this = this;

  var colorPickerLabel = _utils2['default'].createLabel('Color picker', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + 20, 150, 20);

  var pickerView = NSView.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 130, 60));
  pickerView.setWantsLayer(true);
  pickerView.layer().setBackgroundColor(CGColorCreateGenericRGB(1, 1, 1, 1.0));
  pickerView.layer().setBorderColor(CGColorCreateGenericRGB(186 / 255, 186 / 255, 186 / 255, 1));
  pickerView.layer().borderWidth = 1;
  // pickerView.layer.backgroundColor = NSColor.colorWithCalibratedRed_green_blue_alpha(0.227, 0.251, 0.337, 1).CGColor

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
    main.openPopover_onView_withWebview(pickerButton, _this.view, _utils2['default'].createWebview(context, pickerButton, function (color) {
      _this.colorPickerColor = color;
      hexLabel.setStringValue_('#' + String(color.immutableModelObject().hexValue()));
    }));
  });

  pickerView.addSubview(pickerButton);

  this.pickerView = pickerView;
  this.colorPickerParams = pickerButton;
  this.colorPickerLabel = colorPickerLabel;
}

function addListenerOnMaskCheckbox() {
  var _this2 = this;

  this.checkboxMaskParams.setCOSJSTargetFunction(function (mask) {
    if (mask.state()) {
      setEnabledRadioButton(true);
      setEnabledColorLibraryMenu(true);
      if (_this2.colorsMenuParams.numberOfItems() > 0) setEnabledColorMenu(true);
    } else {
      setEnabledRadioButton(false);
      setEnabledColorLibraryMenu(false);
      setEnabledColorMenu(false);
      addLibraryColorsFields();
      removePickerButton();
      _this2.radioParams.cells()[0].state = true;
      _this2.radioParams.cells()[1].state = false;
    }
  });
}

function setListenerRadioButon(cells) {
  function setState(item) {
    if (String(item.selectedCells()[0].title()) === 'From symbols') {
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
  var color = void 0;
  if (enabled) {
    color = NSColor.controlTextColor();
  } else {
    color = disabledColor;
    // this.colorsMenuParams.removeAllItems()
  }
  this.colorsMenuParamsLabel.setTextColor(color);
  this.colorsMenuParams.setEnabled(enabled);
}

function setEnabledRadioButton(enabled) {
  this.radioParams.setEnabled(enabled);
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mask = __webpack_require__(2);

var _mask2 = _interopRequireDefault(_mask);

var _artboard = __webpack_require__(4);

var _artboard2 = _interopRequireDefault(_artboard);

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(0);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  initUpdateIconsSelectedArtboards: initUpdateIconsSelectedArtboards,
  addSVG: addSVG,
  resizeSVG: resizeSVG,
  removeTxt: removeTxt

  /**
   * @name initUpdateIconsSelectedArtboards
   * @description main function to update multiple icons on selected artboard
   * @param context
   * @param listIcon {Array} : NSUrl
   * @param artboards {Array} : MSArtboardGroup && MSSymbolMaster
   */
};
function initUpdateIconsSelectedArtboards(context, artboards, listIcon) {

  artboards.forEach(function (artboard, index) {
    var layers = artboard.object.layers();
    var isMasked = _utils2['default'].isArtboardMasked(artboard.object);
    var params = Object.assign(_artboard2['default'].getPaddingAndSize(artboard.object), { iconPath: listIcon[index] });
    layers[0].removeFromParent();
    addSVG(context, artboard.object, params.iconPadding, params.iconPath);
    if (isMasked) {
      params.mask = layers[0].copy();
      layers[0].removeFromParent();
      _mask2['default'].addMask(context, artboard.object, params);
    }
    artboard.object.setName(_utils2['default'].getIconNameByNSUrl(params.iconPath));
  });

  _utils2['default'].clearSelection(context);
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
  _utils2['default'].clearSelection(context);
  var svgImporter = MSSVGImporter.svgImporter();
  var svgURL = NSURL.fileURLWithPath(iconPath.path());
  svgImporter.prepareToImportFromURL(svgURL);
  var svgLayer = svgImporter.importAsLayer();
  removeTxt(svgLayer);
  artboard.addLayer(svgLayer);
  var svgLayerFrame = svgLayer.frame();
  resizeSVG(svgLayerFrame, artboard, iconPadding);
}

/**
 * @name resizeSVG
 * @description resize layer by artboard
 * @param svgLayerFrame {Object} : MSShape*
 * @param artboard {Object} : MSArtboardGroup
 * @param iconPadding {Number}
 */
function resizeSVG(svgLayerFrame, artboard, iconPadding) {

  var currentArtboardRect = artboard.rect();
  var currentArtboardSize = {
    width: parseInt(currentArtboardRect.size.width),
    height: parseInt(currentArtboardRect.size.height)
  };
  var width = svgLayerFrame.width();
  var height = svgLayerFrame.height();
  var newPadding = void 0,
      newHeight = void 0,
      newWidth = void 0;

  if (width === height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding);
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding);
    svgLayerFrame.setX(iconPadding);
    svgLayerFrame.setY(iconPadding);
  } else if (width >= height) {
    svgLayerFrame.setWidth(currentArtboardSize.width - 2 * iconPadding);
    svgLayerFrame.setX(iconPadding);
    newHeight = height * (currentArtboardSize.height - 2 * iconPadding) / width;
    newHeight = newHeight < 1 ? 1 : newHeight;
    newPadding = (currentArtboardSize.width - 2 * iconPadding) / 2 + iconPadding - newHeight / 2;

    svgLayerFrame.setHeight(newHeight);
    svgLayerFrame.setY(newPadding);
  } else {
    svgLayerFrame.setHeight(currentArtboardSize.height - 2 * iconPadding);
    svgLayerFrame.setY(iconPadding);

    newWidth = width * (currentArtboardSize.width - 2 * iconPadding) / height;
    newWidth = newWidth < 1 ? 1 : newWidth;
    newPadding = (currentArtboardSize.height - 2 * iconPadding) / 2 + iconPadding - newWidth / 2;

    svgLayerFrame.setWidth(newWidth);
    svgLayerFrame.setX(newPadding);
  }
}

/**
 * @name removeTxt
 * @description remove text form svg
 * @param svgLayer {Object}
 */
function removeTxt(svgLayer) {

  var scope = svgLayer.children(),
      predicate = NSPredicate.predicateWithFormat("(className == %@)", "MSTextLayer"),
      layers = scope.filteredArrayUsingPredicate(predicate);

  var loop = layers.objectEnumerator();
  var layer = void 0;
  while (layer = loop.nextObject()) {
    layer.removeFromParent();
  }
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importIcons = importIcons;
exports.updateIconsOnSelectedArtboards = updateIconsOnSelectedArtboards;
exports.addMaskOnSelectedArtboards = addMaskOnSelectedArtboards;
exports.updateMaskOnSelectedArtboards = updateMaskOnSelectedArtboards;

var _logger = __webpack_require__(0);

var _logger2 = _interopRequireDefault(_logger);

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _artboard = __webpack_require__(4);

var _artboard2 = _interopRequireDefault(_artboard);

var _mask = __webpack_require__(2);

var _mask2 = _interopRequireDefault(_mask);

var _modals = __webpack_require__(9);

var _modals2 = _interopRequireDefault(_modals);

var _files = __webpack_require__(10);

var _files2 = _interopRequireDefault(_files);

var _svg = __webpack_require__(6);

var _svg2 = _interopRequireDefault(_svg);

var _modals3 = __webpack_require__(5);

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
  _artboard2['default'].initImportIcons(context, params);
}

/**
 * @name updateIconsOnSelectedArtboards
 * @description trigger to start feature to update icon
 * @param context
 */
function updateIconsOnSelectedArtboards(context) {
  var selectedArtboardsAndSymbols = _utils2['default'].getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return _modals2['default'].newErrorModal('No artboards selected', 'Please select one or more artboards to replace icons.');
  var listIcon = _files2['default'].selectIconsFiles();
  if (!listIcon.length) return;
  if (selectedArtboardsAndSymbols.length > listIcon.length) return _modals2['default'].newErrorModal('Too much artboards selected', 'Please select as many artboards as icons.');
  if (selectedArtboardsAndSymbols.length < listIcon.length) return _modals2['default'].newErrorModal('Too much icons selected', 'Please select as many icons as artboards.');
  _svg2['default'].initUpdateIconsSelectedArtboards(context, selectedArtboardsAndSymbols, listIcon);
}

/**
 * @name addMaskOnSelectedArtboards
 * @description trigger to start feature to add mask
 * @param context
 */
function addMaskOnSelectedArtboards(context) {
  var selectedArtboardsAndSymbols = _utils2['default'].getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return _modals2['default'].newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.');
  var params = (0, _modals3.maskModal)(context);
  if (params.button !== 1000) return;
  _mask2['default'].initAddMaskOnSelectedArtboards(context, params, selectedArtboardsAndSymbols);
}

/**
 * @name updateMaskOnSelectedArtboards
 * @description trigger to start feature to update mask
 * @param context
 */
function updateMaskOnSelectedArtboards(context) {
  var selectedArtboardsAndSymbols = _utils2['default'].getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return _modals2['default'].newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.');
  var params = (0, _modals3.maskModal)(context);
  if (params.button !== 1000) return;
  _mask2['default'].initAddMaskOnSelectedArtboards(context, params, selectedArtboardsAndSymbols);
}

/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _libraries = __webpack_require__(3);

var _libraries2 = _interopRequireDefault(_libraries);

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(0);

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

  colorLibsMenu.menu = _libraries2['default'].initLibsSelectList(_libraries2['default'].getLibs(), colorMenu);

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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = __webpack_require__(0);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports["default"] = {
  selectIconsFiles: selectIconsFiles,
  getFilesByUrls: getFilesByUrls

  /**
   * @name selectIconsFiles
   * @description display modal selection file and return them
   * @returns {Array.NSFile}
   */
};
function selectIconsFiles() {

  var panel = NSOpenPanel.openPanel();
  panel.setAllowsMultipleSelection(true);
  panel.setCanChooseDirectories(true);
  panel.setAllowedFileTypes(["svg"]);
  panel.setCanChooseFiles(true);
  panel.setPrompt("Select");

  if (panel.runModal() !== NSFileHandlingPanelOKButton) return [];

  return getFilesByUrls(panel.URLs());
}

/**
 * @name getFilesByUrls
 * @description get file from list of folder and path
 * @param urls {Array.NSurl}
 * @returns {Array.NSFile}
 */
function getFilesByUrls(urls) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(urls.slice().map(function (path) {
    if (path.toString().split('.').pop() === 'svg') {
      return path;
    } else {
      return NSFileManager.defaultManager().contentsOfDirectoryAtURL_includingPropertiesForKeys_options_error(path, null, null, null).slice().filter(function (path) {
        if (path.toString().split('.').pop() === 'svg') {
          return true;
        }
      });
    }
  })));
}

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
that['updateMaskOnSelectedArtboards'] = __skpm_run.bind(this, 'updateMaskOnSelectedArtboards')
