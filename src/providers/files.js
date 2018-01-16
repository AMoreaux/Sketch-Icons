import logger from '../utils/logger'

export default {
  selectIconsFiles
}

/**
 * @name selectIconsFiles
 * @description display modal selection file and return them
 * @returns {Array.NSFile}
 */
function selectIconsFiles() {

  const panel = NSOpenPanel.openPanel();
  panel.setAllowsMultipleSelection(true);
  panel.setCanChooseDirectories(true);
  panel.setAllowedFileTypes(["svg", "pdf"]);
  panel.setCanChooseFiles(true);
  panel.setPrompt("Select");

  if (panel.runModal() !== NSFileHandlingPanelOKButton) return []

  return getFilesByUrls(panel.URLs())
}

/**
 * @name getFilesByUrls
 * @description get file from list of folder and path
 * @param urls {Array.NSurl}
 * @returns {Array.NSFile}
 */
function getFilesByUrls(urls) {
  return [].concat(...urls.slice().map(function (path) {
    let ext = path.toString().split('.').pop()
    if (ext === 'svg' || ext === 'pdf') {
      return path
    } else {
      return NSFileManager.defaultManager().contentsOfDirectoryAtURL_includingPropertiesForKeys_options_error(path, null, null, null).slice().filter(function (path) {
        let ext = path.toString().split('.').pop()
        if (ext === 'svg' || ext === 'pdf') {
          return true
        }
      })
    }
  }))
}