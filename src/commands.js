import logger from './utils/logger';
import utils from './utils/utils';
import artboardProvider from './providers/artboard';
import maskProvider from './providers/mask';
import modals from './utils/modals';
import files from './providers/files';
import svg from './providers/svg';
import {importModal, maskModal} from './modals/modals';

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
  try {
    const selectedArtboardsAndSymbols = utils.getSelectedArtboardsAndSymbols(context);
    if (selectedArtboardsAndSymbols.length === 0) return modals.newErrorModal('No artboards selected', 'Please select one or more artboards to replace icons.')
    const listIcon = files.selectIconsFiles()
    if (!listIcon.length) return
    if (selectedArtboardsAndSymbols.length > listIcon.length) return modals.newErrorModal('Too much artboards selected', 'Please select as many artboards as icons.')
    if (selectedArtboardsAndSymbols.length < listIcon.length) return modals.newErrorModal('Too much icons selected', 'Please select as many icons as artboards.')
    svg.initUpdateIconsSelectedArtboards(context, selectedArtboardsAndSymbols, listIcon)
  } catch (e) {
    console.log('>>>>>>>>>>>', e);
  }
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
 * @name updateMaskOnSelectedArtboards
 * @description trigger to start feature to update mask
 * @param context
 */
export function updateMaskOnSelectedArtboards(context) {
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
    maskProvider.removeMask(rootElement.object)
  })
}