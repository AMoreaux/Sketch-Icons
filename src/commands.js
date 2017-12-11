
import logger from './utils/logger';
import utils from './utils/utils';
import libraries from './providers/libraries';
import artboardProvider from './providers/artboard';
import maskProvider from './providers/mask';
import modals from './utils/modals';
import files from './providers/files';
import svg from './providers/svg';
import importIconsModal from './modals/importIcons';


/**
 * @name importIcons
 * @description trigger to start feature to import icons
 * @param context
 */
export function importIcons(context) {
  const params = importIconsModal.getImportIconsParams(context)
  if (params.button !== 1000) return
  params.listIcon = files.selectIconsFiles()
  if(!params.listIcon.length) return
  artboardProvider.initImportIcons(context, params)
}

/**
 * @name updateIconsOnSelectedArtboards
 * @description trigger to start feature to update icon
 * @param context
 */
export function updateIconsOnSelectedArtboards(context) {
  const selectedArtboardsAndSymbols = utils.getSelectedArtboardsAndSymbols(context);
    if(selectedArtboardsAndSymbols.length === 0)return modals.newErrorModal('No artboards selected', 'Please select one or more artboards to replace icons.')
    const listIcon = files.selectIconsFiles()
    if(!listIcon.length) return
    if(selectedArtboardsAndSymbols.length > listIcon.length)return modals.newErrorModal('Too much artboards selected', 'Please select as many artboards as icons.')
    if(selectedArtboardsAndSymbols.length < listIcon.length)return modals.newErrorModal('Too much icons selected', 'Please select as many icons as artboards.')
    svg.initUpdateIconsSelectedArtboards(context, selectedArtboardsAndSymbols, listIcon)
}

/**
 * @name addMaskOnSelectedArtboards
 * @description trigger to start feature to add mask
 * @param context
 */
export function addMaskOnSelectedArtboards(context) {
    const selectedArtboardsAndSymbols =utils.getSelectedArtboardsAndSymbols(context);
    if(selectedArtboardsAndSymbols.length === 0)return modals.newErrorModal('No artboards selected', 'Please select one or more artboards to add a mask.')
    const params = importIconsModal.getAddMaskOnSelectedArtboardsParams(context)
    if (params.button !== 1000) return
    maskProvider.initAddMaskOnSelectedArtboards(context, params, selectedArtboardsAndSymbols)
}