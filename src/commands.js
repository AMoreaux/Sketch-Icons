import logger from './utils/logger';
import utils from './utils/utils';
import artboardProvider from './providers/artboard';
import maskProvider from './providers/mask';
import modals from './utils/modals';
import files from './providers/files';
import svg from './providers/svg';
import {importModal, maskModal, artboardModal} from './modals/modals';
import settingsModal from './modals/settings';
import settingsProvider from './providers/settings'

/**
 * @name importIcons
 * @description trigger to start feature to import icons
 * @param context
 */
export function importIcons(context) {
  utils.runFramework(context)
  const params = importModal(context)
  if (params.button !== 1000) return
  params.listIcon = files.selectIconsFiles()
  if (!params.listIcon.length) return
  artboardProvider.initImportIcons(context, params)
}

/**
 * @name updateIconsOnSelectedArtboards
 * @description trigger to start feature to update icon
 * @param context
 */
export function updateIconsOnSelectedArtboards(context) {
  const selectedArtboardsAndSymbols = utils.getSelectedArtboardsAndSymbols(context);
  if (selectedArtboardsAndSymbols.length === 0) return modals.newErrorModal('No artboards selected', 'Please select one or more artboards to replace icons.')
  const settings = settingsProvider.getSettings(context)
  let params = {}
  if(settings.modalReplaceIcon){
    params = artboardModal(context)
    if (params.button !== 1000) return
  }
  params.listIcon = files.selectIconsFiles()
  if (!params.listIcon.length) return
  if (selectedArtboardsAndSymbols.length > params.listIcon.length) return modals.newErrorModal('Too much artboards selected', 'Please select as many artboards as icons.')
  if (selectedArtboardsAndSymbols.length < params.listIcon.length) return modals.newErrorModal('Too much icons selected', 'Please select as many icons as artboards.')
  svg.initUpdateIconsSelectedArtboards(context, selectedArtboardsAndSymbols, params)
}

export function organizeIcons(context) {
  const selectedLayers = context.selection;
  if (selectedLayers.length === 0) return modals.newErrorModal('No layers selected', 'Please select one or more layers.')
  utils.runFramework(context)
  const params = importModal(context)
  if (params.button !== 1000) return
  params.listIcon = selectedLayers
  artboardProvider.initOrganizeIcons(context, params)
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
  const params = maskModal(context)
  if (params.button !== 1000) return
  maskProvider.initAddMaskOnSelectedArtboards(context, params, selectedArtboardsAndSymbols)
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
    maskProvider.removeMask(context, rootElement.object)
  })
}

/**
 * @name setSettings
 * @description set settings
 * @param context
 */
export function setSettings(context) {
  const params = settingsModal(context)
  if (params.button === 1001) return
  settingsProvider.registerSettings(context, params)
}