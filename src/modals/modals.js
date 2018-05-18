import utils from '../utils/utils'
import logger from '../utils/logger'
import libraries from '../providers/libraries'
import settingsProvider from '../providers/settings'
let global = {};
const disabledColor = NSColor.colorWithCalibratedRed_green_blue_alpha(170 / 255, 170 / 255, 170 / 255, 1)
export {
  setEnabledColorMenu,
  importModal,
  maskModal,
  constructBase
}

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
    result.color = (colorMenu) ? global.colorsMenuParams.representedObject() : null;

    let colorLib = global.colorLibsMenuParams.selectedItem();
    result.colorLib = (colorLib) ? global.colorLibsMenuParams.representedObject() : null;
  } else {
    result.colorPicker = global.colorPickerColor
  }

  return result
}

function importModal(context) {
  let global = {};
  let usePresets;
  global.settingsValues = settingsProvider.getSettings(context, 'default');

  global.modalParams = {
    messageText: 'Configure your import',
    informativeText: 'Your icons will be arranged in artboards. Set size and padding of your artboards.',
    width: 300,
    lineHeight: 35
  };

  if (settingsProvider.hasValue(global.settingsValues.presets)) {
    global.modalParams.height = 300 + global.settingsValues.presets.data.split(',').length * 30
    usePresets = true
  } else {
    global.modalParams.height = 300;
    usePresets = false
  }

  global.modalParams.height = settingsProvider.hasValue(global.settingsValues.presets) ? 300 + global.settingsValues.presets.data.split(',').length * 30 : 300

  global.coeffCurrentHeight = 0;
  global.isLibrarySource = true;
  global.adjustHeight = 0;

  constructBase('Continue', global)
  if (usePresets) {
    makePresetsParams(global)
  } else {
    makeArtboardParams(global)
  }

  global.view.addSubview(utils.createDivider(NSMakeRect(0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - 10, global.modalParams.width, 1)));
  global.adjustHeight = 5
  makeSymbolParams(global)
  global.view.addSubview(utils.createDivider(NSMakeRect(0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - 15, global.modalParams.width, 1)));
  global.adjustHeight = 8
  makeMaskCheckboxParams(global)
  makeMaskRadioButtonParams(global)
  makeMaskLibraryParams(context, global)
  setEnabledColorLibraryMenu(false, global)
  setEnabledColorMenu(false, global)
  setEnabledRadioButton(false, global)
  makeMaskColorPickerParams(context, global)
  addListenerOnMaskCheckbox(global)

  const result = {
    button: global.modal.runModal(),
    convertSymbol: global.symbolParams.state(),
    withMask: !!global.checkboxMaskParams.state()
  }

  if (usePresets) {
    result.presets = []
    global.presets.forEach(preset => {
      if (preset.presetCheckBox.state()) {
        result.presets.push({
          artboardSize: parseInt(preset.sizeBox.stringValue()),
          iconPadding: parseInt(preset.paddingBox.stringValue())
        })
      }
    })
  } else {
    result.artboardSize = parseInt(global.artboardSize.stringValue())
    result.iconPadding = parseInt(global.artboardPadding.stringValue())
  }

  if (result.withMask && global.isLibrarySource) {
    let colorMenu = global.colorsMenuParams.selectedItem()
    result.color = (colorMenu) ? global.colorsMenuParams.representedObject() : null

    let colorLib = global.colorLibsMenuParams.selectedItem()
    result.colorLib = (colorLib) ? global.colorLibsMenuParams.representedObject() : null

    if (!result.color) result.withMask = false
  } else if (result.withMask) {
    result.colorPicker = global.colorPickerColor || MSColor.blackColor()
  }
  return result
}

function artboardModal(context) {
  let global = {};
  global.settingsValues = settingsProvider.getSettings(context, 'placeholder')

  global.modalParams = {
    messageText: 'Configure your icons',
    informativeText: 'Your icons will be moved in artboards. Set size and padding of your artboards.',
    height: 100,
    width: 300,
    lineHeight: 35
  }

  global.coeffCurrentHeight = 0
  global.adjustHeight = 0

  constructBase(global)
  makeArtboardParams(global)

  return {
    button: global.modal.runModal(),
    artboardSize: parseInt(global.artboardSize.stringValue()),
    iconPadding: parseInt(global.artboardPadding.stringValue()),
  }
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
    const properties = preset.split('-')
    return {
      artboardSize: properties[0],
      padding: (properties[1]) ? properties[1] : 0
    }
  })

  global.presets = []

  const presetLabel = utils.createLabel(`Presets`, 0, global.modalParams.height - global.modalParams.lineHeight, 150, 20)
  global.view.addSubview(presetLabel)

  const sizeLabel = utils.createLabel(`Size`, 180, global.modalParams.height - global.modalParams.lineHeight, 100, 20)
  global.view.addSubview(sizeLabel)

  const paddingLabel = utils.createLabel(`Padding`, 240, global.modalParams.height - global.modalParams.lineHeight, 100, 20)
  global.view.addSubview(paddingLabel)

  global.coeffCurrentHeight++

  presets.forEach((preset) => {
    global.coeffCurrentHeight++
    makePreset(preset, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight, global)
  })
}

function makeArtboardParams(global) {

  global.coeffCurrentHeight++

  const textBoxLabel = utils.createLabel('Artboard size', 0, global.modalParams.height - global.modalParams.lineHeight, 150, 20)
  global.view.addSubview(textBoxLabel)
  const textBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight, 50, 20));
  textBox.setStringValue(24);
  global.view.addSubview(textBox)
  const textBoxUnit = utils.createLabel('px', 205, global.modalParams.height - global.modalParams.lineHeight, 50, 20)
  global.view.addSubview(textBoxUnit)

  global.coeffCurrentHeight++

  const paddingBoxLabel = utils.createLabel('Artboard Padding', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight, 150, 20)
  global.view.addSubview(paddingBoxLabel)
  const paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight, 50, 20));
  paddingBox.setStringValue(4);
  global.view.addSubview(paddingBox)
  const paddingBoxUnit = utils.createLabel('px', 205, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight, 50, 20)
  global.view.addSubview(paddingBoxUnit)

  global.artboardPadding = paddingBox
  global.artboardSize = textBox

  global.artboardSize.setNextKeyView(global.artboardPadding)
}

function makePreset(preset, yAxis, global) {

  const presetCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, yAxis, 30, 20));
  presetCheckBox.setState(true);
  presetCheckBox.setButtonType(NSSwitchButton);
  presetCheckBox.setFont(NSFont.systemFontOfSize_(13));
  presetCheckBox.setTitle('')

  global.view.addSubview(presetCheckBox)

  const sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(180, yAxis, 50, 20));
  sizeBox.setStringValue(preset.artboardSize);
  global.view.addSubview(sizeBox)

  const paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(240, yAxis, 50, 20));
  paddingBox.setStringValue(preset.padding);
  global.view.addSubview(paddingBox)

  const newPreset = { sizeBox, paddingBox, presetCheckBox }

  addListenerPreset(newPreset)

  global.presets.push(newPreset)
}

function makeSymbolParams(global) {

  global.coeffCurrentHeight++

  const maskCheckboxLabel = utils.createLabel('Symbols', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 150, 20)
  global.view.addSubview(maskCheckboxLabel)

  const symbolCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 200, 20));
  symbolCheckBox.setButtonType(NSSwitchButton);
  symbolCheckBox.setState(true);
  symbolCheckBox.setFont(NSFont.systemFontOfSize_(13));
  symbolCheckBox.setTitle('Convert to symbol')
  global.view.addSubview(symbolCheckBox);

  global.symbolParams = symbolCheckBox
}

function makeMaskCheckboxParams(global) {

  global.coeffCurrentHeight++

  const maskCheckboxLabel = utils.createLabel('Mask', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 150, 20)
  global.view.addSubview(maskCheckboxLabel)

  const maskCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 200, 20));
  maskCheckBox.setButtonType(NSSwitchButton);
  maskCheckBox.setState(false);
  maskCheckBox.setFont(NSFont.systemFontOfSize_(13));
  maskCheckBox.setTitle('Add color mask')
  global.view.addSubview(maskCheckBox);

  global.checkboxMaskParams = maskCheckBox
}

function makeMaskRadioButtonParams(global) {

  global.coeffCurrentHeight++;
  global.coeffCurrentHeight++;

  const radioButtonLabel = utils.createLabel('Color Source', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight + 40, 150, 20)
  global.view.addSubview(radioButtonLabel)

  const buttonFormat = NSButtonCell.alloc().init();
  buttonFormat.setButtonType(NSRadioButton);
  const matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(
    NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 300, 60),
    NSRadioModeMatrix,
    buttonFormat,
    2,
    1
  );
  matrixFormat.setCellSize(CGSizeMake(300, 25));
  const cells = matrixFormat.cells();
  cells[0].setTitle("From Symbols");
  cells[0].setFont(NSFont.systemFontOfSize_(13));
  cells[1].setTitle("From Color picker");
  cells[1].setFont(NSFont.systemFontOfSize_(13));

  global.view.addSubview(matrixFormat);

  setListenerRadioButon(cells, global)

  global.radioParams = matrixFormat
  global.radioButtonLabel = radioButtonLabel
}

function makeMaskLibraryParams(context, global) {

  global.coeffCurrentHeight++

  const colorLibsLabel = utils.createLabel('Document Source', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 150, 25)
  global.view.addSubview(colorLibsLabel)
  const colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 130, 30));

  global.coeffCurrentHeight++

  const colorMenuLabel = utils.createLabel('Color', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 150, 25)
  global.view.addSubview(colorMenuLabel)
  const colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 130, 30));

  global.view.addSubview(colorLibsMenu);
  global.view.addSubview(colorMenu);

  global.colorLibsMenuParams = colorLibsMenu
  global.colorsMenuParams = colorMenu
  global.colorLibsMenuParamsLabel = colorLibsLabel
  global.colorsMenuParamsLabel = colorMenuLabel

  colorLibsMenu.menu = libraries.initLibsSelectList(context, AppController.sharedInstance().librariesController().availableLibraries(), colorMenu, global);
}

function makeMaskColorPickerParams(context, global) {

  const colorPickerLabel = utils.createLabel('Color picker', 0, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight + 20, 150, 20)

  const pickerView = NSView.alloc().initWithFrame(NSMakeRect(150, global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight - global.adjustHeight, 130, 60));
  pickerView.setWantsLayer(true)
  pickerView.layer().setBackgroundColor(CGColorCreateGenericRGB(1, 1, 1, 1.0))
  pickerView.layer().setBorderColor(CGColorCreateGenericRGB(186 / 255, 186 / 255, 186 / 255, 1))
  pickerView.layer().borderWidth = 1

  const hexLabel = utils.createLabel('#000000', 60, 20, 100, 20)
  pickerView.addSubview(hexLabel)

  const pickerButton = NSButton.alloc().initWithFrame(NSMakeRect(5, 15, 50, 30));
  pickerButton.setButtonType(NSMomentaryChangeButton)
  pickerButton.setImage(utils.getImageByColor(NSColor.colorWithRed_green_blue_alpha(0, 0, 0, 1), {
    width: 40,
    height: 30
  }))

  pickerButton.setBordered(false);

  const main = AMOMain.alloc().init();

  pickerButton.setCOSJSTargetFunction(() => {
    main.openPopover_onView_withWebview(pickerButton, global.view, utils.createWebview(context, pickerButton, (color) => {
      global.colorPickerColor = color
      hexLabel.setStringValue_(`#${color.immutableModelObject().hexValue()}`)
    }))
  })

  pickerView.addSubview(pickerButton)

  global.pickerView = pickerView
  global.colorPickerLabel = colorPickerLabel
}

function addListenerOnMaskCheckbox(global) {


  global.checkboxMaskParams.setCOSJSTargetFunction((mask) => {
    if (mask.state()) {
      setEnabledRadioButton(true, global)
      setEnabledColorLibraryMenu(true, global)
      if (global.colorsMenuParams.numberOfItems() > 0) setEnabledColorMenu(true, global)
    } else {
      setEnabledRadioButton(false, global)
      setEnabledColorLibraryMenu(false, global)
      setEnabledColorMenu(false, global)
      addLibraryColorsFields(global)
      removePickerButton(global)
      global.radioParams.cells()[0].state = true
      global.radioParams.cells()[1].state = false
    }
  });
}

function setListenerRadioButon(cells, global) {
  function setState(item) {
    if (String(item.selectedCells()[0].title()) === 'From Symbols') {
      addLibraryColorsFields(global)
      removePickerButton(global)
      global.isLibrarySource = true
    } else {
      removeLibraryColorsFields(global)
      addPickerButton(global)
      global.isLibrarySource = false
    }
  }

  cells[0].setCOSJSTargetFunction(setState);
  cells[1].setCOSJSTargetFunction(setState);
}

function setEnabledColorLibraryMenu(enabled, global) {
  const color = (enabled) ? NSColor.controlTextColor() : disabledColor
  global.colorLibsMenuParamsLabel.setTextColor(color)
  global.colorLibsMenuParams.setEnabled(enabled)

}

function setEnabledColorMenu(enabled, global) {
  global.colorsMenuParamsLabel.setTextColor(getStateColor(enabled))
  global.colorsMenuParams.setEnabled(enabled)
}

function setEnabledRadioButton(enabled, global) {
  global.radioParams.setEnabled(enabled)
  global.radioButtonLabel.setTextColor(getStateColor(enabled))
}

function removeLibraryColorsFields(global) {
  global.colorLibsMenuParams.removeFromSuperview()
  global.colorsMenuParams.removeFromSuperview()
  global.colorLibsMenuParamsLabel.removeFromSuperview()
  global.colorsMenuParamsLabel.removeFromSuperview()
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
  global.pickerView.removeFromSuperview()
  global.colorPickerLabel.removeFromSuperview()
}

function getStateColor(enabled) {
  return (enabled) ? NSColor.controlTextColor() : disabledColor
}

function addListenerPreset(newPreset) {
  newPreset.presetCheckBox.setCOSJSTargetFunction(() => {
    newPreset.sizeBox.setEnabled(newPreset.presetCheckBox.state())
    newPreset.paddingBox.setEnabled(newPreset.presetCheckBox.state())

  })
}
