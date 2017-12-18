export default {
  clearSelection,
  getIconNameByNSUrl,
  createLabel,
  getSelectedArtboardsAndSymbols,
  flatten,
  getDocumentColors,
  createWebview
}

/**
 * @name clearSelection
 * @description unselect all
 * @param context
 */
function clearSelection(context) {
  context.api().selectedDocument.selectedLayers.clear()
}

/**
 * @name getIconNameByNSUrl
 * @description get name of icon by NSUrl
 * @param icon {Object} : NSUrl
 * @returns {String}
 */
function getIconNameByNSUrl(icon){
  return icon.lastPathComponent().split('.')[0]
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
function createLabel(name, x, y, w, h, fontSize = 13) {

  const label = NSTextField.alloc().initWithFrame_(NSMakeRect(x, y, w, h));
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
  const selectedArtboardsAndSymbols = []

  context.selection.forEach(function (layer) {
      let className = String(layer.class())
      if (className !== 'MSArtboardGroup' || className !== 'MSSymbolMaster') {
        layer = layer.parentRoot()
        className = String(layer.class())
      }

      selectedArtboardsAndSymbols.push({
        'object': layer,
        'type': className
      })

  })

  return selectedArtboardsAndSymbols
}

/**
 * @name flatten
 * @description flatten array
 * @param list
 * @return {Array}
 */
function flatten(list){
  return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

/**
 * @name getDocumentColors
 * @param context
 * @return {Array}
 */
function getDocumentColors(context){
  return context.document.documentData().assets().colors()
}

/**
 * @name createWebview
 * @param context
 * @param handlers
 * @param title
 * @param height
 * @return {WebUI}
 */
function createWebview(context, handlers = null, title = null, height = 300) {
  const v = 242 / 255
  const grayColor = NSColor.colorWithRed_green_blue_alpha(v, v, v, 1)
  let options = {
    identifier: 'unique.id',
    x: 0,
    y: 0,
    width: 630,
    height: height,
    background: grayColor,
    blurredBackground: false,
    onlyShowCloseButton: false,
    title: title,
    hideTitleBar: false,
    shouldKeepAround: true,
    resizable: false,
    // handlers: handlers,
  }
  return new WebUI(context, 'index.html', options)
}