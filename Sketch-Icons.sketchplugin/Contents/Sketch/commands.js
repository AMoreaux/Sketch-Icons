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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/commands.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/commands.js":
/*!*************************!*\
  !*** ./src/commands.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importIcons = importIcons;
exports.updateIconsOnSelectedArtboards = updateIconsOnSelectedArtboards;
exports.organizeIcons = organizeIcons;
exports.addMaskOnSelectedArtboards = addMaskOnSelectedArtboards;
exports.removeMaskOnSelectedArtboards = removeMaskOnSelectedArtboards;
exports.setSettings = setSettings;

var _utils = _interopRequireDefault(__webpack_require__(/*! ./utils/utils */ "./src/utils/utils.js"));

var _artboard = _interopRequireDefault(__webpack_require__(/*! ./providers/artboard */ "./src/providers/artboard.js"));

var _mask = _interopRequireDefault(__webpack_require__(/*! ./providers/mask */ "./src/providers/mask.js"));

var _modals = _interopRequireDefault(__webpack_require__(/*! ./utils/modals */ "./src/utils/modals.js"));

var _files = _interopRequireDefault(__webpack_require__(/*! ./providers/files */ "./src/providers/files.js"));

var _svg = _interopRequireDefault(__webpack_require__(/*! ./providers/svg */ "./src/providers/svg.js"));

var _modals2 = __webpack_require__(/*! ./modals/modals */ "./src/modals/modals.js");

var _settings = _interopRequireDefault(__webpack_require__(/*! ./modals/settings */ "./src/modals/settings.js"));

var _settings2 = _interopRequireDefault(__webpack_require__(/*! ./providers/settings */ "./src/providers/settings.js"));

var _analytics = _interopRequireDefault(__webpack_require__(/*! ./utils/analytics */ "./src/utils/analytics.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @name importIcons
 * @description trigger to start feature to import icons
 * @param context
 */
function importIcons(context) {
  _utils.default.runFramework(context);

  const params = (0, _modals2.importModal)(context);
  if (params.button !== 1000) return;
  params.listIcon = _files.default.selectIconsFiles();
  if (!params.listIcon.length) return;

  const importedIcons = _artboard.default.initImport(context, params, _artboard.default.initImportIcons);

  const label = params.withMask ? 'import-mask' : 'import';

  _analytics.default.action(context, 'icons', 'import', label, importedIcons);
}
/**
 * @name updateIconsOnSelectedArtboards
 * @description trigger to start feature to update icon
 * @param context
 */


function updateIconsOnSelectedArtboards(context) {
  const selectedArtboardsAndSymbols = _utils.default.getSelectedArtboardsAndSymbols(context);

  if (selectedArtboardsAndSymbols.length === 0) return _modals.default.newErrorModal('No artboards selected', 'Please select one or more artboards to replace icons.');
  let params = {};
  params.listIcon = _files.default.selectIconsFiles();
  if (!params.listIcon.length) return;
  if (selectedArtboardsAndSymbols.length > params.listIcon.length && params.listIcon.length !== 1) return _modals.default.newErrorModal('Too much artboards selected', 'Please select as many artboards as icons.');
  if (selectedArtboardsAndSymbols.length < params.listIcon.length && params.listIcon.length !== 1) return _modals.default.newErrorModal('Too much icons selected', 'Please select as many icons as artboards.');

  const replacedIcons = _svg.default.initUpdateIconsSelectedArtboards(context, selectedArtboardsAndSymbols, params);

  _analytics.default.action(context, 'icons', 'replace', 'replace', replacedIcons);
}
/**
 * @name organizeIcons
 * @param context
 */


function organizeIcons(context) {
  const selectedLayers = context.selection;
  if (selectedLayers.length === 0) return _modals.default.newErrorModal('No layers selected', 'Please select one or more layers.');

  _utils.default.runFramework(context);

  const params = (0, _modals2.importModal)(context);
  if (params.button !== 1000) return;
  params.listIcon = selectedLayers;

  _artboard.default.initImport(context, params, _artboard.default.initOrganizeIcons);

  params.listIcon.forEach(icon => icon.removeFromParent());
  const label = params.withMask ? 'organize-mask' : 'organize';

  _analytics.default.action(context, 'icons', 'organize', label, params.listIcon.length);
}
/**
 * @name addMaskOnSelectedArtboards
 * @description trigger to start feature to add mask
 * @param context
 */


function addMaskOnSelectedArtboards(context) {
  _utils.default.runFramework(context);

  const selectedArtboardsAndSymbols = _utils.default.getSelectedArtboardsAndSymbols(context);

  if (selectedArtboardsAndSymbols.length === 0) return _modals.default.newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.');
  const params = (0, _modals2.maskModal)(context);
  if (params.button !== 1000) return;

  _mask.default.initAddMaskOnSelectedArtboards(context, params, selectedArtboardsAndSymbols);

  _analytics.default.action(context, 'icons', 'mask', 'mask', selectedArtboardsAndSymbols.length);
}
/**
 * @name removeMaskOnSelectedArtboards
 * @description remove masks layer
 * @param context
 */


function removeMaskOnSelectedArtboards(context) {
  const selectedArtboardsAndSymbols = _utils.default.getSelectedArtboardsAndSymbols(context);

  if (selectedArtboardsAndSymbols.length === 0) return _modals.default.newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.');
  selectedArtboardsAndSymbols.forEach(rootElement => {
    _mask.default.removeMask(context, rootElement.object);
  });

  _analytics.default.action(context, 'icons', 'remove mask', 'remove mask', selectedArtboardsAndSymbols.length);
}
/**
 * @name setSettings
 * @description set settings
 * @param context
 */


function setSettings(context) {
  const params = (0, _settings.default)(context);
  if (params.button === 1001) return;

  _settings2.default.registerSettings(context, params);

  _analytics.default.action(context, 'settings', 'settings', 'settings');
}

/***/ }),

/***/ "./src/modals/modals.js":
/*!******************************!*\
  !*** ./src/modals/modals.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEnabledColorMenu = setEnabledColorMenu;
exports.importModal = importModal;
exports.maskModal = maskModal;
exports.constructBase = constructBase;

var _utils = _interopRequireDefault(__webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js"));

var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger */ "./src/utils/logger.js"));

var _libraries = _interopRequireDefault(__webpack_require__(/*! ../providers/libraries */ "./src/providers/libraries.js"));

var _settings = _interopRequireDefault(__webpack_require__(/*! ../providers/settings */ "./src/providers/settings.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let global = {};
const disabledColor = NSColor.colorWithCalibratedRed_green_blue_alpha(170 / 255, 170 / 255, 170 / 255, 1);

function maskModal(context) {
  global.modalParams = {
    messageText: 'Configure your color mask',
    informativeText: 'Select your library and choose a color to apply as mask. Your layers will all be combined.',
    height: 160,
    width: 300,
    lineHeight: 35
  };
  global.coeffCurrentHeight = 0;
  global.isLibrarySource = true;
  global.adjustHeight = 0;
  constructBase('Continue', global);
  makeMaskRadioButtonParams(global);
  makeMaskLibraryParams(context, global);
  makeMaskColorPickerParams(context, global);
  const result = {
    button: global.modal.runModal()
  };

  if (global.isLibrarySource) {
    let colorMenu = global.colorsMenuParams.selectedItem();
    result.color = colorMenu ? global.colorsMenuParams.representedObject() : null;
    let colorLib = global.colorLibsMenuParams.selectedItem();
    result.colorLib = colorLib ? global.colorLibsMenuParams.representedObject() : null;
  } else {
    result.colorPicker = global.colorPickerColor;
  }

  return result;
}

function importModal(context) {
  let global = {};
  let usePresets;
  global.settingsValues = _settings.default.getSettings(context, 'default');
  global.modalParams = {
    messageText: 'Configure your import',
    informativeText: 'Your icons will be arranged in artboards. Set size and padding of your artboards.',
    width: 300,
    lineHeight: 35
  };

  if (_settings.default.hasValue(global.settingsValues.presets)) {
    global.modalParams.height = 300 + global.settingsValues.presets.data.split(',').length * 30;
    usePresets = true;
  } else {
    global.modalParams.height = 300;
    usePresets = false;
  }

  global.modalParams.height = _settings.default.hasValue(global.settingsValues.presets) ? 300 + global.settingsValues.presets.data.split(',').length * 30 : 300;
  global.coeffCurrentHeight = 0;
  global.isLibrarySource = true;
  global.adjustHeight = 0;
  constructBase('Continue', global);

  if (usePresets) {
    makePresetsParams(global);
  } else {
    makeArtboardParams(global);
  }

  global.view.addSubview(_utils.default.createDivider(NSMakeRect(0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - 10, global.modalParams.width, 1)));
  global.adjustHeight = 5;
  makeSymbolParams(global);
  global.view.addSubview(_utils.default.createDivider(NSMakeRect(0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - 15, global.modalParams.width, 1)));
  global.adjustHeight = 8;
  makeMaskCheckboxParams(global);
  makeMaskRadioButtonParams(global);
  makeMaskLibraryParams(context, global);
  setEnabledColorLibraryMenu(false, global);
  setEnabledColorMenu(false, global);
  setEnabledRadioButton(false, global);
  makeMaskColorPickerParams(context, global);
  addListenerOnMaskCheckbox(global);
  const result = {
    button: global.modal.runModal(),
    convertSymbol: global.symbolParams.state(),
    withMask: !!global.checkboxMaskParams.state()
  };

  if (usePresets) {
    result.presets = [];
    global.presets.forEach(preset => {
      if (preset.presetCheckBox.state()) {
        result.presets.push({
          artboardSize: parseInt(preset.sizeBox.stringValue()),
          iconPadding: parseInt(preset.paddingBox.stringValue())
        });
      }
    });
  } else {
    result.artboardSize = parseInt(global.artboardSize.stringValue());
    result.iconPadding = parseInt(global.artboardPadding.stringValue());
  }

  if (result.withMask && global.isLibrarySource) {
    let colorMenu = global.colorsMenuParams.selectedItem();
    result.color = colorMenu ? global.colorsMenuParams.representedObject() : null;
    let colorLib = global.colorLibsMenuParams.selectedItem();
    result.colorLib = colorLib ? global.colorLibsMenuParams.representedObject() : null;
    if (!result.color) result.withMask = false;
  } else if (result.withMask) {
    result.colorPicker = global.colorPickerColor || MSColor.blackColor();
  }

  return result;
}

function artboardModal(context) {
  let global = {};
  global.settingsValues = _settings.default.getSettings(context, 'placeholder');
  global.modalParams = {
    messageText: 'Configure your icons',
    informativeText: 'Your icons will be moved in artboards. Set size and padding of your artboards.',
    height: 100,
    width: 300,
    lineHeight: 35
  };
  global.coeffCurrentHeight = 0;
  global.adjustHeight = 0;
  constructBase(global);
  makeArtboardParams(global);
  return {
    button: global.modal.runModal(),
    artboardSize: parseInt(global.artboardSize.stringValue()),
    iconPadding: parseInt(global.artboardPadding.stringValue())
  };
}

function constructBase(button1 = 'Continue', global) {
  global.modal = COSAlertWindow.new();
  global.view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, global.modalParams.width, global.modalParams.height));
  global.modal.addAccessoryView(global.view);
  global.modal.setMessageText(global.modalParams.messageText);
  global.modal.addButtonWithTitle(button1);
  global.modal.setInformativeText(global.modalParams.informativeText);
  global.modal.addButtonWithTitle('Cancel');
}

function makePresetsParams(global) {
  const presets = global.settingsValues.presets.data.split(',').map(preset => {
    const properties = preset.split('-');
    return {
      artboardSize: properties[0],
      padding: properties[1] ? properties[1] : 0
    };
  });
  global.presets = [];

  const presetLabel = _utils.default.createLabel(`Presets`, 0, global.modalParams.height - global.modalParams.lineHeight, 150, 20);

  global.view.addSubview(presetLabel);

  const sizeLabel = _utils.default.createLabel(`Size`, 180, global.modalParams.height - global.modalParams.lineHeight, 100, 20);

  global.view.addSubview(sizeLabel);

  const paddingLabel = _utils.default.createLabel(`Padding`, 240, global.modalParams.height - global.modalParams.lineHeight, 100, 20);

  global.view.addSubview(paddingLabel);
  global.coeffCurrentHeight++;
  presets.forEach(preset => {
    global.coeffCurrentHeight++;
    makePreset(preset, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight, global);
  });
}

function makeArtboardParams(global) {
  global.coeffCurrentHeight++;

  const textBoxLabel = _utils.default.createLabel('Artboard size', 0, global.modalParams.height - global.modalParams.lineHeight, 150, 20);

  global.view.addSubview(textBoxLabel);
  const textBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight, 50, 20));
  textBox.setStringValue(24);
  global.view.addSubview(textBox);

  const textBoxUnit = _utils.default.createLabel('px', 205, global.modalParams.height - global.modalParams.lineHeight, 50, 20);

  global.view.addSubview(textBoxUnit);
  global.coeffCurrentHeight++;

  const paddingBoxLabel = _utils.default.createLabel('Artboard Padding', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight, 150, 20);

  global.view.addSubview(paddingBoxLabel);
  const paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight, 50, 20));
  paddingBox.setStringValue(4);
  global.view.addSubview(paddingBox);

  const paddingBoxUnit = _utils.default.createLabel('px', 205, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight, 50, 20);

  global.view.addSubview(paddingBoxUnit);
  global.artboardPadding = paddingBox;
  global.artboardSize = textBox;
  global.artboardSize.setNextKeyView(global.artboardPadding);
}

function makePreset(preset, yAxis, global) {
  const presetCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, yAxis, 30, 20));
  presetCheckBox.setState(true);
  presetCheckBox.setButtonType(NSSwitchButton);
  presetCheckBox.setFont(NSFont.systemFontOfSize_(13));
  presetCheckBox.setTitle('');
  global.view.addSubview(presetCheckBox);
  const sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(180, yAxis, 50, 20));
  sizeBox.setStringValue(preset.artboardSize);
  global.view.addSubview(sizeBox);
  const paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(240, yAxis, 50, 20));
  paddingBox.setStringValue(preset.padding);
  global.view.addSubview(paddingBox);
  const newPreset = {
    sizeBox,
    paddingBox,
    presetCheckBox
  };
  addListenerPreset(newPreset);
  global.presets.push(newPreset);
}

function makeSymbolParams(global) {
  global.coeffCurrentHeight++;

  const maskCheckboxLabel = _utils.default.createLabel('Symbols', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 150, 20);

  global.view.addSubview(maskCheckboxLabel);
  const symbolCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 200, 20));
  symbolCheckBox.setButtonType(NSSwitchButton);
  symbolCheckBox.setState(true);
  symbolCheckBox.setFont(NSFont.systemFontOfSize_(13));
  symbolCheckBox.setTitle('Convert to symbol');
  global.view.addSubview(symbolCheckBox);
  global.symbolParams = symbolCheckBox;
}

function makeMaskCheckboxParams(global) {
  global.coeffCurrentHeight++;

  const maskCheckboxLabel = _utils.default.createLabel('Mask', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 150, 20);

  global.view.addSubview(maskCheckboxLabel);
  const maskCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 200, 20));
  maskCheckBox.setButtonType(NSSwitchButton);
  maskCheckBox.setState(false);
  maskCheckBox.setFont(NSFont.systemFontOfSize_(13));
  maskCheckBox.setTitle('Add color mask');
  global.view.addSubview(maskCheckBox);
  global.checkboxMaskParams = maskCheckBox;
}

function makeMaskRadioButtonParams(global) {
  global.coeffCurrentHeight++;
  global.coeffCurrentHeight++;

  const radioButtonLabel = _utils.default.createLabel('Color Source', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight + 40, 150, 20);

  global.view.addSubview(radioButtonLabel);
  const buttonFormat = NSButtonCell.alloc().init();
  buttonFormat.setButtonType(NSRadioButton);
  const matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 300, 60), NSRadioModeMatrix, buttonFormat, 2, 1);
  matrixFormat.setCellSize(CGSizeMake(300, 25));
  const cells = matrixFormat.cells();
  cells[0].setTitle("From Symbols");
  cells[0].setFont(NSFont.systemFontOfSize_(13));
  cells[1].setTitle("From Color picker");
  cells[1].setFont(NSFont.systemFontOfSize_(13));
  global.view.addSubview(matrixFormat);
  setListenerRadioButon(cells, global);
  global.radioParams = matrixFormat;
  global.radioButtonLabel = radioButtonLabel;
}

function makeMaskLibraryParams(context, global) {
  global.coeffCurrentHeight++;

  const colorLibsLabel = _utils.default.createLabel('Document Source', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 150, 25);

  global.view.addSubview(colorLibsLabel);
  const colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 130, 30));
  global.coeffCurrentHeight++;

  const colorMenuLabel = _utils.default.createLabel('Color', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 150, 25);

  global.view.addSubview(colorMenuLabel);
  const colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 130, 30));
  global.view.addSubview(colorLibsMenu);
  global.view.addSubview(colorMenu);
  global.colorLibsMenuParams = colorLibsMenu;
  global.colorsMenuParams = colorMenu;
  global.colorLibsMenuParamsLabel = colorLibsLabel;
  global.colorsMenuParamsLabel = colorMenuLabel;
  colorLibsMenu.menu = _libraries.default.initLibsSelectList(context, AppController.sharedInstance().librariesController().availableLibraries(), colorMenu, global);
}

function makeMaskColorPickerParams(context, global) {
  const colorPickerLabel = _utils.default.createLabel('Color picker', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight + 20, 150, 20);

  const pickerView = NSView.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 130, 60));
  pickerView.setWantsLayer(true);
  pickerView.layer().setBackgroundColor(CGColorCreateGenericRGB(1, 1, 1, 1.0));
  pickerView.layer().setBorderColor(CGColorCreateGenericRGB(186 / 255, 186 / 255, 186 / 255, 1));
  pickerView.layer().borderWidth = 1;

  const hexLabel = _utils.default.createLabel('#000000', 60, 20, 100, 20);

  pickerView.addSubview(hexLabel);
  const pickerButton = NSButton.alloc().initWithFrame(NSMakeRect(5, 15, 50, 30));
  pickerButton.setButtonType(NSMomentaryChangeButton);
  pickerButton.setImage(_utils.default.getImageByColor(NSColor.colorWithRed_green_blue_alpha(0, 0, 0, 1), {
    width: 40,
    height: 30
  }));
  pickerButton.setBordered(false);
  const main = AMOMain.alloc().init();
  pickerButton.setCOSJSTargetFunction(() => {
    main.openPopover_onView_withWebview(pickerButton, global.view, _utils.default.createWebview(context, pickerButton, color => {
      global.colorPickerColor = color;
      hexLabel.setStringValue_(`#${color.immutableModelObject().hexValue()}`);
    }));
  });
  pickerView.addSubview(pickerButton);
  global.pickerView = pickerView;
  global.colorPickerLabel = colorPickerLabel;
}

function addListenerOnMaskCheckbox(global) {
  global.checkboxMaskParams.setCOSJSTargetFunction(mask => {
    if (mask.state()) {
      setEnabledRadioButton(true, global);
      setEnabledColorLibraryMenu(true, global);
      if (global.colorsMenuParams.numberOfItems() > 0) setEnabledColorMenu(true, global);
    } else {
      setEnabledRadioButton(false, global);
      setEnabledColorLibraryMenu(false, global);
      setEnabledColorMenu(false, global);
      addLibraryColorsFields(global);
      removePickerButton(global);
      global.radioParams.cells()[0].state = true;
      global.radioParams.cells()[1].state = false;
    }
  });
}

function setListenerRadioButon(cells, global) {
  function setState(item) {
    if (String(item.selectedCells()[0].title()) === 'From Symbols') {
      addLibraryColorsFields(global);
      removePickerButton(global);
      global.isLibrarySource = true;
    } else {
      removeLibraryColorsFields(global);
      addPickerButton(global);
      global.isLibrarySource = false;
    }
  }

  cells[0].setCOSJSTargetFunction(setState);
  cells[1].setCOSJSTargetFunction(setState);
}

function setEnabledColorLibraryMenu(enabled, global) {
  const color = enabled ? NSColor.controlTextColor() : disabledColor;
  global.colorLibsMenuParamsLabel.setTextColor(color);
  global.colorLibsMenuParams.setEnabled(enabled);
}

function setEnabledColorMenu(enabled, global) {
  global.colorsMenuParamsLabel.setTextColor(getStateColor(enabled));
  global.colorsMenuParams.setEnabled(enabled);
}

function setEnabledRadioButton(enabled, global) {
  global.radioParams.setEnabled(enabled);
  global.radioButtonLabel.setTextColor(getStateColor(enabled));
}

function removeLibraryColorsFields(global) {
  global.colorLibsMenuParams.removeFromSuperview();
  global.colorsMenuParams.removeFromSuperview();
  global.colorLibsMenuParamsLabel.removeFromSuperview();
  global.colorsMenuParamsLabel.removeFromSuperview();
}

function addLibraryColorsFields(global) {
  global.view.addSubview(global.colorLibsMenuParams);
  global.view.addSubview(global.colorsMenuParams);
  global.view.addSubview(global.colorLibsMenuParamsLabel);
  global.view.addSubview(global.colorsMenuParamsLabel);
}

function addPickerButton(global) {
  global.view.addSubview(global.pickerView);
  global.view.addSubview(global.colorPickerLabel);
}

function removePickerButton(global) {
  global.pickerView.removeFromSuperview();
  global.colorPickerLabel.removeFromSuperview();
}

function getStateColor(enabled) {
  return enabled ? NSColor.controlTextColor() : disabledColor;
}

function addListenerPreset(newPreset) {
  newPreset.presetCheckBox.setCOSJSTargetFunction(() => {
    newPreset.sizeBox.setEnabled(newPreset.presetCheckBox.state());
    newPreset.paddingBox.setEnabled(newPreset.presetCheckBox.state());
  });
}

/***/ }),

/***/ "./src/modals/settings.js":
/*!********************************!*\
  !*** ./src/modals/settings.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _modals = __webpack_require__(/*! ./modals */ "./src/modals/modals.js");

var _utils = _interopRequireDefault(__webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js"));

var _settings = _interopRequireDefault(__webpack_require__(/*! ../providers/settings */ "./src/providers/settings.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = settingsModal;
exports.default = _default;

function settingsModal(context) {
  let global = {};
  global.settingsValues = _settings.default.getSettings(context, 'placeholder');
  global.modalParams = {
    messageText: 'Settings',
    informativeText: 'Customize your imports using presets and other features.',
    height: (Object.keys(global.settingsValues).length + 1) * 73,
    width: 340,
    lineHeight: 45
  };
  global.coeffCurrentHeight = 0;
  global.adjustHeight = 0;
  global.marginLeftColRight = 130;
  global.adjust = -5;
  global.lineOne = 15;
  global.lineTwo = 0;
  (0, _modals.constructBase)('Save', global);
  makePresetParams(global);
  prefixRootObjectParams(global);
  quantityIconsByLine(global);
  marginBetweenRootObject(global);
  convertStrokeToFillParams(global);
  return {
    button: global.modal.runModal(),
    presets: String(global.presets.stringValue()).replace(/ /g, ''),
    iconsByLine: parseInt(global.iconsByLine.stringValue()) || null,
    convertStroke: global.convertStroke.state(),
    marginBetweenRootObject: global.marginBetweenRootObject.stringValue().replace(/ /g, ''),
    prefixRootObject: global.prefixRootObject.stringValue()
  };
}

function makePresetParams(global) {
  global.coeffCurrentHeight++;
  let yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + global.adjust;

  const textBoxLabel = _utils.default.createLabel('Size Presets', 0, yAxis, global.marginLeftColRight, 20);

  global.view.addSubview(textBoxLabel);
  const presetsBox = NSTextField.alloc().initWithFrame(NSMakeRect(global.marginLeftColRight, yAxis, 145, 21));

  if (_settings.default.hasValue(global.settingsValues.presets)) {
    presetsBox.setStringValue(String(global.settingsValues.presets.value));
  } else {
    presetsBox.setPlaceholderString(String(global.settingsValues.presets.placeholder));
  }

  global.view.addSubview(presetsBox);
  global.coeffCurrentHeight++;
  addDescription('Set your artboard sizes and padding.', global.lineOne, global);
  addDescription('Format: size-padding', global.lineTwo, global);
  global.presets = presetsBox;
}

function convertStrokeToFillParams(global) {
  global.coeffCurrentHeight++;
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + 30;

  const convertStrokeCheckboxLabel = _utils.default.createLabel('Stroke to Fill', 0, yAxis, global.marginLeftColRight, 20);

  global.view.addSubview(convertStrokeCheckboxLabel);
  const convertStrokeCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(global.marginLeftColRight, yAxis, 200, 21));
  convertStrokeCheckBox.setButtonType(NSSwitchButton);
  convertStrokeCheckBox.setState(parseInt(global.settingsValues.convertStroke.data));
  convertStrokeCheckBox.setFont(NSFont.systemFontOfSize_(13));
  convertStrokeCheckBox.setTitle('Auto-Convert');
  global.view.addSubview(convertStrokeCheckBox);
  global.coeffCurrentHeight++;
  addDescription('global will allow you to add a dynamic color mask ', global.lineOne + 30, global);
  addDescription('over your outlined icons.', global.lineTwo + 30, global);
  global.convertStroke = convertStrokeCheckBox;
}

function quantityIconsByLine(global) {
  global.coeffCurrentHeight++;
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + global.adjust;

  const iconByLineParamsLabel = _utils.default.createLabel('Icons Grid', 0, yAxis, global.marginLeftColRight, 20);

  global.view.addSubview(iconByLineParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(global.marginLeftColRight, yAxis, 50, 21));

  if (String(global.settingsValues.iconsByLine.value) === 'null') {
    sizeBox.setPlaceholderString('10');
  } else {
    sizeBox.setStringValue(String(global.settingsValues.iconsByLine.value));
  }

  global.view.addSubview(sizeBox);

  const sizeBoxUnit = _utils.default.createLabel('icons per row', global.marginLeftColRight + 55, yAxis, 100, 20);

  global.view.addSubview(sizeBoxUnit);
  global.coeffCurrentHeight++;
  addDescription('Set the number of imported icons per row.', global.lineOne, global); // addDescription('Format: size-padding', global.lineTwo)

  global.iconsByLine = sizeBox;
}

function marginBetweenRootObject(global) {
  global.coeffCurrentHeight++;
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + 15;

  const marginBetweenRootObjectParamsLabel = _utils.default.createLabel('Spacing', 0, yAxis, global.marginLeftColRight, 20);

  global.view.addSubview(marginBetweenRootObjectParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(global.marginLeftColRight, yAxis, 50, 21));

  if (_settings.default.hasValue(global.settingsValues.marginBetweenRootObject)) {
    sizeBox.setStringValue(String(global.settingsValues.marginBetweenRootObject.value));
  } else {
    sizeBox.setPlaceholderString(String(global.settingsValues.marginBetweenRootObject.placeholder));
  }

  global.view.addSubview(sizeBox);

  const sizeBoxUnit = _utils.default.createLabel('px or %', global.marginLeftColRight + 55, yAxis, 100, 20);

  global.view.addSubview(sizeBoxUnit);
  global.coeffCurrentHeight++;
  addDescription('Set the spacing between the imported icons.', global.lineOne + 15, global); // addDescription('Format: size-padding', global.lineTwo)

  global.marginBetweenRootObject = sizeBox;
}

function prefixRootObjectParams(global) {
  global.coeffCurrentHeight++;
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + global.adjust;

  const prefixRootObjectParamsLabel = _utils.default.createLabel('Add Prefix ', 0, yAxis, global.marginLeftColRight, 20);

  global.view.addSubview(prefixRootObjectParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(global.marginLeftColRight, yAxis, 145, 21));

  if (_settings.default.hasValue(global.settingsValues.prefixRootObject)) {
    sizeBox.setStringValue(String(global.settingsValues.prefixRootObject.value));
  } else {
    sizeBox.setPlaceholderString(String(global.settingsValues.prefixRootObject.placeholder));
  }

  global.view.addSubview(sizeBox);
  global.coeffCurrentHeight++;
  addDescription('Add a path structure to the name of yours icons.', global.lineOne, global);
  addDescription('$size is equal to the size of the artboard.', global.lineTwo, global);
  global.prefixRootObject = sizeBox;
}

function addDescription(text, ajust, global) {
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + ajust;

  const descriptionLabel = _utils.default.createLabel(text, 0, yAxis, 400, 20, true);

  global.view.addSubview(descriptionLabel);
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/providers/artboard.js":
/*!***********************************!*\
  !*** ./src/providers/artboard.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(__webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js"));

var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger */ "./src/utils/logger.js"));

var _svg = _interopRequireDefault(__webpack_require__(/*! ../providers/svg */ "./src/providers/svg.js"));

var _mask = _interopRequireDefault(__webpack_require__(/*! ./mask */ "./src/providers/mask.js"));

var _settings = _interopRequireDefault(__webpack_require__(/*! ./settings */ "./src/providers/settings.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dom from 'sketch'
// import { Text } from 'sketch'
var _default = {
  initImport,
  initImportIcons,
  getPaddingAndSize,
  initOrganizeIcons
};
exports.default = _default;
const artboardParams = {
  iconsByLine: 10,
  sizeBetweenPreset: 200,
  titleFontSize: 32
};
const workingRootObject = [];
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
  const marginBetweenRootObject = _settings.default.getSettings(context, 'default').marginBetweenRootObject;

  const space = _utils.default.getSizeBetweenIcon(artboardParams.width, marginBetweenRootObject.data);

  if (index === 0) {
    artboardParams.y = params.yOrigin;
    artboardParams.x = params.xOrigin || 0;
  } else if (index % artboardParams.iconsByLine === 0) {
    artboardParams.y += space;
    artboardParams.x = params.xOrigin || 0;
  } else {
    artboardParams.x += space;
  }

  const rootObject = MSArtboardGroup.new();
  rootObject.setName(`${params.prefix}${name}`);
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
  const rootObjectFrame = rootObject.frame();
  rootObjectFrame.setWidth(mensuration.width);
  rootObjectFrame.setHeight(mensuration.height);
  rootObjectFrame.setX(mensuration.x);
  rootObjectFrame.setY(mensuration.y);
}

function setOrigin(context, setOfRootObject) {
  const Y = [];
  const X = [];
  let size = 0;
  setOfRootObject.forEach(layer => {
    const layerSize = layer.frame().height();
    const origin = layer.origin();
    Y.push(origin.y - size);
    X.push(origin.x - size);
    if (layerSize > size) size = layerSize;
  });
  const yOrigin = Y.length !== 0 ? Math.max(...Y) : 0;
  const xOrigin = X.length !== 0 ? Math.max(...X) + size : 0;
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
  _utils.default.clearSelection(context);

  params.listIcon.forEach((icon, index) => {
    try {
      const name = _utils.default.getIconNameByNSUrl(icon);

      const newRootObject = createArtboard(context, index, name, params);
      const ext = String(icon.toString().split('.').pop()).toLowerCase();
      if (ext === 'pdf') return _svg.default.addPDF(context, newRootObject, params, icon);
      if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return _svg.default.addBITMAP(context, newRootObject, params, icon);
      const svgData = String(NSString.alloc().initWithContentsOfURL(icon));
      processSVG(context, newRootObject, params, svgData);
      workingRootObject.push(newRootObject);
    } catch (e) {
      _logger.default.error(e);
    }
  });

  _utils.default.clearSelection(context);
}
/**
 * @name initOrganizeIcons
 * @param context
 * @param params
 */


function initOrganizeIcons(context, params) {
  params.listIcon.forEach(async (icon, index) => {
    try {
      const newRootObject = createArtboard(context, index, icon.name(), params);
      if (String(icon.class()) === 'MSBitmapLayer') return _svg.default.addBITMAP(context, newRootObject, params, icon);
      const ancestry = MSImmutableLayerAncestry.ancestryWithMSLayer_(icon);
      const exportRequest = MSExportRequest.exportRequestsFromLayerAncestry_(ancestry).firstObject();
      exportRequest.format = 'svg';
      const exporter = MSExporter.exporterForRequest_colorSpace_(exportRequest, NSColorSpace.sRGBColorSpace());
      const svgData = NSString.alloc().initWithData_encoding(exporter.data(), NSUTF8StringEncoding); // await processSVG(context, newRootObject, params, String(svgData));

      _svg.default.addSVGNew(context, newRootObject, params, svgData, true);

      workingRootObject.push(newRootObject);
    } catch (e) {
      _logger.default.error(e);
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
  const rootObjects = _utils.default.getRootObject(context);

  params.yOrigin = setOrigin(context, rootObjects).yOrigin;

  if (params.presets) {
    const withPresetTitle = rootObjects;
    params.presets.forEach(preset => {
      setArtboardsSize(params, preset);
      params.xOrigin = setOrigin(context, workingRootObject).xOrigin;
      params.artboardSize = preset.artboardSize;
      params.prefix = _utils.default.buildPrefix(context, params.artboardSize);
      if (withPresetTitle && rootObjects.length === 0) context.document.currentPage().addLayers([newText(preset, params.xOrigin)]);
      artboardParams.iconsByLine = parseInt(_settings.default.getSettings(context, 'default').iconsByLine.data);
      cb(context, params);
    });
  } else {
    params.prefix = _utils.default.buildPrefix(context, params.artboardSize);
    artboardParams.height = artboardParams.width = params.artboardSize;
    artboardParams.iconsByLine = parseInt(_settings.default.getSettings(context, 'default').iconsByLine.data);
    cb(context, params);
  }

  const importedIcons = params.listIcon.length * (Array.isArray(params.presets) ? params.presets.length : 1);
  context.document.showMessage(`🎉 Tadaaa! 🎉 ${importedIcons} icon${params.listIcon.length > 1 ? 's' : ''} imported`);
  return importedIcons;
}

function newText(preset, xOrigin) {
  const text = MSTextLayer.new();
  text.setStringValue_(`${preset.artboardSize}px`);
  const fontManager = NSFontManager.sharedFontManager();
  const boldItalic = fontManager.fontWithFamily_traits_weight_size("Helvetica neue", NSBoldFontMask, 0, artboardParams.titleFontSize);
  text.setFont(boldItalic);
  text.lineHeight = 48;
  text.setName(`${preset.artboardSize}px`);
  const textFrame = text.frame();
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
  _svg.default.addSVG(context, rootObject, params, svgData, true);

  if (params.withMask) _mask.default.addColor(context, rootObject, params);
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
  let iconPadding = context.command.valueForKey_onLayer('padding', artboard);

  if (!iconPadding) {
    const icon = artboard.layers()[0].rect();
    iconPadding = Math.min(icon.origin.x, icon.origin.y);
  }

  return {
    iconPadding: parseInt(iconPadding),
    artboardSize: parseInt(artboard.rect().size.width)
  };
}
/**
 * @name resizeRootObject
 * @param rootObject
 * @param size
 */


function resizeRootObject(rootObject, size) {
  const rootObjectFrame = rootObject.frame();
  rootObjectFrame.setWidth(size);
  rootObjectFrame.setHeight(size);
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/providers/files.js":
/*!********************************!*\
  !*** ./src/providers/files.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger */ "./src/utils/logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  selectIconsFiles
};
exports.default = _default;
const AVAILABLE_EXT = ["svg", "pdf", "png", "jpg", "jpeg"];
/**
 * @name selectIconsFiles
 * @description display modal selection file and return them
 * @returns {Array}
 */

function selectIconsFiles() {
  const panel = NSOpenPanel.openPanel();
  panel.setAllowsMultipleSelection(true);
  panel.setCanChooseDirectories(true);
  panel.setAllowedFileTypes(AVAILABLE_EXT);
  panel.setCanChooseFiles(true);
  panel.setPrompt("Select");
  if (panel.runModal() !== NSFileHandlingPanelOKButton) return [];
  const result = [];
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
  for (let i = 0; i < urls.length; i++) {
    if (!!urls[i].hasDirectoryPath()) {
      getFilesByUrls(NSFileManager.defaultManager().contentsOfDirectoryAtURL_includingPropertiesForKeys_options_error(urls[i], null, null, null), result);
    } else {
      const ext = String(urls[i].pathExtension()).toLowerCase();

      if (AVAILABLE_EXT.indexOf(ext) !== -1) {
        result.push(urls[i]);
      }
    }
  }
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/providers/libraries.js":
/*!************************************!*\
  !*** ./src/providers/libraries.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger */ "./src/utils/logger.js"));

var _utils = _interopRequireDefault(__webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js"));

var _modals = __webpack_require__(/*! ../modals/modals */ "./src/modals/modals.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  getLibById,
  initLibsSelectList,
  getColorFromSymbol,
  getSymbolFromDocument,
  loadLibrary
  /**
   * @name getLibById
   * @description return library by id
   * @param libraryId
   * @returns {Object} : MSAssetLibrary
   */

};
exports.default = _default;

function getLibById(libraryId) {
  let library,
      availableLibraries = AppController.sharedInstance().librariesController().availableLibraries();

  for (let i = 0; i < availableLibraries.length; i++) {
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


function initLibsSelectList(context, libraries, colorMenu, global) {
  function addListener(item) {
    item.setCOSJSTargetFunction(libraryItem => {
      updateColorMenu(context, libraryItem, colorMenu, global);
    });
  }

  const colorLibsMenu = NSMenu.alloc().init();
  const currentDocument = NSMenuItem.alloc().init();
  currentDocument.title = 'Current file';
  addListener(currentDocument);
  colorLibsMenu.addItem(currentDocument);
  libraries.forEach(library => {
    let item = NSMenuItem.alloc().init();
    item.title = library.name();
    item.representedObject = library;
    colorLibsMenu.addItem(item);
    addListener(item);
  });
  updateColorMenu(context, currentDocument, colorMenu, global);
  return colorLibsMenu;
}

function updateColorMenu(context, libraryItem, colorMenu, global) {
  let colors = [];

  if (!libraryItem.representedObject()) {
    colors = getColorSymbolsFromDocument(context.document.documentData());
  } else {
    colors = loadColorFromSelectedLib(libraryItem, colorMenu);
  }

  if (colors.length > 0) {
    initColorSelectList(colorMenu, colors);
    (0, _modals.setEnabledColorMenu)(true, global);
  } else {
    (0, _modals.setEnabledColorMenu)(false, global);
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
  const menu = NSMenu.alloc().init();
  menu.cancelTracking();
  colors.forEach(function (color) {
    let item = NSMenuItem.alloc().init();
    item.title = color.symbol ? color.symbol.name() : "";
    let colorRGBA = color.color ? NSColor.colorWithRed_green_blue_alpha(color.color.red(), color.color.green(), color.color.blue(), color.color.alpha()) : NSColor.colorWithRed_green_blue_alpha(color.red(), color.green(), color.blue(), color.alpha());
    item.representedObject = color.symbol ? color.symbol : colorRGBA;
    item.image = _utils.default.getImageByColor(colorRGBA);
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
  const result = [];
  document.localSymbols().forEach(function (symbol) {
    const color = getColorFromSymbol(symbol);
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
  let symbol,
      localSymbols = document.localSymbols();

  for (let i = 0; i < localSymbols.length; i++) {
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
  const layers = symbol.layers();
  let result;

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

module.exports = exports["default"];

/***/ }),

/***/ "./src/providers/mask.js":
/*!*******************************!*\
  !*** ./src/providers/mask.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(__webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js"));

var _svg = _interopRequireDefault(__webpack_require__(/*! ./svg */ "./src/providers/svg.js"));

var _libraries = _interopRequireDefault(__webpack_require__(/*! ./libraries */ "./src/providers/libraries.js"));

var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger */ "./src/utils/logger.js"));

var _switchV3ToV = _interopRequireDefault(__webpack_require__(/*! ../utils/switchV3ToV4 */ "./src/utils/switchV3ToV4.js"));

var _settings = _interopRequireDefault(__webpack_require__(/*! ./settings */ "./src/providers/settings.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  initAddMaskOnSelectedArtboards,
  addColor,
  removeMask,
  getMaskPropertiesFromArtboard,
  registerMask
  /**
   * @name initAddMaskOnSelectedArtboards
   * @description main function to add mask on selected artboards
   * @param context {Object}
   * @param params {Object}
   * @param rootObjects {Array} : MSArtboardGroup
   */

};
exports.default = _default;

function initAddMaskOnSelectedArtboards(context, params, rootObjects) {
  const settingsParams = _settings.default.getSettings(context, 'default');

  rootObjects.forEach(async rootObject => {
    try {
      if (_utils.default.svgHasStroke(rootObject.object) && settingsParams.convertStroke.data === '1') _svg.default.convertStrokeToFill(rootObject.object);
      if (_utils.default.hasMask(rootObject.object) && !_utils.default.svgHasStroke(rootObject.object)) removeMask(context, rootObject.object);
      await addColor(context, rootObject.object, params);
    } catch (e) {
      console.log('>>>>>>>>>>>', e);
    }
  });

  _utils.default.clearSelection(context);
}
/**
 * @name addColor
 * @description index function for all step to add mask and convert artboard to symbol at end
 * @param context {Object}
 * @param rootObject {Object} : MSArtboardGroup && MSSymbolMaster
 * @param params {Object}
 */


function addColor(context, rootObject, params) {
  if (String(rootObject.firstLayer().class()) === 'MSBitMapLayer') return;

  if (_utils.default.svgHasStroke(rootObject)) {
    applyColor(rootObject, params);
  } else {
    if (_utils.default.hasMask(rootObject)) removeMask(context, rootObject);

    _svg.default.cleanSvg(rootObject);

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
  const color = params.colorPicker ? params.colorPicker : _libraries.default.getColorFromSymbol(params.color).color;
  rootObject.children().forEach(layer => {
    if (layer.styledLayer().style().hasEnabledBorder()) {
      const style = layer.styledLayer().style();
      style.enabledBorders().forEach(border => {
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

  if (_utils.default.svgHasStroke(rootObject)) {
    return applyColor(rootObject, {
      colorPicker: MSImmutableColor.blackColor()
    });
  }

  const iconLayer = rootObject.firstLayer();

  if (rootObject.layers().count() > 1 && iconLayer.hasClippingMask()) {
    iconLayer.hasClippingMask = false;
    iconLayer.clippingMaskMode = 1;
    const style = rootObject.firstLayer().style();
    const fills = style.fills();
    const fillColor = fills.count() > 0 ? style.fills()[0].color() : MSColor.blackColor();
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
    const libraryId = params.colorLib ? params.colorLib.libraryID() : null;
    const colorId = typeof params.color === 'string' ? params.color : params.color.symbolID();
    context.command.setValue_forKey_onLayer(libraryId, "colorLib", rootObject);
    context.command.setValue_forKey_onLayer(colorId, "color", rootObject);
    context.command.setValue_forKey_onLayer(null, "colorPicker", rootObject);
  } else if (params.colorPicker) {
    context.command.setValue_forKey_onLayer(_utils.default.convertMSColorToString(params.colorPicker), "colorPicker", rootObject);
    context.command.setValue_forKey_onLayer(null, "colorLib", rootObject);
    context.command.setValue_forKey_onLayer(null, "color", rootObject);
  }
}

function getMaskPropertiesFromArtboard(context, rootObject) {
  let params = getColorParams(context, rootObject);
  const maskLayer = rootObject.firstLayer();

  if (!params.colorLibraryId && !params.colorSymbolId && !params.colorString && maskLayer && maskLayer.hasClippingMask()) {
    _switchV3ToV.default.switchToV4(context, rootObject);

    params = getColorParams(context, rootObject);
  }

  if (!params.colorLibraryId && params.colorSymbolId) {
    params.colorSymbol = _libraries.default.getSymbolFromDocument(context.document.documentData(), params.colorSymbolId);
  } else if (params.colorLibraryId) {
    params.colorLibrary = _libraries.default.getLibById(params.colorLibraryId);

    _libraries.default.loadLibrary(params.colorLibrary);

    params.colorSymbol = _libraries.default.getSymbolFromDocument(params.colorLibrary.document(), params.colorSymbolId);
  }

  params.colorPicker = params.colorString ? _utils.default.convertStringToMSColor(params.colorString) : null;
  const result = {
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
  const currentRootObjectSize = rootObject.rect();
  const mask = MSShapeGroup.shapeWithRect({
    origin: {
      x: 0,
      y: 0
    },
    size: {
      width: currentRootObjectSize.size.width,
      height: currentRootObjectSize.size.height
    }
  });
  const fill = mask.style().addStylePartOfType(0);
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
  _utils.default.clearSelection(context);

  const librairiesController = AppController.sharedInstance().librariesController(); // const symbolMaster = (colorLibrary) ? librairiesController.importForeignSymbol_fromLibrary_intoDocument(colorSymbolMaster, colorLibrary, context.document.documentData()).symbolMaster() : colorSymbolMaster

  let importedSymbol;

  if (MSApplicationMetadata.metadata().appVersion >= 50) {
    const shareableObjectReference = MSShareableObjectReference.referenceForShareableObject_inLibrary(colorSymbolMaster, colorLibrary);
    importedSymbol = librairiesController.importShareableObjectReference_intoDocument(shareableObjectReference, context.document.documentData());
  } else {
    importedSymbol = librairiesController.importForeignSymbol_fromLibrary_intoDocument_(colorSymbolMaster, colorLibrary, context.document.documentData());
  }

  const symbolMaster = colorLibrary ? importedSymbol.symbolMaster() : colorSymbolMaster;
  return symbolMaster.newSymbolInstance();
}
/**
 * @name applyMask
 * @param context
 * @param rootObject {Object} : MSArtboardGroup && MSSymbolMaster
 * @param params
 */


function applyMask(context, rootObject, params) {
  let mask;

  if (params.color) {
    mask = getMaskSymbolFromLib(context, params.color, params.colorLib);
  } else if (params.colorPicker) {
    mask = createMaskFromNean(context, rootObject, params.colorPicker);
  }

  const currentArtboardSize = rootObject.rect();
  mask.setHeightRespectingProportions(currentArtboardSize.size.height);
  mask.setWidthRespectingProportions(currentArtboardSize.size.width);
  mask.setName('🎨 color');
  rootObject.firstLayer().style().disableAllFills();
  rootObject.addLayers([mask]);
  const iconLayer = rootObject.firstLayer();
  iconLayer.hasClippingMask = true;
  iconLayer.clippingMaskMode = 0;
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/providers/settings.js":
/*!***********************************!*\
  !*** ./src/providers/settings.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  registerSettings,
  getSettings,
  resetSettings,
  hasValue
};
exports.default = _default;
const LIST_SETTINGS_FIELDS = [// {name: 'artboardSize', defaultValue: 24},
// {name: 'iconPadding', defaultValue: 4},
{
  name: 'presets',
  default: '',
  placeholder: '24-4, 48-8...'
}, // {name: 'modalReplaceIcon', defaultValue: false},
// {name: 'viewBoxParams', defaultValue: false},
{
  name: 'convertStroke',
  default: '0',
  placeholder: '0'
}, // {name: 'otherSize', defaultValue: true},
// {name: 'otherSizeParams', defaultValue: 48},
{
  name: 'iconsByLine',
  default: '10',
  placeholder: '10'
}, {
  name: 'marginBetweenRootObject',
  default: '100%',
  placeholder: '100%'
}, {
  name: 'prefixRootObject',
  default: '',
  placeholder: 'icons/$size/...'
}];

function registerSettings(context, params) {
  LIST_SETTINGS_FIELDS.forEach(field => {
    NSUserDefaults.standardUserDefaults().setObject_forKey(params[field.name], field.name);
    context.command.setValue_forKey_onDocument(params[field.name], field.name, context.document.documentData());
  });
}

function resetSettings(context) {
  LIST_SETTINGS_FIELDS.forEach(field => {
    context.command.setValue_forKey_onDocument(null, field.name, context.document.documentData());
  });
}

function getSettings(context, fallbackValue) {
  const result = {};
  LIST_SETTINGS_FIELDS.forEach(field => {
    result[field.name] = {
      // 'value': context.command.valueForKey_onDocument(field.name, context.document.documentData()) || NSUserDefaults.standardUserDefaults().objectForKey(field.name),
      'value': NSUserDefaults.standardUserDefaults().objectForKey(field.name),
      'default': field.default,
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

module.exports = exports["default"];

/***/ }),

/***/ "./src/providers/svg.js":
/*!******************************!*\
  !*** ./src/providers/svg.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mask = _interopRequireDefault(__webpack_require__(/*! ./mask */ "./src/providers/mask.js"));

var _artboard = _interopRequireDefault(__webpack_require__(/*! ./artboard */ "./src/providers/artboard.js"));

var _settings = _interopRequireDefault(__webpack_require__(/*! ./settings */ "./src/providers/settings.js"));

var _utils = _interopRequireDefault(__webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  initUpdateIconsSelectedArtboards,
  addSVG,
  addPDF,
  addBITMAP,
  cleanSvg,
  convertStrokeToFill,
  addSVGNew
};
/**
 * @name initUpdateIconsSelectedArtboards
 * @description main function to update multiple icons on selected artboard
 * @param context
 * @param params {Object}
 * @param rootObjects {Array} : MSArtboardGroup && MSSymbolMaster
 */

exports.default = _default;

function initUpdateIconsSelectedArtboards(context, rootObjects, params) {
  rootObjects.forEach((rootObject, index) => {
    const iconParams = { ..._mask.default.getMaskPropertiesFromArtboard(context, rootObject.object),
      ..._artboard.default.getPaddingAndSize(context, rootObject.object),
      ...params
    };
    const replaceBy = params.listIcon.length === 1 ? params.listIcon[0] : params.listIcon[index];
    const svgData = String(NSString.alloc().initWithContentsOfURL(replaceBy));
    iconParams.withMask = !!(iconParams.colorLib || iconParams.colorPicker || iconParams.color);
    rootObject.object.removeAllLayers();
    addSVG(context, rootObject.object, iconParams, String(svgData), true);
    rootObject.object.setName(_utils.default.getIconNameByNSUrl(replaceBy));
    if (iconParams.withMask) _mask.default.addColor(context, rootObject.object, iconParams);
  });

  _utils.default.clearSelection(context);

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
  let viewBox;

  const settingsParams = _settings.default.getSettings(context, 'default');

  svgData = NSString.stringWithString(svgData);
  viewBox = getViewBox(svgData);
  if (withResize) svgData = addRectToResize(svgData, viewBox);
  const svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(svgData.dataUsingEncoding(NSUTF8StringEncoding));
  const svgLayer = svgImporter.importAsLayer();
  removeTxt(svgLayer);
  rootObject.addLayer(svgLayer); // removeNoFillChildren(rootObject)

  if (_utils.default.svgHasStroke(rootObject) && settingsParams.convertStroke.data === '1') convertStrokeToFill(rootObject);
  if (withResize) resizeIcon(rootObject, params.iconPadding);
  if (withResize) removeDeleteMeRect(rootObject);
  center(params.artboardSize, rootObject.firstLayer());
}

function addSVGNew(context, rootObject, params, svgData) {
  svgData = NSString.stringWithString(svgData);
  const svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(svgData.dataUsingEncoding(NSUTF8StringEncoding));
  const svgLayer = svgImporter.importAsLayer();
  rootObject.addLayers([svgLayer]);
  const svgLayerFrame = svgLayer.frame();
  const width = svgLayerFrame.width();
  const height = svgLayerFrame.height();
  svgLayerFrame.constrainProportions = true;

  if (width >= height) {
    svgLayer.setWidthRespectingProportions(params.artboardSize - 2 * params.iconPadding + 0.01);
  } else {
    svgLayer.setHeightRespectingProportions(params.artboardSize - 2 * params.iconPadding + 0.01);
  }

  svgLayerFrame.setX((params.artboardSize - svgLayerFrame.width()) / 2);
  svgLayerFrame.setY((params.artboardSize - svgLayerFrame.height()) / 2);
}

function addPDF(context, rootObject, params, icon) {
  const rootObjectPosition = rootObject.origin();
  const pdfImporter = MSPDFImporter.pdfImporter();
  pdfImporter.prepareToImportFromURL(icon);
  const pdfLayer = pdfImporter.importAsLayer();
  rootObject.addLayers(pdfLayer.layers());
  rootObject.resizeToFitChildren();
  rootObject.resizesContent = true;
  const rootObjectFrame = rootObject.frame();
  rootObjectFrame.setWidth(params.artboardSize - 2 * params.iconPadding);
  rootObjectFrame.setHeight(params.artboardSize - 2 * params.iconPadding);
  rootObject.resizesContent = false;
  rootObjectFrame.setWidth(params.artboardSize);
  rootObjectFrame.setHeight(params.artboardSize);
  rootObject.layers().forEach(layer => {
    const layerFrame = layer.frame();
    layerFrame.setX(params.iconPadding);
    layerFrame.setY(params.iconPadding);
  });
  rootObjectFrame.setX(rootObjectPosition.x);
  rootObjectFrame.setY(rootObjectPosition.y);
}

function addBITMAP(context, rootObject, params, icon) {
  if (String(icon.class()) === 'MSBitmapLayer') {
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
  const addrect = `<rect width="${viewBox.width}" height="${viewBox.height}" id="delete-me"/></svg>`;
  return NSString.stringWithString(svgString.replace('</svg>', addrect));
}
/**
 * @name cleanSvg
 * @description main function which used sketch properties to convert icon in one path
 * @param rootObject
 */


function cleanSvg(rootObject) {
  unGroup(rootObject);
  rootObject.firstLayer().setName(rootObject.name()); // removeNoFillLayer(rootObject);

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
  const shapeGroupWidth = svgLayer.frame().width();
  const shapeGroupHeight = svgLayer.frame().height();
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
  const svgLayer = rootObject.firstLayer();
  const svgLayerFrame = svgLayer.frame();
  const currentArtboardRect = rootObject.rect();
  const currentArtboardSize = {
    width: parseInt(currentArtboardRect.size.width),
    height: parseInt(currentArtboardRect.size.height)
  };
  const width = svgLayerFrame.width();
  const height = svgLayerFrame.height();
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
  const scope = svgLayer.children(),
        predicateTextLayers = NSPredicate.predicateWithFormat('(className == %@)', 'MSTextLayer');
  const layers = scope.filteredArrayUsingPredicate(predicateTextLayers);
  const loop = layers.objectEnumerator();
  let layer;

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
  const scope = svgLayer.children(),
        predicateTextLayers = NSPredicate.predicateWithFormat('(className == %@)', 'MSLayerGroup');
  const layers = scope.filteredArrayUsingPredicate(predicateTextLayers);
  const loop = layers.objectEnumerator();
  let layer;

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
  const scope = rootObject.children(),
        predicateTextLayers = NSPredicate.predicateWithFormat('(name == %@)', 'delete-me');
  const layers = scope.filteredArrayUsingPredicate(predicateTextLayers);
  if (!layers.length) return rootObject.firstLayer().lastLayer().removeFromParent();
  const loop = layers.objectEnumerator();
  let layer;

  while (layer = loop.nextObject()) {
    layer.removeFromParent();
  }
} // /**
//  * @description remove transparent layers
//  * @name removeNoFillLayer
//  * @param rootObject
//  */
// function removeNoFillLayer(rootObject) {
//   const indexes = NSMutableIndexSet.indexSet();
//   rootObject.layers().forEach((layer, index) => {
//     if (!layer.style().hasEnabledFill() && !layer.style().hasEnabledBorder()) indexes.addIndex(index);
//   });
//   rootObject.removeLayersAtIndexes(indexes);
// }
// /**
//  * @description remove transparent layers
//  * @name removeNoFillLayer
//  * @param rootObject
//  */
// function removeNoFillChildren(rootObject) {
//   const toDelete = []
//   rootObject.firstLayer().children().forEach(layer => {
//     const style = layer.styledLayer().style()
//     if (style.hasEnabledFill() && style.contextSettings().opacity() === 0) {
//       toDelete.push(layer);
//     }
//   });
//
//   toDelete.forEach(layer => {
//     layer.removeFromParent()
//   })
// }

/**
 * @name mergeLayer
 * @description merge all path in one path
 * @param rootObject
 */


function mergeLayer(rootObject) {
  const layers = rootObject.layers();

  if (layers.length > 1) {
    for (let i = 0; i <= layers.length - 1; i++) {
      layers[1].moveToLayer_beforeLayer(layers[0], layers[1]);
    }
  }

  if (rootObject.layers().length > 1) return mergeLayer(rootObject);
  rootObject.children().forEach(children => {
    if (children.booleanOperationCanBeReset()) children.setBooleanOperation(-1);
  }); // layers[0].resizeToFitChildrenWithOption(0);

  layers[0].setName(rootObject.name());
}
/**
 * @name getViewBox
 * @description return values of viewbox
 * @param svgData
 * @returns {{width: number, height: number}}
 */


function getViewBox(svgData) {
  let viewBox = svgData.match(/viewBox="(.*?)"/gm);
  let size;
  let result;

  if (Array.isArray(viewBox)) {
    size = viewBox[0].match(/[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g);
    result = {
      width: parseFloat(size[2]),
      height: parseFloat(size[3])
    };
  }

  return result;
}

function convertStrokeToFill(rootObject) {
  rootObject.children().forEach(layer => {
    if (layer.canConvertToOutlines() && String(layer.name()) !== 'delete-me') {
      layer.layersByConvertingToOutlines();
    }
  });
  rootObject.children().forEach(layer => {
    layer.styledLayer().style().disableAllBorders();
  });
} // function setThicknessProportionnally(svgLayer, diagContainer, viewBox) {
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


module.exports = exports["default"];

/***/ }),

/***/ "./src/utils/MochaJSDelegate.js":
/*!**************************************!*\
  !*** ./src/utils/MochaJSDelegate.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//  MochaJSDelegate.js
//  MochaJSDelegate
//
//  Created by Matt Curtis
//  Copyright (c) 2015. All rights reserved.
//
var _default = MochaJSDelegate;
exports.default = _default;

function MochaJSDelegate(selectorHandlerDict, superclass) {
  var uniqueClassName = 'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString();
  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject);
  delegateClassDesc.registerClass(); // Storage Handlers

  var handlers = {}; // Define interface

  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers;
    var selector = NSSelectorFromString(selectorString);
    handlers[selectorString] = func;
    /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */

    if (!handlerHasBeenSet) {
      var args = [];
      var regex = /:/g;

      while (regex.exec(selectorString)) {
        args.push('arg' + args.length);
      }

      var dynamicFunction = eval('(function (' + args.join(', ') + ') { return handlers[selectorString].apply(this, arguments); })');
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
    return NSClassFromString(uniqueClassName).new();
  }; // Convenience


  if (typeof selectorHandlerDict === 'object') {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString]);
    }
  }
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/utils/analytics.js":
/*!********************************!*\
  !*** ./src/utils/analytics.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const kUUIDKey = 'google.analytics.uuid';
let uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey);

if (!uuid) {
  uuid = NSUUID.UUID().UUIDString();
  NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey);
}

function jsonToQueryString(json) {
  return '?' + Object.keys(json).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
  }).join('&');
}

var _default = {
  action
};
exports.default = _default;

function action(context, category, action, label, value) {
  const payload = {
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
    const url = NSURL.URLWithString(NSString.stringWithFormat("https://www.google-analytics.com/collect%@", jsonToQueryString(payload)));

    if (url) {
      const task = NSTask.alloc().init();
      task.setLaunchPath("/usr/bin/curl");
      task.setArguments(['-X', 'POST', String(url)]);
      const outputPipe = NSPipe.pipe();
      task.setStandardOutput(outputPipe);
      task.launch();
    }
  } catch (e) {}
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/utils/logger.js":
/*!*****************************!*\
  !*** ./src/utils/logger.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function () {
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

exports.default = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./src/utils/modals.js":
/*!*****************************!*\
  !*** ./src/utils/modals.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _libraries = _interopRequireDefault(__webpack_require__(/*! ../providers/libraries */ "./src/providers/libraries.js"));

var _utils = _interopRequireDefault(__webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js"));

var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger */ "./src/utils/logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  newModal,
  runModal,
  getMainButtonParam,
  createArtboardFields,
  createCheckBoxes,
  createMaskFields,
  appendsFields,
  getParams,
  setNextKey,
  newErrorModal
  /**
   * @name newModal
   * @description instantiate modal
   * @param context
   * @param viewSize {Object}
   * @param modalParams
   * @returns {{modal: *, view: *, viewSize: *}}
   */

};
exports.default = _default;

function newModal(context, viewSize, modalParams) {
  const modal = COSAlertWindow.new();
  const view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewSize.width, viewSize.height));
  modal.addAccessoryView(view);
  modal.setMessageText(modalParams.messageText);
  modal.setInformativeText(modalParams.informativeText);
  modal.addButtonWithTitle('Continue');
  modal.addButtonWithTitle('Cancel');
  modal.layout();
  return {
    modal,
    view,
    viewSize
  };
}
/**
 * @name runModal
 * @description run modal
 * @param modal
 * @returns {Object} : NSView
 */


function runModal({
  modal
}) {
  return modal.runModal();
}
/**
 * @name getMainButtonParam
 * @description get value of main button of view
 * @param button
 * @returns {Object}
 */


function getMainButtonParam(button) {
  return {
    button
  };
}
/**
 * @name createArtboardFields
 * @description create fields for new artboards params
 * @returns {[Object,Object]}
 */


function createArtboardFields() {
  const textBox = NSTextField.alloc().initWithFrame(NSMakeRect(0, 10, 130, 20));
  textBox.setStringValue('24');
  const textBoxPadding = NSTextField.alloc().initWithFrame(NSMakeRect(140, 10, 130, 20));
  textBoxPadding.setStringValue('3');
  return [{
    item: textBox,
    getter: function () {
      return parseInt(textBox.stringValue());
    },
    name: 'artboardSize',
    label: _utils.default.createLabel('Size', 0, 30, 130, 20)
  }, {
    item: textBoxPadding,
    getter: function () {
      return parseInt(textBoxPadding.stringValue());
    },
    name: 'iconPadding',
    label: _utils.default.createLabel('Padding', 140, 30, 130, 20)
  }];
}
/**
 * @name createCheckBoxMask
 * @description create field for checkbox for add mask
 * @returns {[Object]}
 */


function createCheckBoxes() {
  const symbolCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(0, 30, 200, 14));
  symbolCheckBox.setButtonType(NSSwitchButton);
  symbolCheckBox.setState(true);
  symbolCheckBox.setFont(NSFont.systemFontOfSize_(13));
  symbolCheckBox.setTitle('Convert to symbol');
  const maskCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(0, 5, 200, 14));
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
  const colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 130, 20));
  const colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(140, 0, 130, 20));
  colorLibsMenu.setEnabled(false);
  colorMenu.setEnabled(false);
  colorLibsMenu.menu = _libraries.default.initLibsSelectList(AppController.sharedInstance().librariesController().availableLibraries(), colorMenu);

  if (checkboxFields) {
    checkboxFields[1].item.setCOSJSTargetFunction(function (mask) {
      if (mask.state()) {
        colorLibsMenu.setEnabled(true); // documentColorMenu.setEnabled(true)

        if (colorMenu.selectedItem()) colorMenu.setEnabled(true);
      } else {
        colorLibsMenu.setEnabled(false);
        colorMenu.setEnabled(false); // documentColorMenu.setEnabled(false)
      }
    });
  } else {
    colorLibsMenu.setEnabled(true);
  }

  return [{
    item: colorMenu,
    label: _utils.default.createLabel('Color', 140, 25, 130, 20),
    name: 'color',
    getter: function () {
      let currentItem = this.item.selectedItem();
      return currentItem ? currentItem.representedObject() : null;
    }
  }, {
    item: colorLibsMenu,
    label: _utils.default.createLabel('Colors Library', 0, 25, 130, 20),
    name: 'colorLib',
    getter: function () {
      let currentItem = this.item.selectedItem();
      return currentItem ? currentItem.representedObject() : null;
    }
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


function appendsFields({
  view,
  viewSize
}, allFields, withLabelBottom) {
  allFields.reverse().forEach(function (fields) {
    const y = withLabelBottom ? view.subviews().length * 50 + 25 : view.subviews().length * 50;
    const viewCell = NSView.alloc().initWithFrame(NSMakeRect(0, y, viewSize.width, 50));
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
  const result = {};
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
  const modal = COSAlertWindow.new();
  modal.setMessageText(message);
  modal.setInformativeText(informativeText);
  modal.runModal();
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/utils/switchV3ToV4.js":
/*!***********************************!*\
  !*** ./src/utils/switchV3ToV4.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mask = _interopRequireDefault(__webpack_require__(/*! ../providers/mask */ "./src/providers/mask.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  switchToV4
};
exports.default = _default;

function switchToV4(context, rootObject) {
  const mask = rootObject.lastLayer();
  const params = {
    color: null,
    colorLib: null,
    colorPicker: null
  };

  if (String(mask.class()) === 'MSSymbolInstance') {
    const color = mask.symbolMaster();
    const foreign = color.foreignSymbol();
    params.color = color;

    if (foreign) {
      params.color = String(foreign.originalMaster().symbolID());
      params.colorLib = foreign;
    }
  } else {
    params.colorPicker = mask.style().fills()[0].color();
  }

  _mask.default.registerMask(context, rootObject, params);
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MochaJSDelegate = _interopRequireDefault(__webpack_require__(/*! ./MochaJSDelegate.js */ "./src/utils/MochaJSDelegate.js"));

var _logger = _interopRequireDefault(__webpack_require__(/*! ./logger */ "./src/utils/logger.js"));

var _settings = _interopRequireDefault(__webpack_require__(/*! ../providers/settings */ "./src/providers/settings.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
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
  /**
   * @name clearSelection
   * @description unselect all
   * @param context
   */

};
exports.default = _default;

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
  const label = NSTextField.alloc().initWithFrame_(NSMakeRect(x, y, w, h));

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
  let selectedArtboardsAndSymbols = [];
  context.selection.forEach(function (layer) {
    let className = String(layer.class());

    if (className !== 'MSArtboardGroup' || className !== 'MSSymbolMaster') {
      layer = layer.parentRoot();
      className = String(layer.class());
    }

    if (selectedArtboardsAndSymbols.indexOf(String(layer.objectID())) === -1 && (className === 'MSArtboardGroup' || className === 'MSSymbolMaster')) {
      selectedArtboardsAndSymbols.push({
        'object': layer,
        'type': className,
        'id': layer.objectID()
      });
    }
  });
  selectedArtboardsAndSymbols = selectedArtboardsAndSymbols.filter((rootElement, index, self) => index === self.findIndex(compareElement => compareElement.id === rootElement.id));
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
  const webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, 220, 300));
  const windowObject = webView.windowScriptObject();
  const delegate = new _MochaJSDelegate.default({
    "webView:didFinishLoadForFrame:": function (webView, webFrame) {
      _logger.default.log('loaded');
    },
    "webView:didChangeLocationWithinPageForFrame:": function (webView, webFrame) {
      const query = windowObject.evaluateWebScript('window.location.hash');
      const color = JSON.parse(decodeURIComponent(query).split('color=')[1]);
      color.r = parseInt(color.r) / 255;
      color.g = parseInt(color.g) / 255;
      color.b = parseInt(color.b) / 255;
      color.a = parseFloat(color.a);
      const colorNS = NSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a);
      const colorMS = MSImmutableColor.colorWithNSColor(colorNS);
      pickerButton.setImage(getImageByColor(colorNS, {
        width: 40,
        height: 30
      }));
      setColor(colorMS);
    }
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


function getImageByColor(color, colorSize = {
  width: 14,
  height: 14
}) {
  const size = CGSizeMake(colorSize.width, colorSize.height);
  const image = NSImage.alloc().init();
  image.size = size;
  image.lockFocus();
  const colorCell = MSBackgroundColorView.alloc().init();
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
  const svgExporter = SketchSVGExporter.alloc().init();
  const svgData = svgExporter.exportLayers([layer.immutableModelObject()]);
  return NSString.alloc().initWithData_encoding(svgData, NSUTF8StringEncoding);
}

function svgHasStroke(rootObject) {
  let hasBorder = false;
  rootObject.children().forEach(layer => {
    if (layer.styledLayer().style().hasEnabledBorder()) {
      hasBorder = true;
    }
  });
  return hasBorder;
}

function getBorderColor(rootObject) {
  let color;
  const layers = rootObject.children();

  for (let i = 0; i < layers.length; i++) {
    let style = layers[i].styledLayer().style();
    color = style.firstEnabledBorder();
    if (color) break;
  }

  return color;
}

function convertMSColorToString(colorMS) {
  return JSON.stringify({
    r: colorMS.red(),
    g: colorMS.green(),
    b: colorMS.blue(),
    a: colorMS.alpha()
  });
}

function convertStringToMSColor(string) {
  const color = typeof string !== 'object' ? string : JSON.parse(string);
  const colorNS = NSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a);
  return MSImmutableColor.colorWithNSColor(colorNS);
}

function getRootObject(context) {
  const result = [];
  context.api().selectedDocument.selectedPage.sketchObject.layers().forEach(layer => {
    let className = String(layer.class());

    if (className === 'MSArtboardGroup' || className === 'MSSymbolMaster') {
      result.push(layer);
    }
  });
  return result;
}

function getSizeBetweenIcon(rootObjectSize, size) {
  const value = parseInt(size);
  const unit = size.replace(value, '');
  return unit && unit === '%' ? rootObjectSize + rootObjectSize * (value / 100) : rootObjectSize + value;
}

function buildPrefix(context, rootObjectSize) {
  const settings = _settings.default.getSettings(context, 'default'); // console.log('>>>>>>>>>>>', (settings.prefixRootObject.data !== 'null'));
  // console.log('>>>>>>>>>>>', settings.prefixRootObject.data);


  return settings.prefixRootObject.data !== 'null' ? settings.prefixRootObject.data.replace('$size', rootObjectSize) : '';
} // function zoomOutOfPage(context){
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


module.exports = exports["default"];

/***/ })

/******/ });
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
that['organizeIcons'] = __skpm_run.bind(this, 'organizeIcons')

//# sourceMappingURL=commands.js.map