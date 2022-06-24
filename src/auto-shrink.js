export  var AutoShrink ={
	getMaxFontSize:function (text,containerWidth,fontFamily,minSize,maxSize) {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		minSize = minSize || 12;
		maxSize = maxSize || 50;

		for(var i=minSize;i<=maxSize;i++){
			context.font = i+"px "+fontFamily;
			var detail = context.measureText(text);
			var width = detail.width;
			if(width === containerWidth) {
				return i;
			}
			if(width>containerWidth) {
				return i-1;
			}
		}
		return i>maxSize?maxSize:i;
	},
	adjust:function (dom,options) {

		if(!dom) {
			return false;
		}

		options = options || {};
		var text = dom.innerHTML;
		var containerWidth = parseInt(getComputedStyle(dom).width);
		var fontFamily = getComputedStyle(dom).fontFamily;
		var maxFontSize = this.getMaxFontSize(text,containerWidth,fontFamily,options.minSize,options.maxSize);
		dom.style.fontSize = maxFontSize+'px';
	}
};
export default AutoShrink;