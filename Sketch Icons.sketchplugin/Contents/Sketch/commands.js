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
exports['default'] = {
  clearSelection: clearSelection,
  getIconNameByNSUrl: getIconNameByNSUrl,
  createLabel: createLabel,
  getSelectedArtboardsAndSymbols: getSelectedArtboardsAndSymbols,
  flatten: flatten,
  getDocumentColors: getDocumentColors

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
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

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

  if (!lib.title().length()) {
    return colorMenu.setEnabled(false);
  }

  var libraryInstance = lib.representedObject();
  libraryInstance.loadSynchronously();

  var colors = [];

  libraryInstance.document().localSymbols().forEach(function (symbol) {
    var hasStyle = symbol.layers()[0].style().hasEnabledFill();
    if (hasStyle) {
      colors.push({
        color: hasStyle ? symbol.layers()[0].style().fills().firstObject().color() : null,
        symbol: symbol
      });
    }
  });

  if (colors.length > 0) {
    initColorSelectList(colorMenu, colors);
    colorMenu.setEnabled(true);
  } else {
    colorMenu.setEnabled(false);
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
      loadColorFromSelectedLib(lib, colorMenu);
    });
  }

  var colorLibsMenu = NSMenu.alloc().init();
  var empty = NSMenuItem.alloc().init();
  empty.title = "";
  addListener(empty);
  colorLibsMenu.addItem(empty);
  libs.forEach(function (lib) {
    var item = NSMenuItem.alloc().init();
    item.title = lib.name();
    item.representedObject = lib;
    colorLibsMenu.addItem(item);
    addListener(item);
  });

  return colorLibsMenu;
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
    var size = CGSizeMake(14, 14);
    var image = NSImage.alloc().init();
    image.size = size;
    image.lockFocus();
    var colorCell = MSBackgroundColorView.alloc().init();
    colorCell.backgroundColor = color;
    colorCell.drawRect(NSMakeRect(0, 0, 14, 14));
    image.unlockFocus();

    return image;
  }

  var menu = NSMenu.alloc().init();

  menu.cancelTracking();

  colors.forEach(function (color) {
    var item = NSMenuItem.alloc().init();
    item.title = color.symbol ? color.symbol.name() : "";
    var colorRGBA = color.color ? NSColor.colorWithRed_green_blue_alpha(color.color.red(), color.color.green(), color.color.blue(), color.color.alpha()) : NSColor.colorWithRed_green_blue_alpha(color.red(), color.green(), color.blue(), color.alpha());
    item.representedObject = color.symbol ? color.symbol : colorRGBA;
    item.image = swatch(colorRGBA);
    menu.addItem(item);
  });

  popColorMenu.menu = menu;
  return popColorMenu;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _libraries = __webpack_require__(2);

var _libraries2 = _interopRequireDefault(_libraries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  initAddMaskOnSelectedArtboards: initAddMaskOnSelectedArtboards,
  addMask: addMask,
  createMask: createMask,
  formatSvg: formatSvg,
  dedupeLayers: dedupeLayers,
  getMaskProperties: getMaskProperties

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
    addMask(context, artboard.object, params);
  });
}

/**
 * @name addMask
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param params {Object}
 */
function addMask(context, currentArtboard, params) {
  formatSvg(currentArtboard);
  dedupeLayers(currentArtboard);
  createMask(context, currentArtboard, params.color, params.colorLib);
}

/**
 * @name createMask
 * @description add mask from symbol master colors library to one artboard
 * @param context {Object}
 * @param currentArtboard {Object} : MSArtboardGroup
 * @param colorSymbolMaster {Object}
 * @param colorLibrary {Object} : MSAssetLibrary
 */
function createMask(context, currentArtboard, colorSymbolMaster, colorLibrary) {
  _utils2['default'].clearSelection(context);
  var librairiesController = AppController.sharedInstance().librariesController();
  var symbolMaster = librairiesController.importForeignSymbol_fromLibrary_intoDocument(colorSymbolMaster, colorLibrary, context.document.documentData());

  var symbolInstance = symbolMaster.symbolMaster().newSymbolInstance();

  var currentArtboardSize = currentArtboard.rect();
  symbolInstance.setHeightRespectingProportions(currentArtboardSize.size.height);
  symbolInstance.setWidthRespectingProportions(currentArtboardSize.size.width);
  symbolInstance.setName('🎨 color');
  currentArtboard.addLayer(symbolInstance);
  currentArtboard.layers()[0].prepareAsMask();
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
  container.resizeToFitChildrenWithOption(0);
}

/**
 * @name getMaskProperties
 * @description get properties of mask by artboard
 * @param artboard {Object} : MSArtboardGroup
 * @returns {Object}
 */
function getMaskProperties(artboard) {
  var layers = artboard.layers();

  if (layers.length <= 1 || !layers[1].isMasked()) {
    return {
      'color': null,
      'colorLib': null
    };
  }

  var color = layers[1].symbolMaster();
  var colorLib = _libraries2['default'].getLibById(color.foreignSymbol().libraryID());

  return {
    'color': color,
    'colorLib': colorLib
  };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _mask = __webpack_require__(3);

var _mask2 = _interopRequireDefault(_mask);

var _svg = __webpack_require__(5);

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
    // try {
    newArtboard = createArtboard(context, index, icon);
    _svg2['default'].addSVG(context, newArtboard, params.iconPadding, icon);
    if (params.withMask && params.color && params.colorLib) _mask2['default'].addMask(context, newArtboard, params);
    if (params.convertSymbol) MSSymbolMaster.convertArtboardToSymbol(newArtboard);
    // } catch (e) {
    //   logger.log("Sorry, Error !!!")
    //   logger.log(e)
    //   logger.log(icon)
    // }
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

var _mask = __webpack_require__(3);

var _mask2 = _interopRequireDefault(_mask);

var _artboard = __webpack_require__(4);

var _artboard2 = _interopRequireDefault(_artboard);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

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
    var params = Object.assign(_artboard2['default'].getPaddingAndSize(artboard.object), _mask2['default'].getMaskProperties(artboard.object), { iconPath: listIcon[index] });
    artboard.object.removeAllLayers();
    addSVG(context, artboard.object, params.iconPadding, params.iconPath);
    if (params.color && params.colorLib) _mask2['default'].addMask(context, artboard.object, params);
    artboard.object.setName(_utils2['default'].getIconNameByNSUrl(params.iconPath));
  });
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _libraries = __webpack_require__(2);

var _libraries2 = _interopRequireDefault(_libraries);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

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

  // modal.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("model1.jpg").path()));

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
 * @param checkboxFields {Object}
 * @returns {[null,null]}
 */
function createMaskFields(checkboxFields, context) {

  var colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 130, 20));
  var colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(140, 0, 130, 20));
  // const documentColorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(200, 0, 50, 20));

  colorLibsMenu.setEnabled(false);
  colorMenu.setEnabled(false);
  // documentColorMenu.setEnabled(false)

  colorLibsMenu.menu = _libraries2['default'].initLibsSelectList(_libraries2['default'].getLibs(), colorMenu);
  // libraries.initColorSelectList(documentColorMenu, utils.getDocumentColors(context))

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
    //   {
    //   item: documentColorMenu,
    //   label: utils.createLabel('Document Color', 200, 25, 130, 20),
    //   name: 'colorDoc',
    //   getter: function () {
    //     let currentItem = this.item.selectedItem()
    //     return (currentItem) ? currentItem.representedObject() : null
    //   }
    // }
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importIcons = importIcons;
exports.updateIconsOnSelectedArtboards = updateIconsOnSelectedArtboards;
exports.addMaskOnSelectedArtboards = addMaskOnSelectedArtboards;

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _libraries = __webpack_require__(2);

var _libraries2 = _interopRequireDefault(_libraries);

var _artboard = __webpack_require__(4);

var _artboard2 = _interopRequireDefault(_artboard);

var _mask = __webpack_require__(3);

var _mask2 = _interopRequireDefault(_mask);

var _modals = __webpack_require__(6);

var _modals2 = _interopRequireDefault(_modals);

var _files = __webpack_require__(8);

var _files2 = _interopRequireDefault(_files);

var _svg = __webpack_require__(5);

var _svg2 = _interopRequireDefault(_svg);

var _importIcons = __webpack_require__(9);

var _importIcons2 = _interopRequireDefault(_importIcons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @name importIcons
 * @description trigger to start feature to import icons
 * @param context
 */
function importIcons(context) {
  var params = _importIcons2['default'].getImportIconsParams(context);
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
  var params = _importIcons2['default'].getAddMaskOnSelectedArtboardsParams(context);
  if (params.button !== 1000) return;
  _mask2['default'].initAddMaskOnSelectedArtboards(context, params, selectedArtboardsAndSymbols);
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = __webpack_require__(1);

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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _modals = __webpack_require__(6);

var _modals2 = _interopRequireDefault(_modals);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  getImportIconsParams: getImportIconsParams,
  getAddMaskOnSelectedArtboardsParams: getAddMaskOnSelectedArtboardsParams

  /**
   * @name getImportIconsSelectedArtboardsParams
   * @description get params for the "getImportIconsParams" feature
   * @returns {Object}
   */
};
function getImportIconsParams(context) {

  var viewSize = {
    width: 300,
    height: 175
  };

  var modalParams = {
    messageText: 'Configure your import',
    informativeText: 'Your icons will be arranged in artboards. Set size and padding of your artboards.'
  };

  var modal = _modals2['default'].newModal(context, viewSize, modalParams);
  var checkboxFields = _modals2['default'].createCheckBoxes();
  var maskFields = _modals2['default'].createMaskFields(checkboxFields, context);
  var artboardFields = _modals2['default'].createArtboardFields();

  var allFields = [artboardFields, checkboxFields, maskFields];
  _modals2['default'].appendsFields(modal, allFields, true);
  _modals2['default'].setNextKey(_utils2['default'].flatten(allFields));

  var viewCell = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewSize.width, 25));
  viewCell.addSubview(_utils2['default'].createLabel('Works only with color symbols.', 0, 0, 300, 20, 11));
  modal.view.addSubview(viewCell);

  return Object.assign(_modals2['default'].getMainButtonParam(_modals2['default'].runModal(modal)), _modals2['default'].getParams(allFields));
}

/**
 * @name getAddMaskOnSelectedArtboardsParams
 * @description get params for the "AddMaskOnSelectedArtboards" feature
 * @returns {Object}
 */
function getAddMaskOnSelectedArtboardsParams(context) {
  var viewSize = {
    width: 300,
    height: 43
  };

  var modalParams = {
    informativeText: 'Select your library and choose a color to apply as mask. Your layers will all be combined.',
    messageText: 'Configure your color mask'
  };

  var modal = _modals2['default'].newModal(context, viewSize, modalParams);
  var maskFields = _modals2['default'].createMaskFields();
  var allFields = [maskFields];
  _modals2['default'].appendsFields(modal, allFields);
  _modals2['default'].setNextKey(_utils2['default'].flatten(allFields));

  return Object.assign(_modals2['default'].getMainButtonParam(_modals2['default'].runModal(modal)), _modals2['default'].getParams(allFields));
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
that['addMaskOnSelectedArtboards'] = __skpm_run.bind(this, 'addMaskOnSelectedArtboards')
