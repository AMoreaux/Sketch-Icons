import logger from '../../utils/logger'

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes arbitrary elements by ID or className (disabled by default)';

exports.fn = function(item) {

  // abort if current item is no an element
  if (!item.isElem()) return;


  if(item.isElem('svg') && item.hasAttr('viewBox')){
    var viewBox = item.attr('viewBox').value.split(' ')
    this.width =  viewBox[2]
    this.height =  viewBox[3]
    return
  }

  if(item.isElem('rect') && item.hasAttr('fill')){
    const elem = item.attr('fill');
    if (elem.value ===  'none' && item.attr('width').value == this.width && item.attr('height').value == this.height) {
      return false;
    }
  }
  //
  // if(item.isElem('path') && !item.hasAttr('fill')){
  //     return false;
  // }

  // remove element if it's `id` matches configured `id` params

};
