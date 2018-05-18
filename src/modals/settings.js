import { constructBase } from './modals';
import utils from '../utils/utils';
import settingsProvider from "../providers/settings";

export default settingsModal;

function settingsModal(context) {


  this.settingsValues = settingsProvider.getSettings(context, 'placeholder')

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

  constructBase.call(this, 'Save');

  makePresetParams.call(this);
  prefixRootObjectParams.call(this)
  quantityIconsByLine.call(this)
  marginBetweenRootObject.call(this)
  convertStrokeToFillParams.call(this)

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
  let yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + this.adjust

  const textBoxLabel = utils.createLabel('Size Presets', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(textBoxLabel);

  const presetsBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 145, 21)
  );

  if (settingsProvider.hasValue(this.settingsValues.presets)) {
    presetsBox.setStringValue(String(this.settingsValues.presets.value));
  } else {
    presetsBox.setPlaceholderString(String(this.settingsValues.presets.placeholder));
  }

  this.view.addSubview(presetsBox);

  this.coeffCurrentHeight++;
  addDescription.call(this, 'Set your artboard sizes and padding.', this.lineOne)
  addDescription.call(this, 'Format: size-padding', this.lineTwo)

  this.presets = presetsBox

}

function convertStrokeToFillParams() {

  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + 30

  const convertStrokeCheckboxLabel = utils.createLabel('Stroke to Fill', 0, yAxis, this.marginLeftColRight, 20)
  this.view.addSubview(convertStrokeCheckboxLabel);

  const convertStrokeCheckBox = NSButton.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 200, 21)
  );
  convertStrokeCheckBox.setButtonType(NSSwitchButton);
  convertStrokeCheckBox.setState(parseInt(this.settingsValues.convertStroke.data));
  convertStrokeCheckBox.setFont(NSFont.systemFontOfSize_(13));
  convertStrokeCheckBox.setTitle('Auto-Convert');
  this.view.addSubview(convertStrokeCheckBox);

  this.coeffCurrentHeight++;
  addDescription.call(this, 'this will allow you to add a dynamic color mask ', this.lineOne + 30)
  addDescription.call(this, 'over your outlined icons.', this.lineTwo + 30)

  this.convertStroke = convertStrokeCheckBox;
}

function quantityIconsByLine() {
  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + this.adjust

  const iconByLineParamsLabel = utils.createLabel('Icons Grid', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(iconByLineParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 50, 21)
  );

  if (String(this.settingsValues.iconsByLine.value) === 'null') {
    sizeBox.setPlaceholderString('10')
  } else {
    sizeBox.setStringValue(String(this.settingsValues.iconsByLine.value));
  }

  this.view.addSubview(sizeBox);
  const sizeBoxUnit = utils.createLabel('icons per row', this.marginLeftColRight + 55, yAxis, 100, 20)
  this.view.addSubview(sizeBoxUnit);

  this.coeffCurrentHeight++;
  addDescription.call(this,'Set the number of imported icons per row.', this.lineOne)
  // addDescription('Format: size-padding', this.lineTwo)

  this.iconsByLine = sizeBox;
}

function marginBetweenRootObject() {
  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + 15

  const marginBetweenRootObjectParamsLabel = utils.createLabel('Spacing', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(marginBetweenRootObjectParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 50, 21)
  );

  if (settingsProvider.hasValue(this.settingsValues.marginBetweenRootObject)) {
    sizeBox.setStringValue(String(this.settingsValues.marginBetweenRootObject.value));
  } else {
    sizeBox.setPlaceholderString(String(this.settingsValues.marginBetweenRootObject.placeholder));
  }

  this.view.addSubview(sizeBox);
  const sizeBoxUnit = utils.createLabel('px or %', this.marginLeftColRight + 55, yAxis, 100, 20)
  this.view.addSubview(sizeBoxUnit);

  this.coeffCurrentHeight++;
  addDescription.call(this,'Set the spacing between the imported icons.', this.lineOne + 15)
  // addDescription('Format: size-padding', this.lineTwo)

  this.marginBetweenRootObject = sizeBox;
}

function prefixRootObjectParams() {
  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + this.adjust

  const prefixRootObjectParamsLabel = utils.createLabel('Add Prefix ', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(prefixRootObjectParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 145, 21)
  );

  if (settingsProvider.hasValue(this.settingsValues.prefixRootObject)) {
    sizeBox.setStringValue(String(this.settingsValues.prefixRootObject.value));
  } else {
    sizeBox.setPlaceholderString(String(this.settingsValues.prefixRootObject.placeholder));
  }

  this.view.addSubview(sizeBox);

  this.coeffCurrentHeight++;
  addDescription.call(this, 'Add a path structure to the name of yours icons.', this.lineOne)
  addDescription.call(this, '$size is equal to the size of the artboard.', this.lineTwo)

  this.prefixRootObject = sizeBox;
}


function addDescription(text, ajust) {

  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight + ajust

  const descriptionLabel = utils.createLabel(text, 0, yAxis, 400, 20, true);

  this.view.addSubview(descriptionLabel);
}
