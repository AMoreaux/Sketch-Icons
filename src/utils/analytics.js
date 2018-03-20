const kUUIDKey = 'google.analytics.uuid'
let uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey)
if (!uuid) {
  uuid = NSUUID.UUID().UUIDString()
  NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey)
}

function jsonToQueryString(json) {
  return '?' + Object.keys(json).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
  }).join('&')
}

export default {
  action
}

function action(context, category, action, label, value) {
  const payload = {
    v: 1,
    t: 'event',
    cid: uuid,
    tid: 'UA-115448236-1',
    ec: category,
    ea: action,
    el: label,
    ev: value
  }
  send(payload)
}

function send(payload) {

  try{
    const url = NSURL.URLWithString(
      NSString.stringWithFormat("https://www.google-analytics.com/collect%@", jsonToQueryString(payload))
    )

    if (url) {
      const task = NSTask.alloc().init();
      task.setLaunchPath("/usr/bin/curl");
      task.setArguments(['-X', 'POST', String(url)]);
      const outputPipe = NSPipe.pipe();
      task.setStandardOutput(outputPipe);
      task.launch();
    }

  }catch (e){}


}
