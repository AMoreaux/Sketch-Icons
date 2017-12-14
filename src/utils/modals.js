import libraries from '../providers/libraries'
import utils from '../utils/utils'

export default {
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
}

/**
 * @name newModal
 * @description instantiate modal
 * @param context
 * @param viewSize {Object}
 * @param modalParams
 * @returns {{modal: *, view: *, viewSize: *}}
 */
function newModal(context, viewSize, modalParams) {

  const modal = COSAlertWindow.new();

  // modal.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("model1.jpg").path()));

  const view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewSize.width, viewSize.height));
  modal.addAccessoryView(view);
  modal.setMessageText(modalParams.messageText);
  modal.setInformativeText(modalParams.informativeText);
  modal.addButtonWithTitle('Continue');
  modal.addButtonWithTitle('Cancel');
  modal.layout()

  return {modal, view, viewSize}
}

/**
 * @name runModal
 * @description run modal
 * @param modal
 * @returns {Object} : NSView
 */
function runModal({modal}) {
  return modal.runModal()
}

/**
 * @name getMainButtonParam
 * @description get value of main button of view
 * @param button
 * @returns {Object}
 */
function getMainButtonParam(button) {
  return {button}
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
      return parseInt(textBox.stringValue())
    },
    name: 'artboardSize',
    label: utils.createLabel('Size', 0, 30, 130, 20)
  }, {
    item: textBoxPadding,
    getter: function () {
      return parseInt(textBoxPadding.stringValue())
    },
    name: 'iconPadding',
    label: utils.createLabel('Padding', 140, 30, 130, 20)
  }]
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
  symbolCheckBox.setTitle('Convert to symbol')

  const maskCheckBox = NSButton.alloc().initWithFrame(NSMakeRect(0, 5, 200, 14));
  maskCheckBox.setButtonType(NSSwitchButton);
  maskCheckBox.setState(false);
  maskCheckBox.setFont(NSFont.systemFontOfSize_(13));
  maskCheckBox.setTitle('Add color mask')

  return [{
    item: symbolCheckBox,
    name: 'convertSymbol',
    getter: symbolCheckBox.state
  }, {
    item: maskCheckBox,
    name: 'withMask',
    getter: maskCheckBox.state
  }]
}


/**
 * @name createMaskFields
 * @description create fields for mask params to add mask
 * @param checkboxFields {Object}
 * @returns {[null,null]}
 */
function createMaskFields(checkboxFields, context) {

  const colorLibsMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 120, 20));
  const colorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(140, 0, 50, 20));
  const documentColorMenu = NSPopUpButton.alloc().initWithFrame(NSMakeRect(200, 0, 50, 20));

  colorLibsMenu.setEnabled(false)
  colorMenu.setEnabled(false)
  documentColorMenu.setEnabled(false)

  colorLibsMenu.menu = libraries.initLibsSelectList(libraries.getLibs(), colorMenu);
  libraries.initColorSelectList(documentColorMenu, utils.getDocumentColors(context))

  if (checkboxFields) {
    checkboxFields[1].item.setCOSJSTargetFunction(function (mask) {
      if (mask.state()) {
        colorLibsMenu.setEnabled(true)
        documentColorMenu.setEnabled(true)
        if (colorMenu.selectedItem()) colorMenu.setEnabled(true)
      } else {
        colorLibsMenu.setEnabled(false)
        colorMenu.setEnabled(false)
        documentColorMenu.setEnabled(false)
      }
    });
  } else {
    colorLibsMenu.setEnabled(true)
  }

  return [{
    item: colorMenu,
    label: utils.createLabel('Color', 140, 25, 130, 20),
    name: 'color',
    getter: function () {
      let currentItem = this.item.selectedItem()
      return (currentItem) ? currentItem.representedObject() : null
    }
  }, {
    item: colorLibsMenu,
    label: utils.createLabel('Colors Library', 0, 25, 130, 20),
    name: 'colorLib',
    getter: function () {
      let currentItem = this.item.selectedItem()
      return (currentItem) ? currentItem.representedObject() : null
    }
  }, {
    item: documentColorMenu,
    label: utils.createLabel('Document Color', 200, 25, 130, 20),
    name: 'colorDoc',
    getter: function () {
      let currentItem = this.item.selectedItem()
      return (currentItem) ? currentItem.representedObject() : null
    }
  }]
}

/**
 * @name appendsFields
 * @description append fields on view to create modal
 * @param view {Object} : NSView
 * @param viewSize {Object} :
 * @param allFields
 */
function appendsFields({view, viewSize}, allFields) {
  allFields.reverse().forEach(function (fields) {
    const viewCell = NSView.alloc().initWithFrame(NSMakeRect(0, view.subviews().length * 50, viewSize.width, 50));
    fields.forEach(function (field) {
      if (field.label) viewCell.addSubview(field.label);
      viewCell.addSubview(field.item);
    })
    view.addSubview(viewCell)
  })
}

/**
 * @name getParams
 * @description get value of multiple fields
 * @param allFields [Array,Array,...]
 * @returns {Object}
 */
function getParams(allFields) {
  const result = {}
  allFields.forEach(function (fields) {
    fields.forEach(function (field) {
      result[field.name] = field.getter()
    })
  })

  return result
}

/**
 * @name setNextKey
 * @description set tab path in form
 * @param fields
 */
function setNextKey(fields) {
  fields.forEach((field, index) => {
    if (fields[index + 1]) field.item.setNextKeyView(fields[index + 1].item)
  })
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
  modal.runModal()
}