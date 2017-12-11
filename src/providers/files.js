export default {
  selectIconsFiles,
  getFilesByUrls
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
  panel.setAllowedFileTypes(NSArray.arrayWithObjects("svg"))
  panel.setCanChooseFiles(true);
  panel.setPrompt("Select")

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
    if (path.toString().split('.').pop() === 'svg') {
      return path
    } else {
      return NSFileManager.defaultManager().contentsOfDirectoryAtURL_includingPropertiesForKeys_options_error(path, null, null, null).slice().filter(function (path) {
        if (path.toString().split('.').pop() === 'svg') {
          return true
        }
      })
    }
  }))
}