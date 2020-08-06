## **移动端地址选择器**

1、地址新，定期更新

2、动画平顺

3、兼容各大移动浏览器

4、使用简单


### 安装

`
npm i pingansec-address-select
`

### 或者

`dist/address.min.js  你懂的
`


### 用法

`
 var address =  new PinganAddressSelect({
       'onSelected':function (info) {
		   document.getElementById('show-address').value = info.province +' '+info.city + ' '+info.region;
	   }
   });
   address.setProvince('江苏省');
   address.setCity('宿迁市');
   address.setRegion('宿城区');
   
   //或者使用事件
   address.show();
`


