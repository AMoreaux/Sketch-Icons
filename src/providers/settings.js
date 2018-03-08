export default {
  registerSettings,
  getSettings,
  resetSettings,
  hasValue
}

const LIST_SETTINGS_FIELDS = [
  // {name: 'artboardSize', defaultValue: 24},
  // {name: 'iconPadding', defaultValue: 4},
  { name: 'presets', default: '', placeholder: '24-4, 48-8...' },
  // {name: 'modalReplaceIcon', defaultValue: false},
  // {name: 'viewBoxParams', defaultValue: false},

  { name: 'convertStroke', default: '0', placeholder:'0' },
  // {name: 'otherSize', defaultValue: true},
  // {name: 'otherSizeParams', defaultValue: 48},
  { name: 'iconsByLine', default: '10', placeholder: '10' },
  { name: 'marginBetweenRootObject', default: '100%', placeholder: '100%' },
  { name: 'prefixRootObject', default: '', placeholder: 'icons/$size/...' },
  // {name: 'preset', defaultValue: []}
]

function registerSettings(context, params) {
  if (params.button === 1002) {
    resetSettings(context)
    return NSApp.delegate().runPluginCommandWithIdentifier_fromBundleAtURL_context_('settings.sketch.icons', context.plugin.url(), context);
  }

  LIST_SETTINGS_FIELDS.forEach((field) => {
    context.command.setValue_forKey_onDocument(params[field.name], field.name, context.document.documentData());
  })
}


function resetSettings(context) {
  LIST_SETTINGS_FIELDS.forEach((field) => {
    context.command.setValue_forKey_onDocument(null, field.name, context.document.documentData());
  })
}

function getSettings(context, fallbackValue) {

  const result = {}

  LIST_SETTINGS_FIELDS.forEach(field => {

    result[field.name] = {
      'value': context.command.valueForKey_onDocument(field.name, context.document.documentData()),
      'default': field.default,
      'placeholder': field.placeholder
    };

    if (hasValue(result[field.name])) {
      result[field.name].data = String(result[field.name].value)
    } else {
      result[field.name].data = String(result[field.name][fallbackValue])
    }
  })


  return result
}

function hasValue(setting){
  return !(!setting.value || String(setting.value) === 'null' || String(setting.value).length === 0)
}
