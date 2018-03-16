//立即执行函数
var Zepto = (function () {
	var zepto = {},$

	//数组方法
	var emptyArr = []				//空数组，便于获取数组对象的原型，相当于 var emptyArr = Array.prototype
		slice = emptyArr.slice     //将类数组转换为数组并使用slice方法
		concat = emptyArr.concat	//将类数组转换为数组并使用concat方法
		filter = emptyArr.filter	//将类数组转换为数组并使用filter方法

	//删除数组中的null和undefined  (注意是用 != 不是!== ，将null和undefined都转换为false)	
	function compact(arr) {
		return filter.call(arr,item => item != null)
	}
	// 数组扁平化（只展开一层），concat.apply([],arr)相当于[].concat(...arr)，利用了concat的参数可以是值也可以是数组的特性，也利用了apply的第二个参数是数组的特性将原数组展开一层
	function flatten(arr) {
		return arr.length > 0 ? concat.apply([],arr) : arr
		// ES6实现
		// return arr.length > 0 ? [].concat(...arr) : arr
	}
	//数组去重，利用了indexOf返回的是数组匹配的第一个项的index的特点
	function uniq(arr) {
		return filter.call(arr,(item,idx) => arr.indexOf(item) == idx)
		// ES6实现
		return [...new Set(arr)]
	}


	//字符串方法
	//将-连字符转换为驼峰
	camelize = function(str) {
	  return str.replace(/-+(.)?/g, function(match, chr) {
	    return chr ? chr.toUpperCase() : ''
	  })
	}
	//将驼峰转换为-连字符
	function dasherize(str) {
	    return str.replace(/::/g, '/')
	           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	           .replace(/_/g, '-')
	           .toLowerCase()
	}


	//检测类型
	var class2type = {}
		toString = class2type.toString 	 		//获取对象原型的toString方法

		//遍历各种数据类型的名称，并将名称映射为小写的类型，最终得到如下形式的class2type
		// class2type = {
		//   "[object Boolean]": "boolean",
		//   "[object Number]": "number"
		//   ...
		// } 
		$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		  	class2type["[object " + name + "]"] = name.toLowerCase()
		})
		//ES6实现
		// var typesStr = 'Boolean Number String Function Array Date RegExp Object Error'
		// class2type = typesStr.split(' ').map(item => ({
		// 	[`[object ${item}]`]: item.toLowerCase()
		// }))

		//类型检测函数， 如果是null或者undefined，则返回'null'/'undefined'，否则利用对象原型的toString方法判断类型并映射为小写字母
		type(obj) {
			return obj == null ? String(obj) : class2type[toString.call(obj)]
		}
	function Z(doms) {
		//$(选择器)获取到的zepto对象，是个数组，每一项是一个dom元素    还有个length属性
		var len = doms.length
		for (var i = 0; i < len; i++) {
			this[i] = doms[i]
		}
		this.length = len
	}

	zepto.Z = (doms) => new Z(doms)

	zepto.init = (doms) => zepto.Z(doms) 

	//利用$('#id')之类的时候，返回zepto对象
	$ = () => zepto.init(doms)
	$.fn = {
		constructor: zepto.Z,
		methods() {
			return this
		}
	}
	Z.prototype = $.fn
	zepto.Z.prototype = $.fn
	return $
})()

// 将Zepto对象挂在到window上作为全局变量
window.Zepto = Zepto

//如果window对象上没有挂载$变量（比如没有jquery的时候），则将$也设置为全局的Zepto对象
window.$ === undefined && (window.$ =  Zepto)
