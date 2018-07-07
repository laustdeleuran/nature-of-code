import pack from '../package.json';
import CnameWebpackPlugin from 'cname-webpack-plugin';
import compiler from './config.babel';

compiler.mode = 'production';
compiler.plugins.push(new CnameWebpackPlugin({
	domain: pack.host,
}));

export default compiler;
