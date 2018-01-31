export default {
  registerSettings,
  getSettings
}

const LIST_SETTINGS_FIELDS = [
  {name: 'artboardSize', defaultValue: 24},
  {name: 'iconPadding', defaultValue: 4},
  {name: 'modalReplaceIcon', defaultValue: false},
  {name: 'viewBoxParams', defaultValue: false},

  {name: 'convertStroke', defaultValue: true},
  // {name: 'otherSize', defaultValue: true},
  // {name: 'otherSizeParams', defaultValue: 48},
  {name: 'iconsByLine', defaultValue: 10},
  // {name: 'preset', defaultValue: []}
]

function registerSettings(context, params) {
  if(params.button === 1002){
    resetSettings(context)
    return NSApp.delegate().runPluginCommandWithIdentifier_fromBundleAtURL_context_('settings.sketch.icons', context.plugin.url(), context);
  }

  LIST_SETTINGS_FIELDS.forEach((field) => {
    console.log('>>>>>>>>>>>', field.name, params[field.name]);
    context.command.setValue_forKey_onDocument(params[field.name], field.name, context.document.documentData());
  })
}


function resetSettings(context) {
  LIST_SETTINGS_FIELDS.forEach((field) => {
    context.command.setValue_forKey_onDocument(null, field.name, context.document.documentData());
  })
}

function getSettings(context){

  const result = {}

  LIST_SETTINGS_FIELDS.forEach(field => {
    result[field.name] = context.command.valueForKey_onDocument( field.name, context.document.documentData()) || field.defaultValue
    if(typeof field.defaultValue === 'boolean') result[field.name] = (String(result[field.name]) === '1')
  })

  return result
}