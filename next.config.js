/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withAntdLess = require('next-plugin-antd-less');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

const pluginAntdLess = withAntdLess({
	lessLoaderOptions: {
		lessOptions: {
			javascriptEnabled: true,
			modifyVars: lessToJS(fs.readFileSync(path.resolve(__dirname, './src/styles/antd-custom.less'), 'utf8')),
		},
	},
});

module.exports = withPlugins([[pluginAntdLess]], {
	webpack(config) {
		return config;
	},
});
