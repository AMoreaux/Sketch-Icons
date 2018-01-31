import {constructBase} from './modals';
import utils from '../utils/utils';
import settingsProvider from "../providers/settings";

export default settingsModal;

function settingsModal(context) {

  this.settingsValues = settingsProvider.getSettings(context)

  this.modalParams = {
    messageText: 'Configure your plugin',
    informativeText: 'Define your settings.',
    height: Object.keys(this.settingsValues).length * 38,
    width: 300,
    lineHeight: 35
  };

  this.coeffCurrentHeight = 0;
  this.adjustHeight = 0;
  this.marginLeftColRight = 175

  constructBase('save');
  // this.modal.addButtonWithTitle('Reset settings');

  makeDefaultArtboardParams();
  displayArtboardModalOnReplaceIconParams();
  displayViewBoxParams()
  convertStrokeToFillParams()
  // otherSizeChecbox()
  // otherSizeParams()
  quantityIconsByLine()
  // presets()

  return {
    button: this.modal.runModal(),
    artboardSize: parseInt(this.artboardSize.stringValue()),
    iconPadding: parseInt(this.artboardPadding.stringValue()),
    iconsByLine: parseInt(this.iconsByLine.stringValue()),
    modalReplaceIcon: this.modalReplaceIcon.state(),
    viewBoxParams: this.viewBoxParams.state(),
    convertStroke: this.convertStroke.state(),
    // otherSize: this.otherSize.state()
  };
}

function makeDefaultArtboardParams() {
  this.coeffCurrentHeight++;
  let yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight

  const textBoxLabel = utils.createLabel('Artboard size', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(textBoxLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 50, 20)
  );
  sizeBox.setStringValue(String(this.settingsValues.artboardSize));
  this.view.addSubview(sizeBox);
  const sizeBoxUnit = utils.createLabel('px', this.marginLeftColRight + 55, yAxis, 50, 20)
  this.view.addSubview(sizeBoxUnit);

  this.coeffCurrentHeight++;
  yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight

  const paddingBoxLabel = utils.createLabel('Artboard padding', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(paddingBoxLabel);
  const paddingBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 50, 20)
  );
  paddingBox.setStringValue(String(this.settingsValues.iconPadding));
  this.view.addSubview(paddingBox);
  const paddingBoxUnit = utils.createLabel('px', this.marginLeftColRight + 55, yAxis, 50, 20)
  this.view.addSubview(paddingBoxUnit);

  this.artboardPadding = paddingBox;
  this.artboardSize = sizeBox;

  this.artboardSize.setNextKeyView(this.artboardPadding);
}

function displayArtboardModalOnReplaceIconParams() {
  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight

  const modalOnReplaceIconCheckboxLabel = utils.createLabel('Replace icon', 0, yAxis, this.marginLeftColRight, 20)
  this.view.addSubview(modalOnReplaceIconCheckboxLabel);

  const modalReplaceIconCheckBox = NSButton.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 200, 20)
  );
  modalReplaceIconCheckBox.setButtonType(NSSwitchButton);
  modalReplaceIconCheckBox.setState(this.settingsValues.modalReplaceIcon);
  modalReplaceIconCheckBox.setFont(NSFont.systemFontOfSize_(13));
  modalReplaceIconCheckBox.setTitle('Retype params');
  this.view.addSubview(modalReplaceIconCheckBox);

  this.modalReplaceIcon = modalReplaceIconCheckBox;
}

function displayViewBoxParams() {
  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight

  const viewBoxCheckboxLabel = utils.createLabel('Override viewbox', 0, yAxis, this.marginLeftColRight, 20)
  this.view.addSubview(viewBoxCheckboxLabel);

  const viewBoxCheckBox = NSButton.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 200, 20)
  );
  viewBoxCheckBox.setButtonType(NSSwitchButton);
  viewBoxCheckBox.setState(this.settingsValues.viewBoxParams);
  viewBoxCheckBox.setFont(NSFont.systemFontOfSize_(13));
  viewBoxCheckBox.setTitle('Display option');
  this.view.addSubview(viewBoxCheckBox);

  this.viewBoxParams = viewBoxCheckBox;
}

function convertStrokeToFillParams() {

  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight

  const convertStrokeCheckboxLabel = utils.createLabel('Convert stroke', 0, yAxis, this.marginLeftColRight, 20)
  this.view.addSubview(convertStrokeCheckboxLabel);

  const convertStrokeCheckBox = NSButton.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 200, 20)
  );
  convertStrokeCheckBox.setButtonType(NSSwitchButton);
  convertStrokeCheckBox.setState(this.settingsValues.convertStroke);
  convertStrokeCheckBox.setFont(NSFont.systemFontOfSize_(13));
  convertStrokeCheckBox.setTitle('Convert');
  this.view.addSubview(convertStrokeCheckBox);

  this.convertStroke = convertStrokeCheckBox;
}

function otherSizeChecbox() {

  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight

  const otherSizeCheckboxLabel = utils.createLabel('Other size', 0, yAxis, this.marginLeftColRight, 20)
  this.view.addSubview(otherSizeCheckboxLabel);

  const otherSizeCheckBox = NSButton.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 4000, 20)
  );
  otherSizeCheckBox.setButtonType(NSSwitchButton);
  otherSizeCheckBox.setState(this.settingsValues.otherSize);
  otherSizeCheckBox.setFont(NSFont.systemFontOfSize_(13));
  otherSizeCheckBox.setTitle('Add second size');
  this.view.addSubview(otherSizeCheckBox);

  this.otherSize = otherSizeCheckBox;
}

function otherSizeParams(){
  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight

  const otherSizeParamsLabel = utils.createLabel('Second artboard size', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(otherSizeParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 50, 20)
  );
  sizeBox.setStringValue(String(this.settingsValues.otherSizeParams));
  this.view.addSubview(sizeBox);
  const sizeBoxUnit = utils.createLabel('px', this.marginLeftColRight + 55, yAxis, 50, 20)
  this.view.addSubview(sizeBoxUnit);

  this.otherSizeParams = sizeBox;
}


function quantityIconsByLine(){
  this.coeffCurrentHeight++;
  const yAxis = this.modalParams.height - this.modalParams.lineHeight * this.coeffCurrentHeight

  const iconByLineParamsLabel = utils.createLabel('Icons by line', 0, yAxis, this.marginLeftColRight, 20);
  this.view.addSubview(iconByLineParamsLabel);
  const sizeBox = NSTextField.alloc().initWithFrame(
    NSMakeRect(this.marginLeftColRight, yAxis, 50, 20)
  );
  sizeBox.setStringValue(String(this.settingsValues.iconsByLine));
  this.view.addSubview(sizeBox);
  const sizeBoxUnit = utils.createLabel('icons', this.marginLeftColRight + 55, yAxis, 50, 20)
  this.view.addSubview(sizeBoxUnit);

  this.iconsByLine = sizeBox;
}

function presets() {

}