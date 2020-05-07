//这个文件是自己新建的，用来配置别名的，当然可以直接去源码里改，但那样不好，
//所以自己新建，这样配置会自动地加上去

module.exports = {
	configureWebpack: {
		resolve:{
			alias:{
				//   '@':'src'   内部已经配置过了(脚手架3)
				'assets':'@/assets',
				'common':'@/common',
				'components':'@/components',
				'network':'@/network',
				'views':'@/views'
			}
		}
	}
}
