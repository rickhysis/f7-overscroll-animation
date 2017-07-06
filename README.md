Overscroll animation plugin 
==========================
Overscroll animation is a plugin for showing animations like android.overscroll animation using HTML, CSS, and vanilla JavaScript. If you are unfamiliar with this user feedback animation, you can see an example GIF.

-----
## LICENSE

**NOTE:** Overscroll animation is licensed under the [The MIT License](https://github.com/wenzhixin/bootstrap-table/blob/master/LICENSE). Completely free, you can arbitrarily use and modify this plugin. If this plugin is useful to you, you can **Star** this repo, your support is my biggest motive force, thanks.

### Screenshot
![screen](https://raw.githubusercontent.com/rickhysis/f7-overscroll-animation/master/screenshot/oa.gif)


## How to works

1) Copy overscroll-animation.js to your project and reference them:

```html
<script src="overscroll-animation.js"></script>
```

2) Initialize & options

```javascript
var App = new Framework7({
	// Enable overscroll animation
	overscrollAnimation: {
		color:  "black",
		width:  "400",
		height: "400"
	}	
});
```

Available options (if not set, default will be used)

- **color** Set background color
- **width** (Default: 680) Set width value
- **height** (Default: 400) Set height value
- **opacity** (Default: '.6') Set Opacity value