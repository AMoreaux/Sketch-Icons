import utils from '../utils/utils'
import logger from '../utils/logger'
import libraries from '../providers/libraries'
import settingsProvider from '../providers/settings'
const disabledColor = NSColor.colorWithCalibratedRed_green_blue_alpha(170 / 255, 170 / 255, 170 / 255, 1)
export {
  setEnabledColorMenu,
  importModal,
  maskModal,
  constructBase
}

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

  constructBase.call(this, 'Continue');

  makeMaskRadioButtonParams.call(this);
  makeMaskLibraryParams.call(this, context);
  makeMaskColorPickerParams.call(this, context);

  const result = {
    button: this.modal.runModal()
  };

  if (this.isLibrarySource) {
    let colorMenu = this.colorsMenuParams.selectedItem();
    result.color = (colorMenu) ? this.colorsMenuParams.representedObject() : null;

    let colorLib = this.colorLibsMenuParams.selectedItem();
    result.colorLib = (colorLib) ? this.colorLibsMenuParams.representedObject() : null;
  } else {
    result.colorPicker = this.colorPickerColor
  }

  return result
}

function importModal(context) {
  let usePresets;
  this.settingsValues = settingsProvider.getSettings(context, 'default');

  this.modalParams = {
    messageText: 'Configure your import',
    informativeText: 'Your icons will be arranged in artboards. Set size and padding of your artboards.',
    width: 300,
    lineHeight: 35
  };

  if (settingsProvider.hasValue(this.settingsValues.presets)) {
    this.modalParams.height = 300 + this.settingsValues.presets.data.split(',').length * 30
    usePresets = true
  } else {
    this.modalParams.height = 300;
    usePresets = false
  }

  this.modalParams.height = settingsProvider.hasValue(this.settingsValues.presets) ? 300 + this.settingsValues.presets.data.split(',').length * 30 : 300

  this.coeffCurrentHeight = 0;
  this.isLibrarySource = true;
  this.adjustHeight = 0;

  constructBase.call(this, 'Continue')
  console.log('>>>>>>>>>>>');
  if (usePresets) {
    makePresetsParams.call(this)
  } else {
    makeArtboardParams.call(this)
  }
  console.log('>>>>>>>>>>>');

  this.view.addSubview(utils.createDivider(NSMakeRect(0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - 10, this.modalParams.width, 1)));
  this.adjustHeight = 5
  makeSymbolParams.call(this)
  console.log('>>>>>>>>>>>');
  this.view.addSubview(utils.createDivider(NSMakeRect(0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - 15, this.modalParams.width, 1)));
  this.adjustHeight = 8
  makeMaskCheckboxParams.call(this)
  console.log('>>>>>>>>>>>');
  makeMaskRadioButtonParams.call(this)
  console.log('>>>>>>>>>>>');
  makeMaskLibraryParams.call(this, context)
  console.log('>>>>>>>>>>>');
  setEnabledColorLibraryMenu.call(this,false)
  console.log('>>>>>>>>>>>');
  setEnabledColorMenu.call(this, false)
  console.log('>>>>>>>>>>>');
  setEnabledRadioButton.call(this, false)
  console.log('>>>>>>>>>>>');
  makeMaskColorPickerParams.call(this, context)
  console.log('>>>>>>>>>>>');
  addListenerOnMaskCheckbox.call(this)

  const result = {
    button: this.modal.runModal(),
    convertSymbol: this.symbolParams.state(),
    withMask: !!this.checkboxMaskParams.state()
  }

  if (usePresets) {
    result.presets = []
    this.presets.forEach(preset => {
      if (preset.presetCheckBox.state()) {
        result.presets.push({
          artboardSize: parseInt(preset.sizeBox.stringValue()),
          iconPadding: parseInt(preset.paddingBox.stringValue())
        })
      }
    })
  } else {
    result.artboardSize = parseInt(this.artboardSize.stringValue())
    result.iconPadding = parseInt(this.artboardPadding.stringValue())
  }

  if (result.withMask && this.isLibrarySource) {
    let colorMenu = this.colorsMenuParams.selectedItem()
    result.color = (colorMenu) ? this.colorsMenuParams.representedObject() : null

    let colorLib = this.colorLibsMenuParams.selectedItem()
    result.colorLib = (colorLib) ? this.colorLibsMenuParams.representedObject() : null

    if (!result.color) result.withMask = false
  } else if (result.withMask) {
    result.colorPicker = this.colorPickerColor || MSColor.blackColor()
  }
  return result
}

function artboardModal(context) {
  this.settingsValues = settingsProvider.getSettings(context, 'placeholder')

  this.modalParams = {
    messageText: 'Configure your icons',
    informativeText: 'Your icons will be moved in artboards. Set size and padding of your artboards.',
    height: 100,
    width: 300,
    lineHeight: 35
  }

  this.coeffCurrentHeight = 0
  this.adjustHeight = 0

  constructBase()
  makeArtboardParams()

  return {
    button: this.modal.runModal(),
    artboardSize: parseInt(this.artboardSize.stringValue()),
    iconPadding: parseInt(this.artboardPadding.stringValue()),
  }
}

function constructBase(button1 = 'Continue') {

  this.modal = COSAlertWindow.new();

  this.view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, this.modalParams.width, this.modalParams.height));

  this.modal.addAccessoryView(this.view);
  this.modal.setMessageText(this.modalParams.messageText);
  this.modal.addButtonWithTitle(button1);
  this.modal.setInformativeText(this.modalParams.informativeText);
  this.modal.addButtonWithTitle('Cancel');
}

function makePresetsParams() {
  const presets = this.settingsValues.presets.data.split(',').map(preset => {
    const properties = preset.split('-')
    return {
      artboardSize: properties[0],
      padding: (properties[1]) ? properties[1] : 0
    }
  })

  this.presets = []

  const presetLabel = utils.createLabel(`Presets`, 0, this.modalParams.height - this.modalParams.lineHeight, 150, 20)
  this.view.addSubview(presetLabel)

  const sizeLabel = utils.createLabel(`Size`, 180, this.modalParams.height - this.modalParams.lineHeight, 100, 20)
  this.view.addSubview(sizeLabel)

  const paddingLabel = utils.createLabel(`Padding`, 240, this.modalParams.height - this.modalParams.lineHeight, 100, 20)
  this.view.addSubview(paddingLabel)

  this.coeffCurrentHeight++

  presets.forEach((preset) => {
    this.coeffCurrentHeight++
    makePreset.call(this, preset, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, this)
  })
}

function makeArtboardParams() {

  this.coeffCurrentHeight++

  const textBoxLabel = utils.createLabel('Artboard size', 0, this.modalParams.height - this.modalParams.lineHeight, 150, 20)
  this.view.addSubview(textBoxLabel)
  const textBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight, 50, 20));
  textBox.setStringValue(24);
  this.view.addSubview(textBox)
  const textBoxUnit = utils.createLabel('px', 205, this.modalParams.height - this.modalParams.lineHeight, 50, 20)
  this.view.addSubview(textBoxUnit)

  this.coeffCurrentHeight++

  const paddingBoxLabel = utils.createLabel('Artboard Padding', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 150, 20)
  this.view.addSubview(paddingBoxLabel)
  const paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 50, 20));
  paddingBox.setStringValue(4);
  this.view.addSubview(paddingBox)
  const paddingBoxUnit = utils.createLabel('px', 205, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight, 50, 20)
  this.view.addSubview(paddingBoxUnit)

  this.artboardPadding = paddingBox
  this.artboardSize = textBox

  this.artboardSize.setNextKeyView(this.artboardPadding)
}

function makePreset(preset, yAxis) {

  const presetCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, yAxis, 30, 20));
  presetCheckBox.setState(true);
  presetCheckBox.setButtonType(NSSwitchButton);
  presetCheckBox.setFont(NSFont.systemFontOfSize_(13));
  presetCheckBox.setTitle('')

  this.view.addSubview(presetCheckBox)

  const sizeBox = NSTextField.alloc().initWithFrame(NSMakeRect(180, yAxis, 50, 20));
  sizeBox.setStringValue(preset.artboardSize);
  this.view.addSubview(sizeBox)

  const paddingBox = NSTextField.alloc().initWithFrame(NSMakeRect(240, yAxis, 50, 20));
  paddingBox.setStringValue(preset.padding);
  this.view.addSubview(paddingBox)

  const newPreset = { sizeBox, paddingBox, presetCheckBox }

  addListenerPreset(newPreset)

  this.presets.push(newPreset)
}

function makeSymbolParams() {

  this.coeffCurrentHeight++

  const maskCheckboxLabel = utils.createLabel('Symbols', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 150, 20)
  this.view.addSubview(maskCheckboxLabel)

  const symbolCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 200, 20));
  symbolCheckBox.setButtonType(NSSwitchButton);
  symbolCheckBox.setState(true);
  symbolCheckBox.setFont(NSFont.systemFontOfSize_(13));
  symbolCheckBox.setTitle('Convert to symbol')
  this.view.addSubview(symbolCheckBox);

  this.symbolParams = symbolCheckBox
}

function makeMaskCheckboxParams() {

  this.coeffCurrentHeight++

  const maskCheckboxLabel = utils.createLabel('Mask', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 150, 20)
  this.view.addSubview(maskCheckboxLabel)

  const maskCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 200, 20));
  maskCheckBox.setButtonType(NSSwitchButton);
  maskCheckBox.setState(false);
  maskCheckBox.setFont(NSFont.systemFontOfSize_(13));
  maskCheckBox.setTitle('Add color mask')
  this.view.addSubview(maskCheckBox);

  this.checkboxMaskParams = maskCheckBox
}

function makeMaskRadioButtonParams() {

  this.coeffCurrentHeight++;
  this.coeffCurrentHeight++;

  const radioButtonLabel = utils.createLabel('Color Source', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight + 40, 150, 20)
  this.view.addSubview(radioButtonLabel)

  const buttonFormat = NSButtonCell.alloc().init();
  buttonFormat.setButtonType(NSRadioButton);
  const matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(
    NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 300, 60),
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

  this.view.addSubview(matrixFormat);

  setListenerRadioButon(cells)

  this.radioParams = matrixFormat
  this.radioButtonLabel = radioButtonLabel
}

function makeMaskLibraryParams(context) {

  this.coeffCurrentHeight++

  const colorLibsLabel = utils.createLabel('Document Source', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 150, 25)
  this.view.addSubview(colorLibsLabel)
  const colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 130, 30));

  this.coeffCurrentHeight++

  const colorMenuLabel = utils.createLabel('Color', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 150, 25)
  this.view.addSubview(colorMenuLabel)
  const colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 130, 30));

  this.view.addSubview(colorLibsMenu);
  this.view.addSubview(colorMenu);

  this.colorLibsMenuParams = colorLibsMenu
  this.colorsMenuParams = colorMenu
  this.colorLibsMenuParamsLabel = colorLibsLabel
  this.colorsMenuParamsLabel = colorMenuLabel

  colorLibsMenu.menu = libraries.initLibsSelectList.call(this, context, AppController.sharedInstance().librariesController().availableLibraries(), colorMenu);
}

function makeMaskColorPickerParams(context) {

  const colorPickerLabel = utils.createLabel('Color picker', 0, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight + 20, 150, 20)

  const pickerView = NSView.alloc().initWithFrame(NSMakeRect(150, this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight - this.adjustHeight, 130, 60));
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
    main.openPopover_onView_withWebview(pickerButton, this.view, utils.createWebview(context, pickerButton, (color) => {
      this.colorPickerColor = color
      hexLabel.setStringValue_(`#${color.immutableModelObject().hexValue()}`)
    }))
  })

  pickerView.addSubview(pickerButton)

  this.pickerView = pickerView
  this.colorPickerLabel = colorPickerLabel
}

function addListenerOnMaskCheckbox() {


  this.checkboxMaskParams.setCOSJSTargetFunction((mask) => {
    if (mask.state()) {
      setEnabledRadioButton(true)
      setEnabledColorLibraryMenu(true)
      if (this.colorsMenuParams.numberOfItems() > 0) setEnabledColorMenu(true)
    } else {
      setEnabledRadioButton(false)
      setEnabledColorLibraryMenu(false)
      setEnabledColorMenu(false)
      addLibraryColorsFields()
      removePickerButton()
      this.radioParams.cells()[0].state = true
      this.radioParams.cells()[1].state = false
    }
  });
}

function setListenerRadioButon(cells) {
  function setState(item) {
    if (String(item.selectedCells()[0].title()) === 'From Symbols') {
      addLibraryColorsFields()
      removePickerButton()
      this.isLibrarySource = true
    } else {
      removeLibraryColorsFields()
      addPickerButton()
      this.isLibrarySource = false
    }
  }

  cells[0].setCOSJSTargetFunction(setState);
  cells[1].setCOSJSTargetFunction(setState);
}

function setEnabledColorLibraryMenu(enabled) {
  const color = (enabled) ? NSColor.controlTextColor() : disabledColor
  this.colorLibsMenuParamsLabel.setTextColor(color)
  this.colorLibsMenuParams.setEnabled(enabled)

}

function setEnabledColorMenu(enabled) {
  this.colorsMenuParamsLabel.setTextColor(getStateColor(enabled))
  this.colorsMenuParams.setEnabled(enabled)
}

function setEnabledRadioButton(enabled) {
  this.radioParams.setEnabled(enabled)
  this.radioButtonLabel.setTextColor(getStateColor(enabled))
}

function removeLibraryColorsFields() {
  this.colorLibsMenuParams.removeFromSuperview()
  this.colorsMenuParams.removeFromSuperview()
  this.colorLibsMenuParamsLabel.removeFromSuperview()
  this.colorsMenuParamsLabel.removeFromSuperview()
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
  this.pickerView.removeFromSuperview()
  this.colorPickerLabel.removeFromSuperview()
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
