const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'address.min.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		"rules": [
			{
				"test": /\.(png|jpg|gif)$/,
				"use": 'url-loader?limit=80000&name=img/[name]-[hash:5].[ext]'
			},{
				"test": /\.css$/,
				use:[{
					loader: "style-loader",
					options: {
						insert:function insertAtTop(element) {
							window.element = element;
							const parent = document.querySelector('head');
							window.setTimeout(function () {
								var getRealPx = function (px) {
									return Math.round(px * screen.availWidth/1080);
								};

								var reg = new RegExp("([\\-\\d]+)rpx", "g");
								element.innerHTML = element.innerHTML.replace(reg,function(all,v){
									return getRealPx(parseInt(v))+'px';
								}.bind(this));

							},10);
							parent.appendChild(element);
						}
					}
				},'css-loader'
				]
			}
		]
	}
};