import logger from '../utils/logger'

export default {
  selectIconsFiles,
  getFilesByUrls
}

const AVAILABLE_EXT = ["svg", "pdf", "png", "jpg", "jpeg"]

/**
 * @name selectIconsFiles
 * @description display modal selection file and return them
 * @returns {Array}
 */
function selectIconsFiles() {

  const panel = NSOpenPanel.openPanel();
  panel.setAllowsMultipleSelection(true);
  panel.setCanChooseDirectories(true);
  panel.setAllowedFileTypes(AVAILABLE_EXT);
  panel.setCanChooseFiles(true);
  panel.setPrompt("Select");

  if (panel.runModal() !== NSFileHandlingPanelOKButton) return []

  const result = []

  getFilesByUrls(panel.URLs(), result)

  return result
}

/**
 * @name getFilesByUrls
 * @description get file from list of folder and path
 * @param urls {Array}
 * @param result {Array}
 * @returns {Array}
 */
function getFilesByUrls(urls, result) {

  for(let i = 0; i < urls.length; i++){
    if(!!(urls[i].hasDirectoryPath())){
      getFilesByUrls(NSFileManager.defaultManager().contentsOfDirectoryAtURL_includingPropertiesForKeys_options_error(urls[i], null, null, null), result)
    }else{
      const ext = String(urls[i].pathExtension()).toLowerCase()
      if (AVAILABLE_EXT.indexOf(ext) !== -1){
        result.push(urls[i])
      }
    }
  }
}
