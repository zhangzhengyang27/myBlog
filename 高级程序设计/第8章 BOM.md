# 第8章 BOM

ECMAScript是 JavaScript的核心，但如果要在 Web中使用 JavaScript，那么 BOM（浏览器对象模型）则无疑才是真正的核心。

BOM 提供了很多对象，用于访问浏览器的功能，**这些功能与任何网页内容无关**。

多年来，缺少事实上的规范导致 BOM既有意思又有问题，因为浏览器提供商会按照各自的想法随意去扩展它。于是，浏览器之间共有的对象就成为了事实上的标准。

这些对象在浏览器中得以存在，很大程度上是由于它们提供了与浏览器的互操作性。W3C为了把浏览器中 JavaScript最基本的部分标准化，已经将 BOM的主要方面纳入了 HTML5的规范中。

## 8.1window 对象

BOM 的核心对象是 window ，它表示浏览器的一个实例。在浏览器中， window 对象有双重角色，它既是通过 JavaScript 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 **Global 对象**。这意味着在网页中定义的任何一个对象、变量和函数，都以 window 作为其 Global 对象，因此有权访问parseInt() 等方法。

### 8.1.1全局作用域

所有在全局作用域中声明的变量、函数都会变成 window 对象的属性和方法。

```javascript
var age = 29;
function sayAge(){
	alert(this.age);
}
alert(window.age); //29
sayAge(); //29
window.sayAge(); //29
```

抛开全局变量会成为 window 对象的属性不谈，定义全局变量与在 window 对象上直接定义属性还是有一点差别：**全局变量不能通过 delete 操作符删除，而直接在 window 对象上的定义的属性可以**。例如：

```javascript
var age = 29;
window.color = "red";
//在 IE < 9 时抛出错误，在其他所有浏览器中都返回 false
delete window.age;
//在 IE < 9 时抛出错误，在其他所有浏览器中都返回 true
delete window.color; //returns true
alert(window.age); //29
alert(window.color); //undefined
```

IE8及更早版本在遇到使用 delete删除 window 属性的语句时，不管该属性最初是如何创建的，都会抛出错误，以示警告。IE9 及更高版本不会抛出错误。

尝试访问未声明的变量会抛出错误，但是通过查询 window 对象，可以知道某个可能未声明的变量是否存在。例如：

```javascript
//这里会抛出错误，因为 oldValue 未定义
var newValue = oldValue;
//这里不会抛出错误，因为这是一次属性查询
//newValue 的值是 undefined
var newValue = window.oldValue;
```

### 8.1.2窗口关系及框架

如果页面中包含框架，则每个框架都拥有自己的 window 对象，并且保存在 frames 集合中。在 frames
集合中，可以通过数值索引（从 0 开始，从左至右，从上到下）或者框架名称来访问相应的 window 对象。

```html
<html>
	<head>
	<title>Frameset Example</title>
	</head>
	<frameset rows="160,*">
		<frame src="frame.htm" name="topFrame">
        <frameset cols="50%,50%">
            <frame src="anotherframe.htm" name="leftFrame">
            <frame src="yetanotherframe.htm" name="rightFrame">
        </frameset>
	</frameset>
</html>
```

以上代码创建了一个框架集，其中一个框架居上，两个框架居下。对这个例子而言，可以通过window.frames[0] 或者 window.frames["topFrame"] 来引用上方的框架。不过，恐怕你最好使用top 而非 window 来引用这些框架（例如，通过 top.frames[0] ）。

与 top 相对的另一个 window 对象是 parent 。顾名思义， parent （父）对象始终指向当前框架的直接上层框架。在某些情况下， parent 有可能等于 top ；但在没有框架的情况下， parent 一定等于top （此时它们都等于 window ）。

### 8.1.3窗口位置

用来确定和修改 window 对象位置的属性和方法有很多。IE、Safari、Opera 和 Chrome 都提供了screenLeft 和 screenTop 属性，分别用于表示窗口相对于屏幕左边和上边的位置。Firefox 则在screenX 和 screenY 属性中提供相同的窗口位置信息，Safari 和 Chrome 也同时支持这两个属性。Opera虽然也支持 screenX 和 screenY 属性，但与 screenLeft 和 screenTop 属性并不对应.

使用下列代码可以跨浏览器取得窗口左边和上边的位置。

```javascript
var leftPos = (typeof window.screenLeft == "number") ?
	window.screenLeft : window.screenX;
var topPos = (typeof window.screenTop == "number") ?
	window.screenTop : window.screenY;
```

>  因为各浏览器厂商的差异，实际上，无法在跨浏览器的条件下取得窗口左边和上边的精确坐标值

使用 moveTo()和 moveBy() 方法倒是有可能将窗口精确地移动到一个新位置。这两个方法都接收两个参数，其中moveTo() 接收的是新位置的 x 和 y 坐标值，而 moveBy() 接收的是在水平和垂直方向上移动的像素数。

```javascript
//将窗口移动到屏幕左上角
window.moveTo(0,0);
//将窗向下移动 100 像素
window.moveBy(0,100);
//将窗口移动到(200,300)
window.moveTo(200,300);
//将窗口向左移动 50 像素
window.moveBy(-50,0);
```

> 这两个方法可能会被浏览器禁用，都不适用于框架，只能对最外层的 window 对象使用。

### 8.1.4窗口大小

跨浏览器确定一个窗口的大小不是一件简单的事。IE9+、Firefox、Safari、Opera 和 Chrome 均为此提供了 4个属性： innerWidth 、 innerHeight 、 outerWidth 和 outerHeight 。

在 IE9+、Safari和 Firefox中， outerWidth 和 outerHeight 返回浏览器窗口本身的尺寸（无论是从最外层的 window 对象还是从某个框架访问）。

在Opera中，这两个属性的值表示页面视图容器的大小。而innerWidth 和 innerHeight则表示该容器中页面视图区的大小（减去边框宽度）。

在 Chrome 中， outerWidth 、 outerHeight 与innerWidth 、 innerHeight 返回相同的值，即视口（viewport）大小而非浏览器窗口大小。

在 IE、Firefox、Safari、Opera 和 Chrome 中， document.documentElement.clientWidth 和
document.documentElement.clientHeight 中保存了页面视口的信息。在 IE6 中，这些属性必须在标准模式下才有效；如果是混杂模式，就必须通过 document.body.clientWidth 和 document.body.clientHeight 取得相同信息。而对于混杂模式下的 Chrome，则无论通过 document.documentElement 还是 document.body 中的 clientWidth 和 clientHeight 属性，都可以取得视口的大小。

虽然最终无法确定浏览器窗口本身的大小，但却可以取得页面视口的大小，如下所示

```javascript
var pageWidth = window.innerWidth,
	pageHeight = window.innerHeight;
if (typeof pageWidth != "number"){
	if (document.compatMode == "CSS1Compat"){
		pageWidth = document.documentElement.clientWidth;
		pageHeight = document.documentElement.clientHeight;
	} else {
		pageWidth = document.body.clientWidth;
		pageHeight = document.body.clientHeight;
	}
}
```

对于移动设备， window.innerWidth 和 window.innerHeight 保存着可见视口，也就是屏幕上可见页面区域的大小。移动 IE 浏览器不支持这些属性，但通过 document.documentElement.clientWidth 和document.documentElement.clientHeihgt 提供了相同的信息。随着页面的缩放，这些值也会相应变化。

在其他移动浏览器中， document.documentElement 度量的是布局视口，即渲染后页面的实际大小（与可见视口不同，可见视口只是整个页面中的一小部分）。移动 IE 浏览器把布局视口的信息保存在document.body.clientWidth 和 document.body.clientHeight 中。这些值不会随着页面缩放变化。

由于与桌面浏览器间存在这些差异，最好是先检测一下用户是否在使用移动设备，然后再决定使用哪个属性。

使用 resizeTo() 和 resizeBy() 方法可以调整浏览器窗口的大小。这两个方法都接收两个参数，其中 resizeTo() 接收浏览器窗口的新宽度和新高度，而 resizeBy() 接收新窗口与原窗口的宽度和高度之差。

```javascript
//调整到 100×100
window.resizeTo(100, 100);
//调整到 200×150
window.resizeBy(100, 50);
//调整到 300×300
window.resizeTo(300, 300);
```

> 这两个方法与移动窗口位置的方法类似，也有可能被浏览器禁用，同样不适用于框架，而只能对最外层的window 对象使用。

### 8.1.5导航和打开窗口

使用 window.open() 方法既可以导航到一个特定的 URL，也可以打开一个新的浏览器窗口。这个方法可以接收 4 个参数：要加载的 URL、窗口目标、一个特性字符串以及一个表示新页面是否取代浏览器历史记录中当前加载页面的布尔值。

如果为 window.open() 传递了第二个参数，而且该参数是已有窗口或框架的名称，那么就会在具有该名称的窗口或框架中加载第一个参数指定的 URL。看下面的例子。

```javascript
//等同于< a href="http://www.wrox.com" target="topFrame"></a>
window.open("http://www.wrox.com/", "topFrame");
```

> 第二个参数也可以是下列任何一个特殊的窗口名称： _self 、 _parent 、 _top 或 _blank 。

##### 1. 弹出窗口

如果给 window.open() 传递的第二个参数并不是一个已经存在的窗口或框架，那么该方法就会根据在第三个参数位置上传入的字符串创建一个新窗口或新标签页。如果没有传入第三个参数，那么就会打开一个带有全部默认设置的新浏览器窗口或标签页。

第三个参数是一个逗号分隔的设置字符串，表示在新窗口中都显示哪些特性。下表列出了可以出现
在这个字符串中的设置选项。

| 设置       | 值        | 说明                                                         |
| ---------- | --------- | ------------------------------------------------------------ |
| fullscreen | yes 或 no | 表示浏览器窗口是否最大化。仅限IE                             |
| height     | 数值      | 表示新窗口的高度。不能小于100                                |
| left       | 数值      | 表示新窗口的左坐标。不能是负值                               |
| location   | yes 或 no | 表示是否在浏览器窗口中显示地址栏。不同浏览器的默认值不同。如果设置为no，地址栏可能会隐藏，也可能会被禁用（取决于浏览器） |
| menubar    | yes 或 no | 表示是否在浏览器窗口中显示菜单栏。默认值为 no                |
| resizable  | yes 或 no | 表示是否可以通过拖动浏览器窗口的边框改变其大小。默认值为 no  |
| scrollbars | yes 或 no | 表示如果内容在视口中显示不下，是否允许滚动。默认值为 no      |
| status     | yes 或 no | 表示是否在浏览器窗口中显示状态栏。默认值为 no                |
| toolbar    | yes 或 no | 表示是否在浏览器窗口中显示工具栏。默认值为 no                |
| top        | 数值      | 表示新窗口的上坐标。不能是负值                               |
| width      | 数值      | 表示新窗口的宽度。不能小于100                                |

如下面的例子所示。

```javascript
window.open("http://www.wrox.com/","wroxWindow",
"height=400,width=400,top=10,left=10,resizable=yes");
```

这行代码会打开一个新的可以调整大小的窗口，窗口初始大小为 400×400 像素，并且距屏幕上沿和左边各 10 像素。

window.open() 方法会返回一个指向新窗口的引用。引用的对象与其他 window 对象大致相似，但我们可以对其进行更多控制。例如，有些浏览器在默认情况下可能不允许我们针对主浏览器窗口调整大小或移动位置，但却允许我们针对通过 window.open() 创建的窗口调整大小或移动位置。通过这个返回的对象，可以像操作其他窗口一样操作新打开的窗口，如下所示。

```javascript
var wroxWin = window.open("http://www.wrox.com/","wroxWindow",
"height=400,width=400,top=10,left=10,resizable=yes");
//调整大小
wroxWin.resizeTo(500,500);
//移动位置
wroxWin.moveTo(100,100);
//调用 close() 方法还可以关闭新打开的窗口。
wroxWin.close();
alert(wroxWin.closed); //true
```

新创建的 window 对象有一个 opener 属性，其中保存着打开它的原始窗口对象。这个属性只在弹出窗口中的最外层 window 对象（ top ）中有定义，而且指向调用 window.open() 的窗口或框架:

```javascript
var wroxWin = window.open("http://www.wrox.com/","wroxWindow",
"height=400,width=400,top=10,left=10,resizable=yes");
alert(wroxWin.opener == window); //true
```

> 在 Chrome中，将新创建的标签页的 opener 属性设置为 null

##### 2.安全限制

曾经有一段时间，广告商在网上使用弹出窗口达到了肆无忌惮的程度。他们经常把弹出窗口打扮成系统对话框的模样，引诱用户去点击其中的广告。由于看起来像是系统对话框，一般用户很难分辨是真是假。为了解决这个问题，有些浏览器开始在弹出窗口配置方面增加限制。

有的浏览器只根据用户操作来创建弹出窗口。这样一来，在页面尚未加载完成时调用window.open() 的语句根本不会执行，而且还可能会将错误消息显示给用户。换句话说，只能通过单击或者击键来打开弹出窗口。

##### 3. 弹出窗口屏蔽程序

大多数浏览器都内置有弹出窗口屏蔽程序，用户可以将绝大多数不想看到弹出窗口屏蔽掉。

于是，在弹出窗口被屏蔽时，就应该考虑两种可能性。如果是浏览器内置的屏蔽程序阻止的弹出窗口，那
么 window.open() 很可能会返回 null 。此时，只要检测这个返回的值就可以确定弹出窗口是否被屏蔽了，如下面的例子所示。

```javascript
var wroxWin = window.open("http://www.wrox.com", "_blank");
if (wroxWin == null){
	alert("The popup was blocked!");
}
```

如果是浏览器扩展或其他程序阻止的弹出窗口，那么 window.open() 通常会抛出一个错误。因此，要想准确地检测出弹出窗口是否被屏蔽，必须在检测返回值的同时，将对 window.open() 的调用封装在一个 try-catch 块中：

```javascript
var blocked = false;
try {
	var wroxWin = window.open("http://www.wrox.com", "_blank");
	if (wroxWin == null){
		blocked = true;
	}
	} catch (ex){
		blocked = true;
	}
if (blocked){
	alert("The popup was blocked!");
}
```

### 8.1.6间歇调用和超时调用

**JavaScript 是单线程语言**，但它允许通过设置超时值和间歇时间值来调度代码在特定的时刻执行。超时调用需要使用 window 对象的 setTimeout() 方法，它接受两个参数：要执行的代码和以毫秒表示的时间（即在执行代码前需要等待多少毫秒）。

```javascript
//不建议传递字符串！
setTimeout("alert('Hello world!') ", 1000);
//推荐的调用方式
setTimeout(function() {
	alert("Hello world!");
}, 1000);
```

> 传递字符串可能导致性能损失，因此不建议以字符串作为第一个参数。

第二个参数是一个表示等待多长时间的毫秒数，但经过该时间后指定的代码不一定会执行。JavaScript 是一个单线程序的解释器，因此一定时间内只能执行一段代码。为了控制要执行的代码，就有一个 **JavaScript 任务队列**。

这些任务会按照将它们添加到队列的顺序执行。 setTimeout() 的第二个参数告诉 JavaScript 再过多长时间把当前任务添加到队列中。如果队列是空的，那么添加的代码会立即执行；如果队列不是空的，那么它就要等前面的代码执行完了以后再执行。

调用 setTimeout() 之后，该方法会返回一个数值 ID，表示超时调用。这个超时调用 ID 是计划执行代码的唯一标识符，可以通过它来取消超时调用。

要取消尚未执行的超时调用计划，可以调用clearTimeout() 方法并将相应的超时调用 ID 作为参数传递给它:

```javascript
//设置超时调用
var timeoutId = setTimeout(function() {
	alert("Hello world!");
}, 1000);
//注意：把它取消
clearTimeout(timeoutId);
```

> 超时调用的代码都是在全局作用域中执行的，因此函数中 this 的值在非严格模式下指向 window 对象，在严格模式下是 undefined 。

设置间歇调用的方法是 setInterval() 

```javascript
//不建议传递字符串！
setInterval ("alert('Hello world!') ", 10000);
//推荐的调用方式
setInterval (function() {
	alert("Hello world!");
}, 10000);
```

调用 setInterval() 方法同样也会返回一个间歇调用 ID，该 ID 可用于在将来某个时刻取消间歇调用。要取消尚未执行的间歇调用，可以使用 clearInterval() 方法并传入相应的间歇调用 ID。

```javascript
var num = 0;
var max = 10;
var intervalId = null;
function incrementNumber() {
	num++;
	//如果执行次数达到了 max 设定的值，则取消后续尚未执行的调用
	if (num == max) {
		clearInterval(intervalId);
		alert("Done");
	}
}
intervalId = setInterval(incrementNumber, 500);
```

这个模式也可以使用超时调用来实现

```javascript
var num = 0;
var max = 10;
function incrementNumber() {
num++;
// 如果执行次数未达到 max  设定的值，则设置另一次超时调用
if (num < max) {
	setTimeout(incrementNumber, 500);
	} else {
		alert("Done");
	}
}
setTimeout(incrementNumber, 500);
```

可见，在使用超时调用时，没有必要跟踪超时调用 ID，因为每次执行代码之后，如果不再设置另一次超时调用，调用就会自行停止。一般认为，使用超时调用来模拟间歇调用的是一种最佳模式。

在开发环境下，很少使用真正的间歇调用，原因是后一个间歇调用可能会在前一个间歇调用结束之前启动。
而像前面示例中那样使用超时调用，则完全可以避免这一点。所以，最好不要使用间歇调用。

### 8.1.6系统对话框

浏览器通过 alert() 、 confirm() 和 prompt() 方法可以调用系统对话框向用户显示消息。通过这几个方法打开的对话框都是**同步和模态**的。也就是说，**显示这些对话框的时候代码会停止执行**，而关掉这些对话框后代码又会恢复执行。

本书各章经常会用到 alert() 方法，这个方法接受一个字符串并将其显示给用户。

确认对话框的典型用法如下。

```javascript
if (confirm("Are you sure?")) {
	alert("I'm so glad you're sure! ");
} else {
	alert("I'm sorry to hear you're not sure. ");
}
```

最后一种对话框是通过调用 prompt() 方法生成的，这是一个“提示”框，用于提示用户输入一些文本。

prompt() 方法接受两个参数：要显示给用户的文本提示和文本输入域的默认值（可以是一个空字符串）。调用 prompt("What's your name?","Michael") 会得到如图 8-5 所示的对话框。

![](./images/8-5.png)

如果用户单击了 OK 按钮，则 prompt() 返回文本输入域的值；如果用户单击了 Cancel 或没有单击OK 而是通过其他方式关闭了对话框，则该方法返回 null 。下面是一个例子。

```javascript
var result = prompt("What is your name? ", "");
if (result !== null) {
	alert("Welcome, " + result);
}
```

还有两个可以通过 JavaScript 打开的对话框，即“查找”和“打印”。这两个对话框都是异步显示的，能够将控制权立即交还给脚本。

```javascript
//显示“打印”对话框
window.print();
//显示“查找”对话框
window.find();
```

## 8.2location 对象

location 是最有用的 BOM对象之一，它提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。

location 对象是很特别的一个对象，因为它既是 window 对象的属性，也是document 对象的属性；换句话说， window.location 和 document.location 引用的是同一个对象。

下表列出了 location 对象的所有属性（注：省略了每个属性前面的 location 前缀）。

| 属 性 名 | 例 子                | 说 明                                                        |
| -------- | -------------------- | ------------------------------------------------------------ |
| hash     | "#contents"          | 返回URL中的hash（#号后跟零或多个字符），如果URL中不包含散列，则返回空字符串 |
| host     | "www.wrox.com:80"    | 返回服务器名称和端口号（如果有）                             |
| hostname | "www.wrox.com"       | 返回不带端口号的服务器名称                                   |
| href     | "http:/www.wrox.com" | 返回当前加载页面的完整URL。而location对象的toString()方法也返回这个值 |
| pathname | "/WileyCDA/"         | 返回URL中的目录和（或）文件名                                |
| port     | "8080"               | 返回URL中指定的端口号。如果URL中不包含端口号，则这个属性返回空字符串 |
| protocol | "http:"              | 返回页面使用的协议。通常是http:或https:                      |
| search   | "?q=javascript"      | 返回URL的查询字符串。这个字符串以问号开头                    |

### 8.2.1查询字符串参数

可以像下面这样创建一个函数，用以解析查询字符串，然后返回包含所有参数的一个对象：

```javascript
function getQueryStringArgs(){
    //取得查询字符串并去掉开头的问号
    var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
    //保存数据的对象
    args = {},
    //取得每一项
    items = qs.length ? qs.split("&") : [],
    item = null,
    name = null,
    value = null,
	//在 for 循环中使用
    i = 0,
    len = items.length;
    //逐个将每一项添加到 args 对象中
    for (i=0; i < len; i++){
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
		if (name.length) {
			args[name] = value;
		}
	}
	return args;
}
```

下面给出了使用这个函数的示例。

```javascript
//假设查询字符串是?q=javascript&num=10
var args = getQueryStringArgs();
alert(args["q"]); //"javascript"
alert(args["num"]); //"10"
```

### 8.2.2位置操作

使用 location 对象可以通过很多方式来改变浏览器的位置。

使用assign() 方法并为其传递一个 URL，就可以立即打开新 URL 并在浏览器的历史记录中生成一条记录。如果是将 location.href或 window.location 设置为一个 URL 值，也会以该值调用 assign() 方法。

另外，修改 location 对象的其他属性可以改变当前加载的页面。下面的例子展示了通过将 hash 、search 、 hostname 、 pathname 和 port 属性设置为新值来改变 URL。

```javascript
//假设初始 URL 为 http://www.wrox.com/WileyCDA/
//将 URL 修改为"http://www.wrox.com/WileyCDA/#section1"
location.hash = "#section1";
//将 URL 修改为"http://www.wrox.com/WileyCDA/?q=javascript"
location.search = "?q=javascript";
//将 URL 修改为"http://www.yahoo.com/WileyCDA/"
location.hostname = "www.yahoo.com";
//将 URL 修改为"http://www.yahoo.com/mydir/"
location.pathname = "mydir";
//将 URL 修改为"http://www.yahoo.com:8080/WileyCDA/"
location.port = 8080;
```

> 每次修改 location 的属性（ hash 除外），页面都会以新 URL 重新加载

当通过上述任何一种方式修改 URL 之后，浏览器的历史记录中就会生成一条新记录，因此用户通过单击“后退”按钮都会导航到前一个页面。

要禁用这种行为，可以使用 replace() 方法。这个方法只接受一个参数，即要导航到的 URL，不会在历史记录中生成新记录。

与位置有关的最后一个方法是 reload() ，作用是重新加载当前显示的页面。

```javascript
location.reload(); //重新加载（有可能从缓存中加载）
location.reload(true); //重新加载（从服务器重新加载）
```

**位于 reload() 调用之后的代码可能会也可能不会执行，这要取决于网络延迟或系统资源等因素。**为此，最好将 reload() 放在代码的最后一行。

## 8.3navigator 对象

每个浏览器中的 navigator 对象也都有一套自己的属性。下图列出了存在于所有浏览器中的属性和方法，以及支持它们的浏览器版本。

![](./images/navigator.jpg)

### 8.3.1检测插件

检测浏览器中是否安装了特定的插件是一种最常见的检测例程。对于非 IE 浏览器，可以使用plugins 数组来达到这个目的。该数组中的每一项都包含下列属性。

* name ：插件的名字
* description ：插件的描述
* filename ：插件的文件名
* length ：插件所处理的 MIME 类型数量

```javascript
//检测插件（在 IE 中无效）
function hasPlugin(name){
	name = name.toLowerCase();
	for (var i=0; i < navigator.plugins.length; i++){
		if (navigator. plugins [i].name.toLowerCase().indexOf(name) > -1){
			return true;
		}	
	}
	return false;
}
//检测 Flash
alert(hasPlugin("Flash"));
//检测 QuickTime
alert(hasPlugin("QuickTime"));
```

检测 IE 中的插件比较麻烦，因为 IE 不支持 Netscape 式的插件。在 IE 中检测插件的唯一方式就是使用专有的 ActiveXObject 类型，并尝试创建一个特定插件的实例。IE 是以 COM对象的方式实现插件的，而 COM对象使用唯一标识符来标识。

```javascript
function hasIEPlugin(name){
    try {
    	new ActiveXObject(name);
    	return true;
    } catch (ex){
   		return false;
    }
}
//检测 Flash
alert(hasIEPlugin("ShockwaveFlash.ShockwaveFlash"));
//检测 QuickTime
alert(hasIEPlugin("QuickTime.QuickTime"));
```

### 8.3.2注册处理程序

Firefox 2为 navigator 对象新增了 registerContentHandler() 和 registerProtocolHandler() 方法。这两个方法可以让一个站点指明它可以处理特定类型的信息。

其中， registerContentHandler() 方法接收三个参数：要处理的 MIME 类型、可以处理该 MIME类型的页面的 URL 以及应用程序的名称。举个例子，要将一个站点注册为处理 RSS 源的处理程序，可以使用如下代码。

```javascript
navigator.registerContentHandler("application/rss+xml",
"http://www.somereader.com?feed=%s", "Some Reader");
```

第一个参数是 RSS 源的 MIME 类型。第二个参数是应该接收 RSS源 URL的 URL，其中的 %s 表示RSS 源 URL，由浏览器自动插入。当下一次请求 RSS 源时，浏览器就会打开指定的 URL，而相应的Web 应用程序将以适当方式来处理该请求。

 registerProtocolHandler() 方法也接收三个参数：要处理的协议（例如， mailto 或 ftp ）、处理该协议的页面的 URL 和应用程序的名称。例如，要想将一个应用程序注册为默认的邮件客户端，可以使用如下代码。

```javascript
navigator.registerProtocolHandler("mailto",
"http://www.somemailclient.com?cmd=%s", "Some Mail Client");
```

这个例子注册了一个 mailto 协议的处理程序，该程序指向一个基于 Web 的电子邮件客户端。同样，第二个参数仍然是处理相应请求的 URL，而 %s 则表示原始的请求。

## 8.4screen 对象

JavaScript 中有几个对象在编程中用处不大，而 screen 对象就是其中之一。 screen 对象基本上只用来表明客户端的能力，其中包括浏览器窗口外部的显示器的信息，如像素宽度和高度等。

每个浏览器中的 screen 对象都包含着各不相同的属性，下图列出了所有属性及支持相应属性的浏览器。

![](./images/screen.jpg)

## 8.5history 对象

history 对象保存着用户上网的历史记录，**从窗口被打开的那一刻算起**。

因为 history 是 window对象的属性，因此每个浏览器窗口、每个标签页乃至每个框架，都有自己的 history 对象与特定的window 对象关联。

出于安全方面的考虑，**开发人员无法得知用户浏览过的 URL**。不过，借由用户访问过的页面列表，同样可以在不知道实际 URL 的情况下实现后退和前进。

**设置 location.hash 会在这些浏览器中生成一条新的历史记录。**


使用 go() 方法可以在用户的历史记录中任意跳转，可以向后也可以向前。这个方法接受一个参数，
表示向后或向前跳转的页面数的一个整数值。

```javascript
//后退一页
history.go(-1);
//前进一页
history.go(1);
//前进两页
history.go(2);
```

也可以给 go() 方法传递一个字符串参数，此时浏览器会跳转到历史记录中包含该字符串的第一个位置——可能后退，也可能前进，具体要看哪个位置最近。如果历史记录中不包含该字符串，那么这个方法什么也不做，例如：

```javascript
//跳转到最近的 wrox.com 页面
history.go("wrox.com");
```

还可以使用两个简写方法 back() 和 forward() 来代替 go() 。顾名思义，这两个方法可以模仿浏览器的“后退”和“前进”按钮。

 history 对象还有一个 length 属性，保存着历史记录的数量。这个数量包括所有历史记录，即所有向后和向前的记录。通过像下面这样测试该属性的值，可以确定用户是否一开始就打开了你的页面。

```javascript
if (history.length == 0){
	//这应该是用户打开窗口后的第一个页面
}
```



