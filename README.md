# jValid
输入验证插件

属性：
--

|属性|类型|默认值|描述|
|----|----|----|----|
|tips|String|'invalid value'|当未通过验证时显示的消息, 不需显示设置'', 可以使用html格式.|
|html|Boolean|true|若设置成false, tips使用纯文本消息插入.|
|trigger|String|'blur'|触发事件类型keydown/keypress/keyup/blur/focus|
|emptyCheck|Boolean|true|值为空时是否检查|
|valid|Function|empty function|通过验证时的回调函数|
|invalid|Function|empty function|未通过验证时的回调函数|
|clazz|String|''|未通过验证时向元素添加的class样式类|
|style|String|''|未通过验证时向元素增加的内联样式, 请写样式表内容, 如color:red|
|pattern|String/RegExp|'1==1'|验证的表达式, 可以是一个正则表达式对象, 如/\w/, 可以是一个js表达式字符串, 将输入值作为变量x, 如 'x>100'|
|delay|Number|10|避免反复触发事件, 设定的验证延时值, 毫秒数|

全局属性
--
设置`$.jValid.option`的各项属性即可修改属性的默认值, `html标签调用方式`不生效, 因为那时候已经初始化完成了.<br> 
也可以直接给`$.jValid.option`赋值新对象, 没有给的属性会用初始的默认值补全. 如
```javascript
$.jValid.option = {
	tips: 'message you need show'
};
```

如何使用：
--
#####html标签调用
为input标签添加data-jvalid属性, 在dom ready后会为你初始化插件.<br>
以上属性名称皆支持data-jvalid-属性 方式设置, 如 
```html
<input data-jvalid data-jvalid-tips="oops, type wrong" />
```
#####jQuery调用
```javascript
$('input').jValid({
	tips: 'you type wrong',
	pattern: /\w/,
	emptyCheck: false
});
```