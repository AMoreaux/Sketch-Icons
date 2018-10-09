export default {
  applySharedStyle,
}

function applySharedStyle(context, rootObject, params) {
  const foreignStyle = getSharedStyleFromLib(context, params.color, params.colorLib);
  rootObject.children()[1].sharedStyle = foreignStyle ? foreignStyle.localSharedStyle() : params.color;
}



function getSharedStyleFromLib(context, sharedStyle, originLibrary) {
  const librairiesController = AppController.sharedInstance().librariesController()
  const shareableObjectReference = MSShareableObjectReference.referenceForShareableObject_inLibrary(sharedStyle, originLibrary);
  return librairiesController.importShareableObjectReference_intoDocument(shareableObjectReference, context.document.documentData());
}
