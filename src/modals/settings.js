import { constructBase } from './modals';
import utils from '../utils/utils';
import settingsProvider from "../providers/settings";

export default settingsModal;

function settingsModal(context) {

  let global = {};

  global.settingsValues = settingsProvider.getSettings(context, 'placeholder')

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

  constructBase('Save', global);

  makePresetParams(global);
  prefixRootObjectParams(global)
  quantityIconsByLine(global)
  marginBetweenRootObject(global)
  convertStrokeToFillParams(global)

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
  let yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + global.adjust

  const textBoxLabel = utils.createLabel('Size Presets', 0, yAxis, global.marginLeftColRight, 20);
  global.view.addSubview(textBoxLabel);

  const presetsBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(global.marginLeftColRight, yAxis, 145, 21)
  );

  if (settingsProvider.hasValue(global.settingsValues.presets)) {
    presetsBox.setStringValue(String(global.settingsValues.presets.value));
  } else {
    presetsBox.setPlaceholderString(String(global.settingsValues.presets.placeholder));
  }

  global.view.addSubview(presetsBox);

  global.coeffCurrentHeight++;
  addDescription('Set your artboard sizes and padding.', global.lineOne, global)
  addDescription('Format: size-padding', global.lineTwo, global)

  global.presets = presetsBox

}

function convertStrokeToFillParams(global) {

  global.coeffCurrentHeight++;
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + 30

  const convertStrokeCheckboxLabel = utils.createLabel('Stroke to Fill', 0, yAxis, global.marginLeftColRight, 20)
  global.view.addSubview(convertStrokeCheckboxLabel);

  const convertStrokeCheckBox = NSButton.alloc().initWithFrame(
    NSMakeRect(global.marginLeftColRight, yAxis, 200, 21)
  );
  convertStrokeCheckBox.setButtonType(NSSwitchButton);
  convertStrokeCheckBox.setState(parseInt(global.settingsValues.convertStroke.data));
  convertStrokeCheckBox.setFont(NSFont.systemFontOfSize_(13));
  convertStrokeCheckBox.setTitle('Auto-Convert');
  global.view.addSubview(convertStrokeCheckBox);

  global.coeffCurrentHeight++;
  addDescription('global will allow you to add a dynamic color mask ', global.lineOne + 30, global)
  addDescription('over your outlined icons.', global.lineTwo + 30, global)

  global.convertStroke = convertStrokeCheckBox;
}

function quantityIconsByLine(global) {
  global.coeffCurrentHeight++;
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + global.adjust

  const iconByLineParamsLabel = utils.createLabel('Icons Grid', 0, yAxis, global.marginLeftColRight, 20);
  global.view.addSubview(iconByLineParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(global.marginLeftColRight, yAxis, 50, 21)
  );

  if (String(global.settingsValues.iconsByLine.value) === 'null') {
    sizeBox.setPlaceholderString('10')
  } else {
    sizeBox.setStringValue(String(global.settingsValues.iconsByLine.value));
  }

  global.view.addSubview(sizeBox);
  const sizeBoxUnit = utils.createLabel('icons per row', global.marginLeftColRight + 55, yAxis, 100, 20)
  global.view.addSubview(sizeBoxUnit);

  global.coeffCurrentHeight++;
  addDescription('Set the number of imported icons per row.', global.lineOne, global)
  // addDescription('Format: size-padding', global.lineTwo)

  global.iconsByLine = sizeBox;
}

function marginBetweenRootObject(global) {
  global.coeffCurrentHeight++;
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + 15

  const marginBetweenRootObjectParamsLabel = utils.createLabel('Spacing', 0, yAxis, global.marginLeftColRight, 20);
  global.view.addSubview(marginBetweenRootObjectParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(global.marginLeftColRight, yAxis, 50, 21)
  );

  if (settingsProvider.hasValue(global.settingsValues.marginBetweenRootObject)) {
    sizeBox.setStringValue(String(global.settingsValues.marginBetweenRootObject.value));
  } else {
    sizeBox.setPlaceholderString(String(global.settingsValues.marginBetweenRootObject.placeholder));
  }

  global.view.addSubview(sizeBox);
  const sizeBoxUnit = utils.createLabel('px or %', global.marginLeftColRight + 55, yAxis, 100, 20)
  global.view.addSubview(sizeBoxUnit);

  global.coeffCurrentHeight++;
  addDescription('Set the spacing between the imported icons.', global.lineOne + 15, global)
  // addDescription('Format: size-padding', global.lineTwo)

  global.marginBetweenRootObject = sizeBox;
}

function prefixRootObjectParams(global) {
  global.coeffCurrentHeight++;
  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + global.adjust

  const prefixRootObjectParamsLabel = utils.createLabel('Add Prefix ', 0, yAxis, global.marginLeftColRight, 20);
  global.view.addSubview(prefixRootObjectParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(global.marginLeftColRight, yAxis, 145, 21)
  );

  if (settingsProvider.hasValue(global.settingsValues.prefixRootObject)) {
    sizeBox.setStringValue(String(global.settingsValues.prefixRootObject.value));
  } else {
    sizeBox.setPlaceholderString(String(global.settingsValues.prefixRootObject.placeholder));
  }

  global.view.addSubview(sizeBox);

  global.coeffCurrentHeight++;
  addDescription('Add a path structure to the name of yours icons.', global.lineOne, global)
  addDescription('$size is equal to the size of the artboard.', global.lineTwo, global)

  global.prefixRootObject = sizeBox;
}


function addDescription(text, ajust, global) {

  const yAxis = global.modalParams.height - global.modalParams.lineHeight * global.coeffCurrentHeight + ajust

  const descriptionLabel = utils.createLabel(text, 0, yAxis, 400, 20, true);

  global.view.addSubview(descriptionLabel);
}
