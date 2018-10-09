import utils from './utils/utils';
import artboardProvider from './providers/artboard';
import maskProvider from './providers/mask';
import modals from './utils/modals';
import files from './providers/files';
import svg from './providers/svg';
import { importModal, maskModal } from './modals/modals';
import settingsModal from './modals/settings';
import settingsProvider from './providers/settings'
import analytics from './utils/analytics'

/**
 * @name importIcons
 * @description trigger to start feature to import icons
 * @param context
 */
export function importIcons(context) {
  utils.runFramework(context)
  const params = importModal.call({}, context)
  if (params.button !== 1000) return
  params.listIcon = files.selectIconsFiles()
  if (!params.listIcon.length) return
  const importedIcons = artboardProvider.initImport(context, params, artboardProvider.initImportIcons)
  const label = (params.withColor) ? 'import-mask' : 'import';
  analytics.action(context, 'icons', 'import', label, importedIcons)
}

/**
 * @name updateIconsOnSelectedArtboards
 * @description trigger to start feature to update icon
 * @param context
 */
export function updateIconsOnSelectedArtboards(context) {
  const selectedArtboardsAndSymbols = utils.getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return modals.newErrorModal('No artboards selected', 'Please select one or more artboards to replace icons.')
  let params = {}
  params.listIcon = files.selectIconsFiles()
  if (!params.listIcon.length) return
  if (selectedArtboardsAndSymbols.length > params.listIcon.length && params.listIcon.length !== 1) return modals.newErrorModal('Too much artboards selected', 'Please select as many artboards as icons.')
  if (selectedArtboardsAndSymbols.length < params.listIcon.length && params.listIcon.length !== 1) return modals.newErrorModal('Too much icons selected', 'Please select as many icons as artboards.')
  const replacedIcons = svg.initUpdateIconsSelectedArtboards(context, selectedArtboardsAndSymbols, params)
  analytics.action(context, 'icons', 'replace', 'replace', replacedIcons)
}

/**
 * @name organizeIcons
 * @param context
 */
export function organizeIcons(context) {
  const selectedLayers = context.selection;
  if (selectedLayers.length === 0) return modals.newErrorModal('No layers selected', 'Please select one or more layers.')
  utils.runFramework(context)
  const params = importModal.call({}, context)
  if (params.button !== 1000) return
  params.listIcon = selectedLayers
  artboardProvider.initImport(context, params, artboardProvider.initOrganizeIcons)
  params.listIcon.forEach(icon => icon.removeFromParent())
  const label = (params.withColor) ? 'organize-mask' : 'organize';
  analytics.action(context, 'icons', 'organize', label, params.listIcon.length)
}

/**
 * @name addMaskOnSelectedArtboards
 * @description trigger to start feature to add mask
 * @param context
 */
export function addMaskOnSelectedArtboards(context) {
  utils.runFramework(context)
  const selectedArtboardsAndSymbols = utils.getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return modals.newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.')
  const params = maskModal.call({}, context)
  if (params.button !== 1000) return
  maskProvider.initAddMaskOnSelectedArtboards(context, params, selectedArtboardsAndSymbols)
  analytics.action(context, 'icons', 'mask', 'mask', selectedArtboardsAndSymbols.length)
}

/**
 * @name removeMaskOnSelectedArtboards
 * @description remove masks layer
 * @param context
 */
export function removeMaskOnSelectedArtboards(context) {
  const selectedArtboardsAndSymbols = utils.getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return modals.newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.')
  selectedArtboardsAndSymbols.forEach((rootElement) => {
    maskProvider.removeColor(context, rootElement.object)
  })
  analytics.action(context, 'icons', 'remove mask', 'remove mask', selectedArtboardsAndSymbols.length)
}

/**
 * @name setSettings
 * @description set settings
 * @param context
 */
export function setSettings(context) {
  const params = settingsModal.call({}, context)
  if (params.button === 1001) return
  settingsProvider.registerSettings(context, params)
  analytics.action(context, 'settings', 'settings', 'settings')
}
