let dataJson  = require('./data');
import right from "./images/right.png";
import closeImage from "./images/close.png";
import "./main.css";

export function AddressSelect(options) {
	var defaultOptions = {
		'onSelected':function (address) {
			console.log(address);
		}.bind(this),
		'onClosed':function () {
		},
		'autoHide':true,
		'regionOther':'其它区'
	};
	this.options = {
		...defaultOptions,
		...options
	};
	this.container = document.createElement('div');
	this.container.className = "address-select-container";
	this.mask = document.createElement('div');
	this.mask.className = "address-select-mask";
	this._initDom();
	this.province = '';
	this.city = '';
	this.region = '';
	this.initProvince();
	this.currentSelected = null;
}
AddressSelect.prototype = {
	show:function () {
		this._showDom(this.container);
		this._showDom(this.mask);
		this._showDom(this.container);
		this.removeClass(this.container,'animation-out');
		this.addClass(this.container,'animation');
		if(!this.currentSelected) {
			this.selectProvince();
			if(this.defaultProvince) {
				this._initDefaultList(this.provinceList,this.defaultProvince);
			}
			if(this.defaultCity) {
				this._initDefaultList(this.cityList,this.defaultCity);
			}
			if(this.defaultRegion) {
				this._initDefaultList(this.regionList,this.defaultRegion);
			}
		}
	},
	getAddress:function(){
		return {
			province:this.province,
			city:this.city,
			region:this.region
		};
	},
	_initDefaultList:function(valueListDom,defaultValue){
		valueListDom.querySelectorAll('.address-select-row').forEach(function (item,index) {
			var value = item.getAttribute('data-value');
			if(value===defaultValue) {
				item.clickCallback(true);
				var scrollTop = this._getRealPx(40) + 1;
				scrollTop *=  (index + 1);
				valueListDom.scrollTop = scrollTop;
			}
		}.bind(this));
	},
	setProvince:function(province){
		this.defaultProvince = province;
		this.province  = province;
	},
	setCity:function(city){
		this.defaultCity = city;
		this.city = city;
	},
	setRegion:function(region){
		this.defaultRegion = region;
		this.region = region;
	},
	initProvince:function(){
		this.provinceSelected.innerHTML = '请选择';
		this.initList(this.provinceList,dataJson,function (provinceDetail) {

			provinceDetail.children.forEach(function (item) {
				if(item.name === '市辖区') {
					item.name = provinceDetail.name;
				}
			});
			this.initCity(provinceDetail.children);
			this.province = provinceDetail.name;
			this.provinceSelected.innerHTML = this.province;
			this._showDom(this.citySelected);
			this.city = '';
			this.region = '';
			this.selectCity();
			this._hideDom(this.regionSelected);

			if(provinceDetail.children.length === 1) {
				this.cityList.querySelector('.address-select-row').clickCallback();
			}
		}.bind(this))
	},
	initCity:function(cityList){
		this.citySelected.innerHTML = '请选择';
		this.initList(this.cityList,cityList,function (cityDetail) {

			this.initRegion(cityDetail.children);
			this.city = cityDetail.name;
			this.citySelected.innerHTML = this.city;
			this._showDom(this.regionSelected);
			this.region = '';
			this.selectRegion();
		}.bind(this));
	},
	initRegion:function(regionList){
		this.regionSelected.innerHTML = '请选择';

		if(this.options.regionOther) {
			regionList.push({
				'name':this.options.regionOther
			});
		}

		this.initList(this.regionList,regionList,function (regionDetail,init) {
			this.region = regionDetail.name;
			this.regionSelected.innerHTML = this.region;

			var width = this.regionSelected.offsetWidth;
			this.moveCusor(width,this.regionSelected.offsetLeft);

			if(!init) { //初始化地区，不再执行回调
				this.options.onSelected({
					'province':this.province,
					'city':this.city,
					'region':this.region
				});

				if(this.options.autoHide) {
					this.hide();
				}
			}
		}.bind(this));
	},
	moveCusor:function(width,left){
		left -= 2;
		this._setCss(this.cursor,{
			width:width + 4 +'px',
		});

		this.animateToLeft(this.cursor,left,300,'cursor');

	},animateToLeft:function (dom,desLeft,timeDuration,type) {
		var lastLeft = parseInt(dom.style.left);

		if(!window.requestAnimationFrame) {
			this._setCss(dom,{
				left:desLeft+'px'
			});
			return;
		}
		timeDuration = timeDuration || 100;
		var oneDeta = (desLeft - lastLeft) / timeDuration ;
		if(oneDeta === 0) {
			return;
		}
		try {
			document.body.querySelector('#' + 'address-select-animation' + type).remove();
		} catch (e) {
		}

		var style = document.createElement('style');
		style.id = 'address-select-animation'+type;
		var typeName = type + new Date().getTime();
		style.innerHTML = `@keyframes ${typeName}
		{
			from {left:${lastLeft}px;}
			to {left:${desLeft}px;}
		}
		`;
		document.body.appendChild(style);
		dom.style.left = desLeft +'px';
		dom.style.animation = '';
		dom.style.animation = `${typeName} ${timeDuration}ms ease`;

		//
		// var start = new Date().getTime();
		// var rote = function(){
		// 	var currentTime = new Date().getTime();
		// 	var dtime = (currentTime-start);
		// 	var toLeft = lastLeft + dtime * oneDeta;
		// 	if(dtime>=timeDuration) {
		// 		this._setCss(dom,{
		// 			left:desLeft+'px'
		// 		});
		// 		return;
		// 	}
		// 	this._setCss(dom,{
		// 		left:toLeft+'px'
		// 	});
		// 	requestAnimationFrame(rote);
		// }.bind(this);
		// rote();
	},
	initList:function(container,dataList,callback){
		container.innerHTML = '';
		dataList.forEach(function (info) {
			var row = document.createElement('div');
			row.innerHTML = info.name;
			row.setAttribute('data-value',info.name);
			row.className = "address-select-row";
			this.tap(row,function (init) {
				callback(info,init);
				container.querySelectorAll('.address-select-row').forEach(function (item) {
					item.className = "address-select-row";
				});
				row.className += ' active';
			}.bind(this));
			container.appendChild(row);
			var image = new Image();
			image.src = right;
			row.appendChild(image);
		}.bind(this))
	},
	hide:function () {
		this.removeClass(this.container,'animation');
		this.addClass(this.container,'animation-out');

		setTimeout(function () {
			this._hideDom(this.mask);
		}.bind(this),300);

	},
	selectProvince:function(){


		// this._hideDom(this.cityList);
		// this._hideDom(this.regionList);
		// this._showDom(this.provinceList);
		this.animateToLeft(this.addressList,0,200,'list');

		//样式
		this.removeClass(this.citySelected,'active');
		this.removeClass(this.regionSelected,'active');



		this.addClass(this.provinceSelected,'active');


		var width = this.provinceSelected.offsetWidth;
		this.moveCusor(width,this.provinceSelected.offsetLeft);
		this.currentSelected = 'province';
	},
	selectCity:function(){
		var width = this.citySelected.offsetWidth;

		this.moveCusor(width,this.citySelected.offsetLeft);

		// this._showDom(this.cityList);
		// this._hideDom(this.regionList);
		// this._hideDom(this.provinceList);

		this.animateToLeft(this.addressList,this._getRealPx(-1080),200,'list');

		//样式
		this.addClass(this.citySelected,'active');
		this.removeClass(this.regionSelected,'active');
		this.removeClass(this.provinceSelected,'active');
		this.currentSelected = 'city';
	},
	selectRegion:function(){
		var width = this.regionSelected.offsetWidth;
		this.moveCusor(width,this.regionSelected.offsetLeft);

		// this._hideDom(this.cityList);
		// this._showDom(this.regionList);
		// this._hideDom(this.provinceList);

		this.animateToLeft(this.addressList,this._getRealPx(1080*-2),200,'list');

		//样式
		this.removeClass(this.citySelected,'active');
		this.addClass(this.regionSelected,'active');
		this.removeClass(this.provinceSelected,'active');
		this.currentSelected = 'region';
	},
	_initDom:function(){
		document.body.appendChild(this.container);
		document.body.appendChild(this.mask);
		this.container .innerHTML = '<div class="address-select-close"><img class="address-select-close" /></div><div class="address-select-title">' +
			'<div class="address-select-province ast-title-item">请选择</div>' +
			'<div class="address-select-city ast-title-item">请选择</div>' +
			'<div class="address-select-region ast-title-item">请选择</div>' +
			'<div class="address-select-title-cursor"></div>'+
			'</div>' +
			'<div class="address-select-body">' +
			'<div class="province-list"></div>' +
			'<div class="city-list"></div>' +
			'<div class="region-list"></div>' +
			'</div>';

		this.title  = this.container.querySelector('.address-select-title');
		this.provinceSelected = this.container.querySelector('.address-select-province');
		this.citySelected = this.container.querySelector('.address-select-city');
		this.regionSelected = this.container.querySelector('.address-select-region');
		this.addressList = this.container.querySelector('.address-select-body');
		this.provinceList = this.container.querySelector('.province-list');
		this.cityList = this.container.querySelector('.city-list');
		this.regionList = this.container.querySelector('.region-list');
		this.cursor = this.container.querySelector('.address-select-title-cursor');

		this.close = this.container.querySelector('.address-select-close');
		this.close.querySelector('img').src = closeImage;

		this.tap(this.close,this.hide.bind(this));

		this.provinceSelected.ontouchend = this.selectProvince.bind(this);
		this.citySelected.ontouchend = this.selectCity.bind(this);
		this.regionSelected.ontouchend = this.selectRegion.bind(this);

	},
	_setCss:function (dom,cssJson) {
		for(var key in cssJson) {
			dom.style[key] = cssJson[key];
		}
	},
	_showDom:function (dom) {
		this._setCss(dom,{
			'display':'block'
		})
	},
	_hideDom:function (dom) {
		this._setCss(dom,{
			'display':'none'
		})
	},
	_getRealPx:function (px) {
		return Math.round(px * screen.availWidth/1080);
	},
	addClass:function (dom,className) {
		dom.className += ' '+className;
	},
	removeClass:function (dom,className) {
		dom.className = dom.className.replace(' '+className,'');
	},
	tap:function (dom,callback) {
		var firstTapPost = {};
		dom.ontouchstart = function (e) {
			firstTapPost.x = e.changedTouches[0].clientX;
			firstTapPost.y = e.changedTouches[0].clientY;
		};
		dom.ontouchmove = function (e) {
		};
		dom.ontouchend = function (e) {
			var x = e.changedTouches[0].clientX;
			var y = e.changedTouches[0].clientY;


			if(Math.abs(Math.sqrt(Math.pow(x,2)+Math.pow(y,2))-Math.sqrt(Math.pow(firstTapPost.x,2)+Math.pow(firstTapPost.y,2))) < 10) {
				callback();
			}

			// if (x !== firstTapPost.x || y !== firstTapPost.y) {
			// } else {
			// 	callback();
			// }
			return false;
		};
		dom.clickCallback = callback;
	}
};
export default AddressSelect;