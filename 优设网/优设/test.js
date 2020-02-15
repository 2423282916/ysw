
jQuery.fn.extend({
  slide: function(o) {
    o = jQuery.extend(
      {
        imgWidth: jQuery(this).attr("data-img-width") || 500, //图片最大宽度
        conWidth: jQuery(this).attr("data-content-width") || 500, //内容最大宽度
        imgHeight: jQuery(this).attr("data-img-height") || 300, //图片最大高度
        animate: jQuery(this).attr("data-animate") || "leftToRight", //动画
        speed: jQuery(this).attr("data-speed") || 5000, //轮播速度
        e: jQuery(this).attr("data-event") || "click" //用于extra是用什么事件触发，选项有hover,click
      },
      o || {}
    );
    var w_h = o.imgWidth / o.imgHeight; //图片宽高比
    var c_h = o.conWidth / o.imgHeight; //最少显示内容宽高比
    var that = jQuery(this);
    var s = that.children(".vitara_slide"); //真正的轮播区域
    if (s.length < 1) return;
    var ul = s.children("ul");
    if (ul.length < 1) return;
    var lis = ul.children("li");
    if (lis.length < 1) return;
    var imgs = lis.find("img");
    if (imgs.length < 1) return;
    firstInit();
    //init();//解决因加载Slide导致页面出现滚动条而宽度不对的问题
    if (lis.length < 2) return; //只有一张图的话初始化一下不启动轮播
    var btns = that.children(".slide_btn");
    var es = that.children(".extra").find("li");
    es.eq(0).addClass("current");
    btns.on(o.e, function() {
      lis.stop(true, true);
      var index = lis.index(lis.filter(".current"));
      if (jQuery(this).hasClass("slide_prev")) {
        index = index - 1;
        if (index < 0) index = lis.length - 1;
      }
      if (jQuery(this).hasClass("slide_next")) {
        index = index + 1;
        if (index >= lis.length) index = 0;
      }
      goTo(index);
    });
    touchEvent.swipeLeft(s[0], function() {
      btns.filter(".slide_next").trigger("click");
    });
    touchEvent.swipeRight(s[0], function() {
      btns.filter(".slide_prev").trigger("click");
    });
    es.on(o.e, function() {
      lis.stop(true, true);
      var index = es.index(jQuery(this));
      goTo(index);
    });
    var _loop = setInterval(loop, o.speed);
    that.hover(
      function() {
        lis.stop(true, true);
        clearInterval(_loop);
      },
      function() {
        lis.stop(true, true);
        _loop = setInterval(loop, o.speed);
      }
    );

    //第一次加载时要做的初始化
    function firstInit() {
      var html = '<div class="extra"><ul class="ul_' + imgs.length + '">';
      var i = 1;
      imgs.each(function() {
        html +=
          '<li><i class="sign icon-circle-empty"></i><span class="num">' +
          i +
          '</span><img src="' +
          jQuery(this).attr("src") +
          '" class="thumb" alt="thumb"><span class="title">' +
          jQuery(this).attr("data-title") +
          "</span></li>";
        i++;
      });
      html += "</ul></div>";
      that.append(html);
      that.append(
        '<span class="slide_btn slide_prev"><i class="icon-left"></i></span>'
      );
      that.append(
        '<span class="slide_btn slide_next"><i class="icon-right"></i></span>'
      );
      lis.eq(0).addClass("current");
      init();
      that.removeClass("no-js");
      that.find(".slide_loading").hide();
      jQuery(window).on("resize", init);
    }
    //初始化外观,样式
    function init() {
      var w = s.width();
      var btns = that.children(".slide_btn");
      lis.stop(true, true);
      s.height(h());
      lis.width(w);
      lis.height(h());
      imgs.width(w_h * h());
      imgs.height(h());
      imgs.css("margin-left", 0 - (w_h * h()) / 2);
      switch (o.animate) {
        case "leftToRight":
          lis.css("float", "left");
          ul.width(lis.length * w);
          break;
        case "rightToLeft":
          lis.css("float", "right");
          ul.width(lis.length * w);
          //ul.css('left',(0-(lis.length-1)*w));
          break;
        case "topToBottom":
          lis.each(function(i) {
            ul.append(lis.eq(lis.length - 1 - i));
          });
          lis = ul.children("li");
          ul.css("top", 0 - (lis.length - 1) * h());
          break;
        case "bottomToTop":
        default:
      }
      btns.css({
        height: h(),
        "line-height": h() + "px"
      });
    }
    //真实使用的高度
    function h() {
      var w = s.width();
      if (w < o.conWidth) {
        return w / c_h;
      }
      if (w >= o.imgWidth) {
        return w / w_h;
      }
      return o.imgHeight;
    }
    //单步动画
    function goTo(eq) {
      var obj = {};
      switch (o.animate) {
        case "leftToRight":
          obj = {
            left: 0 - eq * s.width()
          };
          break;
        case "rightToLeft":
          obj = {
            left: 0 - (lis.length - 1 - eq) * s.width()
          };
          break;
        case "bottomToTop":
          obj = {
            top: 0 - eq * h()
          };
          break;
        case "topToBottom":
          obj = {
            top: 0 - (lis.length - 1 - eq) * h()
          };
          break;
        default:
      }
      ul.animate(obj, 500, function() {
        lis.removeClass("current");
        lis.eq(eq).addClass("current");
      });
      es.removeClass("current");
      es.eq(eq).addClass("current");
    }
    //循环动画
    function loop() {
      var index = lis.index(lis.filter(".current"));
      index = index + 1;
      if (index >= lis.length) index = 0;
      goTo(index);
    }
  }
});

//自动加载
jQuery(document).ready(function() {
  jQuery(".vitara_slide_in").each(function() {
    jQuery(this).slide();
  });
});
/***
	@name:触屏事件
	@param {string} element dom元素
			 {function} fn 事件触发函数
***/
function v_on(obj, ev, fn) {
  if (obj.attachEvent) {
    obj.attachEvent("on" + ev, fn);
  } else {
    obj.addEventListener(ev, fn, false);
  }
}
var touchEvent = {
  /*单次触摸事件*/
  tap: function(element, fn) {
    var startTx, startTy;
    v_on(
      element,
      "touchstart",
      function(e) {
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
      },
      false
    );

    v_on(
      element,
      "touchend",
      function(e) {
        var touches = e.changedTouches[0],
          endTx = touches.clientX,
          endTy = touches.clientY;
        // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
        if (Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6) {
          fn();
        }
      },
      false
    );
  },

  /*两次触摸事件*/
  doubleTap: function(element, fn) {
    var isTouchEnd = false,
      lastTime = 0,
      lastTx = null,
      lastTy = null,
      firstTouchEnd = true,
      body = document.body,
      dTapTimer,
      startTx,
      startTy,
      startTime;
    v_on(
      element,
      "touchstart",
      function(e) {
        if (dTapTimer) {
          clearTimeout(dTapTimer);
          dTapTimer = null;
        }
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
      },
      false
    );
    v_on(
      element,
      "touchend",
      function(e) {
        var touches = e.changedTouches[0],
          endTx = touches.clientX,
          endTy = touches.clientY,
          now = Date.now(),
          duration = now - lastTime;
        // 首先要确保能触发单次的 tap 事件
        if (Math.abs(startTx - endTx) < 6 && Math.abs(startTx - endTx) < 6) {
          // 两次 tap 的间隔确保在 500 毫秒以内
          if (duration < 301) {
            // 本次的 tap 位置和上一次的 tap 的位置允许一定范围内的误差
            if (
              lastTx !== null &&
              Math.abs(lastTx - endTx) < 45 &&
              Math.abs(lastTy - endTy) < 45
            ) {
              firstTouchEnd = true;
              lastTx = lastTy = null;
              fn();
            }
          } else {
            lastTx = endTx;
            lastTy = endTy;
          }
        } else {
          firstTouchEnd = true;
          lastTx = lastTy = null;
        }
        lastTime = now;
      },
      false
    );
    // 在 iOS 的 safari 上手指敲击屏幕的速度过快，
    // 有一定的几率会导致第二次不会响应 touchstart 和 touchend 事件
    // 同时手指长时间的touch不会触发click
    if (~navigator.userAgent.toLowerCase().indexOf("iphone os")) {
      v_on(
        body,
        "touchstart",
        function(e) {
          startTime = Date.now();
        },
        true
      );
      v_on(
        body,
        "touchend",
        function(e) {
          var noLongTap = Date.now() - startTime < 501;
          if (firstTouchEnd) {
            firstTouchEnd = false;
            if (noLongTap && e.target === element) {
              dTapTimer = setTimeout(function() {
                firstTouchEnd = true;
                lastTx = lastTy = null;
                fn();
              }, 400);
            }
          } else {
            firstTouchEnd = true;
          }
        },
        true
      );
      // iOS 上手指多次敲击屏幕时的速度过快不会触发 click 事件
      v_on(
        element,
        "click",
        function(e) {
          if (dTapTimer) {
            clearTimeout(dTapTimer);
            dTapTimer = null;
            firstTouchEnd = true;
          }
        },
        false
      );
    }
  },

  /*长按事件*/
  longTap: function(element, fn) {
    var startTx, startTy, lTapTimer;
    v_on(
      element,
      "touchstart",
      function(e) {
        if (lTapTimer) {
          clearTimeout(lTapTimer);
          lTapTimer = null;
        }
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
        lTapTimer = setTimeout(function() {
          fn();
        }, 1000);
        //e.preventDefault();
      },
      false
    );
    v_on(
      element,
      "touchmove",
      function(e) {
        var touches = e.touches[0],
          endTx = touches.clientX,
          endTy = touches.clientY;
        if (
          lTapTimer &&
          (Math.abs(endTx - startTx) > 5 || Math.abs(endTy - startTy) > 5)
        ) {
          clearTimeout(lTapTimer);
          lTapTimer = null;
        }
      },
      false
    );
    v_on(
      element,
      "touchend",
      function(e) {
        if (lTapTimer) {
          clearTimeout(lTapTimer);
          lTapTimer = null;
        }
      },
      false
    );
  },

  /*滑屏事件*/
  swipe: function(element, fn) {
    var isTouchMove, startTx, startTy;
    v_on(
      element,
      "touchstart",
      function(e) {
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
        isTouchMove = false;
      },
      false
    );
    v_on(
      element,
      "touchmove",
      function(e) {
        isTouchMove = true;
        e.preventDefault();
      },
      false
    );
    v_on(
      element,
      "touchend",
      function(e) {
        if (!isTouchMove) {
          return;
        }
        var touches = e.changedTouches[0],
          endTx = touches.clientX,
          endTy = touches.clientY,
          distanceX = startTx - endTx;
        (distanceY = startTy - endTy), (isSwipe = false);
        if (Math.abs(distanceX) > 20 || Math.abs(distanceY) > 20) {
          fn();
        }
      },
      false
    );
  },

  /*向上滑动事件*/
  swipeUp: function(element, fn) {
    var isTouchMove, startTx, startTy;
    v_on(
      element,
      "touchstart",
      function(e) {
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
        isTouchMove = false;
      },
      false
    );
    v_on(
      element,
      "touchmove",
      function(e) {
        isTouchMove = true;
        e.preventDefault();
      },
      false
    );
    v_on(
      element,
      "touchend",
      function(e) {
        if (!isTouchMove) {
          return;
        }
        var touches = e.changedTouches[0],
          endTx = touches.clientX,
          endTy = touches.clientY,
          distanceX = startTx - endTx;
        (distanceY = startTy - endTy), (isSwipe = false);
        if (Math.abs(distanceX) < Math.abs(distanceY)) {
          if (distanceY > 20) {
            fn();
            isSwipe = true;
          }
        }
      },
      false
    );
  },

  /*向下滑动事件*/
  swipeDown: function(element, fn) {
    var isTouchMove, startTx, startTy;
    v_on(
      element,
      "touchstart",
      function(e) {
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
        isTouchMove = false;
      },
      false
    );
    v_on(
      element,
      "touchmove",
      function(e) {
        isTouchMove = true;
        //e.preventDefault();
      },
      false
    );
    v_on(
      element,
      "touchend",
      function(e) {
        if (!isTouchMove) {
          return;
        }
        var touches = e.changedTouches[0],
          endTx = touches.clientX,
          endTy = touches.clientY,
          distanceX = startTx - endTx;
        (distanceY = startTy - endTy), (isSwipe = false);
        if (Math.abs(distanceX) < Math.abs(distanceY)) {
          if (distanceY < -20) {
            fn();
            isSwipe = true;
          }
        }
      },
      false
    );
  },

  /*向左滑动事件*/
  swipeLeft: function(element, fn) {
    var isTouchMove, startTx, startTy;
    v_on(
      element,
      "touchstart",
      function(e) {
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
        isTouchMove = false;
      },
      false
    );
    v_on(
      element,
      "touchmove",
      function(e) {
        isTouchMove = true;
        e.preventDefault();
      },
      false
    );
    v_on(
      element,
      "touchend",
      function(e) {
        if (!isTouchMove) {
          return;
        }
        var touches = e.changedTouches[0],
          endTx = touches.clientX,
          endTy = touches.clientY,
          distanceX = startTx - endTx;
        (distanceY = startTy - endTy), (isSwipe = false);
        if (Math.abs(distanceX) >= Math.abs(distanceY)) {
          if (distanceX > 20) {
            fn();
            isSwipe = true;
          }
        }
      },
      false
    );
  },

  /*向右滑动事件*/
  swipeRight: function(element, fn) {
    var isTouchMove, startTx, startTy;
    v_on(
      element,
      "touchstart",
      function(e) {
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
        isTouchMove = false;
      },
      false
    );
    v_on(
      element,
      "touchmove",
      function(e) {
        isTouchMove = true;
        e.preventDefault();
      },
      false
    );
    v_on(
      element,
      "touchend",
      function(e) {
        if (!isTouchMove) {
          return;
        }
        var touches = e.changedTouches[0],
          endTx = touches.clientX,
          endTy = touches.clientY,
          distanceX = startTx - endTx;
        (distanceY = startTy - endTy), (isSwipe = false);
        if (Math.abs(distanceX) >= Math.abs(distanceY)) {
          if (distanceX < -20) {
            fn();
            isSwipe = true;
          }
        }
      },
      false
    );
  }
};

jQuery.fn.extend({
  tap: function(fn) {
    return touchEvent.tap(jQuery(this)[0], fn);
  },
  doubleTap: function(fn) {
    return touchEvent.doubleTap(jQuery(this)[0], fn);
  },
  longTap: function(fn) {
    return touchEvent.longTap(jQuery(this)[0], fn);
  },
  swipe: function(fn) {
    return touchEvent.swipe(jQuery(this)[0], fn);
  },
  swipeLeft: function(fn) {
    return touchEvent.swipeLeft(jQuery(this)[0], fn);
  },
  swipeRight: function(fn) {
    return touchEvent.swipeRight(jQuery(this)[0], fn);
  },
  swipeUp: function(fn) {
    return touchEvent.swipeUp(jQuery(this)[0], fn);
  },
  swipeDown: function(fn) {
    return touchEvent.swipeDown(jQuery(this)[0], fn);
  }
});

!(function() {
  var o, i, a, s;
  "function" != typeof Object.create &&
    (Object.create = function(t, e) {
      if ("object" != typeof t && "function" != typeof t)
        throw new TypeError("Object prototype may only be an Object: " + t);
      if (null === t)
        throw new Error(
          "This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument."
        );
      if (void 0 !== e)
        throw new Error(
          "This browser's implementation of Object.create is a shim and doesn't support a second argument."
        );
      function n() {}
      return (n.prototype = t), new n();
    }),
    Array.prototype.forEach ||
      (Array.prototype.forEach = function(t, e) {
        var n, r;
        if (null == this) throw new TypeError(" this is null or not defined");
        var o = Object(this),
          i = o.length >>> 0;
        if ("function" != typeof t)
          throw new TypeError(t + " is not a function");
        for (1 < arguments.length && (n = e), r = 0; r < i; ) {
          var a;
          r in o && ((a = o[r]), t.call(n, a, r, o)), r++;
        }
      }),
    Array.prototype.map ||
      (Array.prototype.map = function(t, e) {
        var n, r, o;
        if (null == this) throw new TypeError(" this is null or not defined");
        var i = Object(this),
          a = i.length >>> 0;
        if ("[object Function]" != Object.prototype.toString.call(t))
          throw new TypeError(t + " is not a function");
        for (e && (n = e), r = new Array(a), o = 0; o < a; ) {
          var s, c;
          o in i && ((s = i[o]), (c = t.call(n, s, o, i)), (r[o] = c)), o++;
        }
        return r;
      }),
    Array.prototype.filter ||
      (Array.prototype.filter = function(t, e) {
        "use strict";
        if (("Function" != typeof t && "function" != typeof t) || !this)
          throw new TypeError();
        var n = this.length >>> 0,
          r = new Array(n),
          o = this,
          i = 0,
          a = -1;
        if (e === undefined)
          for (; ++a != n; ) a in this && t(o[a], a, o) && (r[i++] = o[a]);
        else
          for (; ++a != n; )
            a in this && t.call(e, o[a], a, o) && (r[i++] = o[a]);
        return (r.length = i), r;
      }),
    (Array.prototype.reduce =
      Array.prototype.reduce ||
      function(t, e) {
        if (null == this)
          throw new TypeError(
            "Array.prototype.reduce called on null or undefined"
          );
        if ("function" != typeof t)
          throw new TypeError(t + " is not a function");
        var n,
          r,
          o = this.length >>> 0,
          i = !1;
        for (1 < arguments.length && ((r = e), (i = !0)), n = 0; n < o; ++n)
          this.hasOwnProperty(n) &&
            (i ? (r = t(r, this[n], n, this)) : ((r = this[n]), (i = !0)));
        if (!i)
          throw new TypeError("Reduce of empty array with no initial value");
        return r;
      }),
    Object.keys ||
      (Object.keys =
        ((o = Object.prototype.hasOwnProperty),
        (i = !{ toString: null }.propertyIsEnumerable("toString")),
        (s = (a = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ]).length),
        function(t) {
          if (("object" != typeof t && "function" != typeof t) || null === t)
            throw new TypeError("Object.keys called on non-object");
          var e = [];
          for (var n in t) o.call(t, n) && e.push(n);
          if (i) for (var r = 0; r < s; r++) o.call(t, a[r]) && e.push(a[r]);
          return e;
        }));
})(),
  (window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(t) {
      window.setTimeout(t, 1e3 / 60);
    }),
  (window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    Window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    function(t) {
      window.clearTimeout(t);
    }),
  (function(t) {
    var n = function n(t) {
        return Object.prototype.toString.call(t).slice(8, -1);
      },
      e = function e(t) {
        return function() {
          return !t.apply(null, [].slice.apply(arguments, [0]));
        };
      },
      r = function r(t) {
        return null != t;
      },
      o = Boolean,
      i = function i(t) {
        return !o(t) || 0 == Math.abs(Number(t));
      },
      a = function a(e, n) {
        return (
          e < 1 && (e = 1),
          "function" != typeof n
            ? null
            : function() {
                var t = [].slice.apply(arguments, [0, e]);
                return n.apply(null, t);
              }
        );
      },
      s = function s(e) {
        return "function" != typeof e
          ? null
          : function() {
              var t = [].slice.apply(arguments, [0]).reverse();
              return e.apply(null, t);
            };
      },
      c = function c(e) {
        return "function" != typeof e
          ? null
          : function n() {
              var t = [].slice.apply(arguments, [0]);
              return t.length >= e.length
                ? e.apply(null, t)
                : function() {
                    return n.apply(
                      null,
                      t.concat([].slice.apply(arguments, [0]))
                    );
                  };
            };
      },
      l = c(function l(t, e) {
        return r(console) ? console.log(t, e) : (alert(t), alert(opt)), e;
      }),
      d = function d() {
        var n = [].slice.apply(arguments, [0]).reverse();
        return function() {
          for (
            var t = [].slice.apply(arguments, [0]), e = 0;
            e < n.length;
            e++
          ) {
            if ("function" != typeof n[e])
              return l("the arguments is not a function", n[e]);
            t = n[e].apply(null, [].concat(t));
          }
          return t;
        };
      },
      u = s(d),
      h = c(function h(t, e) {
        return t == e;
      }),
      f = c(function f(t, e) {
        return e < t;
      }),
      m = c(function(t, e) {
        return t < e;
      }),
      p = c(function p(t, e) {
        return h(t, n(e));
      }),
      v = p("Array"),
      g = p("Object"),
      z = p("String"),
      y = p("Number"),
      w = p("Function"),
      b = p("RegExp"),
      k = p("Boolean"),
      _ = p("Date"),
      C = c(function C(t, e) {
        return Array.prototype.map.call(e, t);
      }),
      j = c(function j(t, e) {
        return Array.prototype.filter.call(e, t);
      }),
      x = c(function x(t, e) {
        return Array.prototype.reduce.call(e, t);
      }),
      E = function(t) {
        var e;
        if (g(t))
          for (var n in ((e = {}), t)) t.hasOwnProperty(n) && (e[n] = E(t[n]));
        else e = v(t) ? C(E, t) : t;
        return e;
      },
      T = function(t) {
        var e = [];
        if (g(t))
          for (var n in t)
            t.hasOwnProperty(n) &&
              (g(t[n]) ? e.push([n, T(t[n])]) : e.push([n, t[n]]));
        else e = e.concat(E(t));
        return e;
      };
    t.orz = {
      trace: l,
      arity: a,
      reverseArg: s,
      curry: c,
      compose: d,
      flow: u,
      not: e,
      of: function(t) {
        return function() {
          return t;
        };
      },
      e: h,
      lt: f,
      gt: m,
      getType: n,
      isType: p,
      isArray: v,
      isObject: g,
      isString: z,
      isDate: _,
      isNumber: y,
      isBoolean: k,
      isFunction: w,
      isRegExp: b,
      isExist: r,
      isTrue: o,
      isEmpty: i,
      map: C,
      filter: j,
      reduce: x,
      deepCopy: E,
      toArray: T
    };
  })(window),
  orz &&
    (orz.log = function() {
      var t = Array.prototype.slice.call(arguments, 0);
      window.console
        ? (console.info ? window.console.info : window.console.log).apply(
            null,
            t
          )
        : alert(t);
    }),
  orz &&
    ((orz.match = orz.curry(function(t, e) {
      return !orz.isEmpty(e) && (String.prototype.match.call(e, t) || !1);
    })),
    (orz.replace = orz.curry(function(t, e, n) {
      return orz.isEmpty(n) ? "" : String.prototype.replace.call(n, t, e);
    })),
    (orz.trim = orz.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")),
    (orz.pad = orz.curry(function(t, e, n, r) {
      (t = orz.isTrue(t)), orz.isEmpty(e) && (e = "0"), (e = String(e));
      var o = n - (r = String(r)).length;
      if (o <= 0) return r;
      for (var i = ""; i.length < o; ) i += e;
      return (i = i.substring(0, o)), t ? r + i : i + r;
    })),
    (orz.lpad = orz.pad(!1)),
    (orz.rpad = orz.pad(!0)),
    (orz.strToObj = function(t) {
      var n = {};
      if (orz.isString(t)) {
        t = t.split("&");
        var r = new RegExp("([^=]+)=?([^=]*)", "g");
        t.map(function(t) {
          for (
            var e;
            (e = r.exec(t)) && (n[e[1]] = decodeURIComponent(e[2])), e;

          );
        });
      }
      return n;
    })),
  orz &&
    ((orz.prop = orz.curry(function(t, e) {
      return orz.isObject(t)
        ? t[e]
          ? t[e]
          : orz.trace(e + " is not a prop in the object", t[e])
        : orz.trace("the first argument is not an object", null);
    })),
    (orz.props = function(t) {
      return orz.isObject(t)
        ? Object.keys(t)
        : orz.trace("the argument is not an object", []);
    }),
    (orz.objToStr = function(t) {
      var e = "";
      if (orz.isObject(t)) {
        for (var n in ((e = []), t))
          t.hasOwnProperty(n) &&
            e.push(n + "=" + encodeURIComponent(orz.objToStr(t[n])));
        e = e.join("&");
      }
      return orz.isString(t) && (e = t), e;
    }),
    (orz.joinObject = function(t, e) {
      var n = {};
      if (orz.isObject(t) && orz.isObject(e)) {
        for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
        n = t;
      }
      return n;
    })),
  orz &&
    ((orz.dateFormat = function(t) {
      if (orz.isDate(t)) return t;
      if (orz.isString(t)) {
        var e = orz.match(
          /^[012]\d{3}[-\/][01]\d[-\/][0-3]\d(\s+[0-2]\d(:[0-5]\d(:[0-5]\d)?)?)?/gi,
          t
        );
        return orz.isEmpty(e)
          ? new Date(t)
          : new Date(orz.replace(/\-/g, "/", e[0]));
      }
      return orz.isNumber(t) ? new Date(t) : new Date("error");
    }),
    (orz.dateDiff = function(t, e, n) {
      if (
        ((e = orz.dateFormat(e).getTime()),
        (n = orz.dateFormat(n).getTime()),
        isNaN(e) || isNaN(n))
      )
        return orz.trace("date is error. ", null);
      var r = n - e,
        o = 1;
      switch (t) {
        case "week":
          o = 6048e5;
          break;
        case "day":
          o = 864e5;
          break;
        case "hour":
          o = 36e5;
          break;
        case "minute":
          o = 6e4;
          break;
        case "second":
          o = 1e3;
          break;
        default:
          o = 1;
      }
      return Math.floor(r / o);
    })),
  orz &&
    ((orz.jsonEncode = function(t) {
      return JSON.stringify(t);
    }),
    (orz.jsonDecode = function(t) {
      var e;
      try {
        e = JSON.parse(t);
      } catch (n) {
        (e = null), orz.trace("decode json error: ", n);
      }
      return e;
    })),
  (function() {
    if (orz) {
      function e() {
        return navigator.userAgent;
      }
      var t = orz.not(orz.isEmpty);
      (orz.getDevice = function() {
        var t = e();
        return -1 != t.indexOf("MicroMessenger")
          ? "微信"
          : -1 != t.indexOf("Android")
          ? "Android"
          : -1 != t.indexOf("iPhone")
          ? 812 == screen.height
            ? "iPhone X"
            : "iPhone"
          : -1 != t.indexOf("iPad")
          ? "iPad"
          : -1 != t.indexOf("Safari") && -1 == t.indexOf("Chrome")
          ? "iPad"
          : -1 != t.indexOf("Edge")
          ? "Edge浏览器"
          : -1 != t.indexOf("360SE")
          ? "360浏览器"
          : -1 != t.indexOf("360EE")
          ? "360浏览器"
          : -1 != t.indexOf("Maxthon")
          ? "傲游浏览器"
          : -1 != t.indexOf("Tencent")
          ? "QQ浏览器"
          : -1 != t.indexOf("MetaSr")
          ? "搜狗浏览器"
          : -1 != t.indexOf("Opera")
          ? "Opera浏览器"
          : -1 != t.indexOf("Firefox")
          ? "Firefox浏览器"
          : -1 != t.indexOf("Chrome")
          ? "Chrome浏览器"
          : -1 != t.indexOf("Safari")
          ? "Safari浏览器"
          : -1 != t.indexOf("MSIE")
          ? "IE浏览器"
          : -1 != t.indexOf("like Gecko")
          ? -1 != t.indexOf("OPR")
            ? "Opara浏览器"
            : "IE浏览器"
          : void 0;
      }),
        (orz.getDocument = function(t) {
          return function() {
            return document.documentElement[t] || document.body[t] || 0;
          };
        }),
        (orz.isIos = orz.flow(e, orz.match(/(iPhone|iPod|ios|iPad)/i), t)),
        (orz.isAndroid = orz.flow(e, orz.match(/Android/i), t)),
        (orz.isMobile = orz.flow(
          e,
          orz.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
          ),
          t
        )),
        (orz.isPC = orz.not(orz.isMobile));
    }
  })(),
  orz &&
    (orz.animate = function(t) {
      var e = 0,
        n = 0,
        r = 0,
        o = !1;
      function i() {
        t.call(this), (e = requestAnimationFrame(i));
      }
      return {
        startTime: n,
        stopTime: r,
        start: function() {
          o || ((n = new Date()), (e = requestAnimationFrame(i)), (o = !0));
        },
        stop: function() {
          (r = new Date()), e && cancelAnimationFrame(e), (e = 0), (o = !1);
        }
      };
    }),
  orz &&
    ((orz.urlGet = orz.curry(function(t, e) {
      if (t) {
        for (
          var n, r, o = new RegExp("[?&]" + e + "=([^&]*)", "g");
          (n = o.exec(t)) && (r = n), n;

        );
        if (orz.isArray(r)) return r[1];
      }
      return "";
    })),
    (orz.urlGets = function(t) {
      var e = {};
      if (t)
        for (
          var n, r = new RegExp("[?&]([^=&]+)=?([^&]*)", "g");
          (n = r.exec(t)) && (e[n[1]] = n[2]), n;

        );
      return e;
    }),
    (orz.urlAnchor = function(t) {
      if (t) {
        var e = new RegExp("#([^?&]*)").exec(t);
        if (orz.isArray(e)) return e[1];
      }
      return "";
    }),
    (orz.urlBase = function(t) {
      return orz.isString(t)
        ? ((t = orz.replace(/#.*/, "", t)), (t = orz.replace(/\?.*/, "", t)))
        : orz.trace("url is not a string", "");
    }),
    (orz.getUrl = function(t, e) {
      if (orz.isString(t)) {
        var n = orz.urlGets(t),
          r = orz.urlBase(t);
        orz.isString(e) && (e = orz.strToObj(e)),
          orz.isObject(e) && (n = orz.joinObject(n, e)),
          0 < Object.keys(n).length && (t = r + "?" + orz.objToStr(n));
      }
      return t;
    })),
  orz &&
    ((orz.getCookie = function(t) {
      var e,
        n = new RegExp("(^| )" + t + "=([^;]*)(;|$)");
      return (e = document.cookie.match(n)) ? decodeURIComponent(e[2]) : "";
    }),
    (orz.setCookie = function(t, e, n, r) {
      orz.isExist(n) || (n = 1),
        (n -= 0),
        isNaN(n) && (n = 1),
        orz.isExist(r) ? (path = "") : (path = ";path=/");
      var o = new Date();
      o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3);
      var i = "expires=" + o.toUTCString();
      document.cookie = t + "=" + encodeURIComponent(e) + "; " + i + path;
    }),
    (orz.delCookie = function(t) {
      setCookie(t, "", -1);
    })),
  (function(o) {
    (window.email = "2650232288%40qq.com"),
      (orz.isNotEmpty = orz.not(orz.isEmpty)),
      (clientWidthBigThen = function(t) {
        var e = orz.not(orz.lt(t));
        return orz.flow(orz.getDocument("clientWidth"), e);
      }),
      (orz.lg = clientWidthBigThen(1330)),
      (orz.md = clientWidthBigThen(1024)),
      (orz.sm = clientWidthBigThen(768)),
      (orz.showLogin = function() {
        o('[data-modal-id="modal_login"]').trigger("click");
      }),
      (orz.get_form_item_val = orz.curry(function(t, e) {
        var n = o(e).find('[name="' + t + '"]'),
          r = n.val();
        return r == orz.attr("placeholder", n) && (r = ""), r;
      })),
      (orz.inArray = function(t, e) {
        for (var n = 0; n < e.length; n++) if (e[n] == t) return n;
        return -1;
      }),
      (orz.getDateDiff = function(t) {
        var e = orz.dateDiff("second", t, new Date()),
          n = Math.floor(e / 86400),
          r = Math.floor((e % 86400) / 3600),
          o = Math.floor((e % 3600) / 60),
          i = orz.dateFormat(t),
          a = i.getFullYear(),
          s = orz.lpad("0", 2, i.getMonth() + 1),
          c = orz.lpad("0", 2, i.getDate());
        return 30 < n
          ? a + "-" + s + "-" + c
          : 3 < n
          ? s + "-" + c
          : 0 < n
          ? n + "天前"
          : 0 < r
          ? r + "小时前"
          : 0 < o
          ? o + "分钟前"
          : e < 0
          ? "预计于：" + a + "-" + s + "-" + c + "发表"
          : "刚刚发表";
      }),
      (orz.wrong = function() {
        return !1;
      });
  })(jQuery),
  (function(t) {
    var n = location.hash;
    function r() {
      for (var t = 0; t < orz.hash.length; t++)
        orz.isFunction(orz.hash[t]) && orz.hash[t]();
    }
    (orz.hash = []),
      "onhashchange" in window &&
      ("undefined" == typeof document.documentMode ||
        8 == document.documentMode)
        ? (window.onhashchange = r)
        : setInterval(function() {
            !(function e() {
              var t = location.hash;
              return t != n && ((n = t), !0);
            })() || r();
          }, 150);
  })(jQuery),
  (function(i) {
    (orz.ajax = orz.curry(function(t, e, n, r, o) {
      i.ajax({
        type: t,
        url: "/ajax.php",
        context: o,
        data: r,
        success: n,
        error: e
      });
    })),
      (orz.get = orz.ajax("GET", function() {
        orz.log("ajax get error"), orz.log(this);
      })),
      (orz.post = orz.ajax("POST", function() {
        orz.log("ajax post error"), orz.log(this);
      }));
  })(jQuery),
  (orz._get = function(t) {
    var e = location.search;
    if (e) {
      for (
        var n, r, o = new RegExp(t + "=([^&]*)", "g");
        (n = o.exec(e)) && (r = n), n;

      );
      if (orz.isArray(r)) return r[1];
    }
    return null;
  }),
  (orz.currentPageUrl = function() {
    var t =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "") +
      window.location.pathname;
    return (t = orz.replace(/\/page\/.*$/, "", t));
  }),
  (function(r) {
    (orz.attr = orz.curry(function(t, e) {
      return r(e).attr("data-" + t);
    })),
      (orz.setAttr = orz.curry(function(t, e, n) {
        return r(n).attr("data-" + t, e);
      })),
      (orz.attrEq = orz.curry(function(t, e, n) {
        return orz.attr(t, n) == e;
      })),
      (orz.addClass = orz.curry(function(t, e) {
        return r(e).addClass(t);
      })),
      (orz.removeClass = orz.curry(function(t, e) {
        return r(e).removeClass(t);
      }));
  })(jQuery),
  (function(o) {
    (orz.click = orz.curry(function(t, e) {
      if (orz.isArray(t))
        for (var n = 0; n < t.length; n++)
          orz.isFunction(t[n]) && o("body").on("click", e, t[n]);
      else orz.isFunction(t) && o("body").on("click", e, t);
    })),
      (orz.outClick = orz.curry(function(e, n) {
        o("body").on("click", function(t) {
          t = t || window.event;
          0 == o(t.target).closest(n).length && e.apply(o(n));
        });
      })),
      (orz.hover = orz.curry(function(t, e, n) {
        if (orz.isArray(t))
          for (var r = 0; r < t.length; r++)
            orz.isFunction(t[r]) && o("body").on("mouseenter", n, t[r]);
        else orz.isFunction(t) && o("body").on("mouseenter", n, t);
        if (orz.isArray(e))
          for (r = 0; r < e.length; r++)
            orz.isFunction(e[r]) && o("body").on("mouseleave", n, e[r]);
        else orz.isFunction(e) && o("body").on("mouseleave", n, e);
      })),
      orz.click(function() {
        return !1;
      }, ".disabled");
  })(jQuery),
  jQuery,
  (orz.pending = orz.setAttr("status", "pending")),
  (orz.done = orz.setAttr("status", "done")),
  (orz.disable = orz.setAttr("status", "disable")),
  (orz.enable = orz.setAttr("status", "enable")),
  (orz.init = orz.setAttr("init", "done")),
  (orz.isPending = orz.attrEq("status", "pending")),
  (orz.isDone = orz.attrEq("status", "done")),
  (orz.isDisable = orz.attrEq("status", "disable")),
  (orz.isInit = orz.attrEq("init", "done")),
  (orz.hidden = orz.addClass("hidden")),
  (orz.show = orz.removeClass("hidden")),
  jQuery,
  (orz.scroll = function(e) {
    var n = !1;
    return function(t) {
      n ||
        (window.requestAnimationFrame(function(t) {
          e.call(t), (n = !1);
        }),
        (n = !0));
    };
  }),
  (function(r) {
    !(function n() {
      r(".modal-mark").length < 1 &&
        r("body").append('<div class="mark modal-mark"></div>');
    })();
    var o = orz.attr("modal-id"),
      i = orz.attr("modal-mask"),
      a = orz.attr("modal-login");
    var t = orz.click(function s() {
        var t = o(this),
          e = i(this),
          n = a(this);
        if (t)
          return (
            "need" != n || orz.currentUser
              ? ("no" != e && r(".modal-mark").addClass("modal-show"),
                r("#" + t).trigger("modal.show", r(this)),
                r("#" + t).addClass("modal-show"))
              : r('[data-modal-id="modal_login"]').trigger("click"),
            !1
          );
      }),
      e = orz.click(function c() {
        return (
          r(".modal-show").removeClass("modal-show"),
          r(".modal-show").trigger("modal.close"),
          !1
        );
      });
    t(".modal-open"), e(".modal-close"), e(".modal-mark");
  })(jQuery),
  (orz.get_zan_cookie = function(t) {
    return orz.trim(orz.getCookie(t));
  }),
  (orz.set_zan_cookie = orz.curry(function(t, e) {
    var n = orz.get_zan_cookie(t);
    orz.has_zan_cookie(t, e) || (n = n + "," + e),
      (n = (n = orz.trim(n)).replace(/^,|,$/, "")),
      orz.setCookie(t, n, 365);
  })),
  (orz.has_zan_cookie = orz.curry(function(t, e) {
    var n = orz.get_zan_cookie(t),
      r = new RegExp("(,|^)" + e + "(,|$)");
    return 0 <= n.search(r);
  })),
  (orz.set_post_zan = orz.set_zan_cookie("post_zan")),
  (orz.set_comment_zan = orz.set_zan_cookie("comment_zan")),
  (orz.has_post_zan = orz.has_zan_cookie("post_zan")),
  (orz.has_comment_zan = orz.has_zan_cookie("comment_zan")),
  (function(t) {
    function e(t) {
      var e = orz.trim(t.val()),
        n = orz.trim(t.attr("data-placeholder"));
      e == n && (e = ""),
        orz.isEmpty(e)
          ? (t.val(n), t.addClass("placeholder"), t.addClass("txt_empty"))
          : (t.removeClass("placeholder"), t.removeClass("txt_empty"));
    }
    t("body").on("form.placeholder.ready", function() {
      t("[data-placeholder]").each(function() {
        orz.isInit(this) || (orz.init(this), e(t(this)));
      });
    }),
      t("body").on("focus", "[data-placeholder]", function() {
        orz.trim(t(this).val()) == orz.trim(t(this).attr("data-placeholder")) &&
          t(this).val(""),
          t(this).removeClass("placeholder"),
          t(this).removeClass("txt_empty");
      }),
      t("body").on("blur", "[data-placeholder]", function() {
        e(t(this));
      }),
      t("body").on("submit", "form", function() {
        t(this)
          .find("[data-placeholder]")
          .each(function() {
            orz.trim(t(this).val()) ==
              orz.trim(t(this).attr("data-placeholder")) && t(this).val("");
          });
      }),
      t("body").trigger("form.placeholder.ready");
  })(jQuery),
  (function(l) {
    var d = orz.attr("scrollInit"),
      u = orz.setAttr("scrollInit", "done");
    orz.divNeedScrollInit = function t() {
      orz.isMobile() ||
        "iPad" == orz.getDevice() ||
        l(".divNeedScroll").each(function() {
          var n = this;
          if ("done" != d(this)) {
            function r(t, e) {
              var n = l(e).find(".block"),
                r = l(e).find(".scroll-div"),
                o = parseFloat(n.css("top"));
              (o += t) < 0 && (o = 0), c < o && (o = c);
              var i = Math.ceil((a * o) / s);
              l(e).scrollTop(i), r.css("top", i), n.css("top", o);
            }
            u(this);
            var a = this.scrollHeight,
              s = this.clientHeight,
              o = !1,
              i = 0,
              c = Math.floor((1 - s / a) * s);
            l(window).off(".divNeedScroll"),
              l(this)
                .find(".block")
                .off(".divNeedScroll"),
              l(this).off(".divNeedScroll"),
              l(this).find(".scroll-div").length < 1 &&
                l(this).append(
                  '<div class="scroll-div"><span class="block"></span></div>'
                );
            var t = l(this).find(".scroll-div"),
              e = Math.floor((s / a) * s);
            t.children(".block").css("height", e),
              s < a && orz.sm()
                ? (t.removeClass("hidden"),
                  l(this).on("mousewheel.divNeedScroll", function(t) {
                    var e = t.originalEvent.wheelDelta;
                    return r(0 - 1 * e, this), !1;
                  }),
                  l(this)
                    .find(".block")
                    .on("mousedown.divNeedScroll", function(t) {
                      return (
                        (i = t.clientY),
                        (o = !0),
                        (n = l(this).parents(".divNeedScroll")[0]),
                        !1
                      );
                    }),
                  l(window).on("mouseup.divNeedScroll", function(t) {
                    (i = 0), (o = !1);
                  }),
                  l(window).on("mousemove.divNeedScroll", function(t) {
                    if (o) {
                      var e = t.clientY - i;
                      r(e, n);
                    }
                  }))
                : t.addClass("hidden");
          }
        });
    };
  })(jQuery),
  (function(o) {
    orz.click(function() {
      var t = o(this).attr("href"),
        e = 0 - o(this).attr("data-diff") || -60,
        n = o(t);
      if (!(n.length < 1)) {
        if (
          (n.hasClass("hidden") && (n = n.next()),
          orz.log(n),
          "no" == o(this).attr("data-sm") && !orz.md())
        )
          return !1;
        var r = n.offset();
        return o("html,body").animate({ scrollTop: r.top + e }, 20), !1;
      }
    })('[href^="#"]');
  })(jQuery),
  (function(t) {
    var i = t(".eye-icon em");
    if (!(i.length < 1)) {
      var e,
        a,
        s,
        c = -3.5,
        l = -3.5;
      n(),
        t(window).on("resize", n),
        t(document).on("mousemove", function(t) {
          document.documentElement.clientWidth,
            document.documentElement.clientHeight;
          var e = a - t.pageX,
            n = s - t.pageY,
            r = Math.sqrt(
              Math.pow(3.5, 2) / (Math.pow(Math.abs(e / n), 2) + 1)
            ),
            o = r * Math.abs(e / n);
          (l =
            Math.abs(e) < 15 && Math.abs(n) < 15
              ? (c = -3.5)
              : ((c = 0 < e ? -4 - o : o - 4), 0 < n ? -4 - r : -4 + r)),
            i.css({ "margin-top": l, "margin-left": c });
        });
    }
    function n() {
      (e = i.offset()), (a = Math.ceil(e.left)), (s = Math.ceil(e.top));
    }
  })(jQuery),
  (function(t) {
    orz.click(function() {
      t(".header").hasClass("show-menu")
        ? (t(".mark").trigger("click"),
          t(".mark").removeClass("mark-for-header"),
          t(".header").removeClass("show-menu"))
        : (t(".header").addClass("show-menu"),
          t(".mark").addClass("mark-for-header"));
    })(".h-navi"),
      orz.click(function() {
        t(".header").removeClass("show-menu"),
          t(".mark").removeClass("mark-for-header");
      }, ".mark-for-header");
  })(jQuery),
  (function(n) {
    n(".spark_rm").each(function() {
      var t = n(this).children();
      t.addClass("hidden");
      var e = Math.floor(Math.random() * t.length);
      t.eq(e).removeClass("hidden");
    });
  })(jQuery),
  (function(e) {
    var r = e("#login");
    r.length < 1 ||
      (e(document).on("userLogged", function() {
        var t = orz.currentUser.menus,
          e = t.center;
        r.children("a").removeClass("modal-open"),
          r
            .children("a")
            .children(".avatar")
            .css("background-image", "url(" + orz.currentUser.avatar + ")");
        var n = '<div class="login-down">';
        (n += '<div class="login-div">'),
          (n += '<div class="info">'),
          (n +=
            '<div class="info-thumb"> <i class="thumb" style="background-image:url(' +
            orz.currentUser.avatar +
            ');"></i> </div>'),
          (n += '<h2 class="user-name">' + orz.currentUser.name + "</h2>"),
          (n += '<h4 class="user-info">' + orz.currentUser.info + "</h4>"),
          (n += "</div>"),
          (n += '<div class="main">'),
          (n += '<div class="main-menu">'),
          (n +=
            '<div class="item"><div class="item-content"> <a href="' +
            e +
            '"> <i class="icon-Center"></i> 个人中心 </a> </div></div>'),
          (n +=
            '<div class="item"><div class="item-content"> <a href="' +
            e +
            '#fav"> <i class="icon-1-heart-border"></i> 我收藏的 </a> </div></div>'),
          (n +=
            '<div class="item"><div class="item-content"> <a href="' +
            e +
            '#publish"> <i class="icon-article"></i> 我发布的 </a> </div></div>'),
          t.edit &&
            (n +=
              '<div class="item"><div class="item-content"> <a href="' +
              t.edit +
              '"> <i class="icon-allposts"></i> 文章管理 </a> </div></div>'),
          t.comment &&
            (n +=
              '<div class="item"><div class="item-content"> <a href="' +
              t.comment +
              '"> <i class="icon-comm"></i> 评论管理 </a> </div></div>'),
          t.admin &&
            (n +=
              '<div class="item"><div class="item-content"> <a href="' +
              t.admin +
              '"> <i class="icon-site"></i> 后台管理 </a> </div></div>'),
          (n += "</div>"),
          (n += '<div class="main-menu-2">'),
          (n +=
            '<div class="item"> <a href="' +
            e +
            '#setting"> 帐户管理 </a> </div>'),
          (n +=
            '<div class="item"> <a href="' +
            (t.logout + "&redirect_to=" + decodeURIComponent(location.href)) +
            '"> 安全退出 </a> </div>'),
          (n += "</div>"),
          (n += "</div>"),
          (n += "</div>"),
          (n += "</div>"),
          r.append(n),
          r.addClass("has-children");
      }),
      e(document).on("userNotLogged", function() {
        r
          .children("a")
          .children(".avatar")
          .addClass("avatar-default"),
          e("body").append(
            (function t() {
              return 0 < e(".modal-login-panel").length
                ? ""
                : '<div class="modal-login-panel modal-part" id="modal_login"><div class="login_wrap"><div class="wxlogin-main"><h2> <i class="avatar"></i> 您还没有登录</h2><h4>优设启用更安全省心的 <em><i class="icon-wechat"></i> 微信扫码登录</em></h4><div class="ewm"><iframe id="wechatEwm" src="about:blank" width="288px" height="270px" frameborder="0" sandbox="allow-scripts allow-top-navigation" scrolling="no"></iframe></div><p class="wxlogin-protocol"><label class="checked"><input type="radio" name="check_protocol" checked value="yes"> <i class="ico"></i> 扫码登录即表示您同意并遵守 </label> <a class="link" href="https://www.uisdc.com/agreement" target="_blank">用户协议</a> </p></div><div class="wxlogin-intro"> <p>300万设计师聚集地！优设网是极具人气的设计师平台 <br> 2012年成立至今，一直专注于设计师的学习成长交流</p> </div></div><span class="modal-close"> <i class="icon-close"></i> </span></div>';
            })()
          );
      }),
      orz.click(function(t) {
        t.stopPropagation(),
          t.preventDefault(),
          orz.log(e(this).attr("class")),
          e(this).toggleClass("checked");
      }, ".wxlogin-protocol label"),
      orz.click(function() {
        e(this).hasClass("modal-open") &&
          ("微信" == orz.getDevice()
            ? ((location.href =
                "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf2e43f74fc6a84c7&redirect_uri=" +
                encodeURIComponent(
                  "https://www.uisdc.com/ajax.php?action=wechat_login&redirect=" +
                    location.href
                ) +
                "&state=wechat_login&response_type=code&scope=snsapi_userinfo#wechat_redirect"),
              e("#modal_login").hide())
            : e("#wechatEwm").attr("src", uisdc.loginEWM));
      }, '[data-modal-id="modal_login"]'),
      "微信" == orz.getDevice() &&
        (e(".header .login-panel").addClass("wechat-login"),
        orz.click(function() {
          return !1;
        }, ".header .login-panel .avatar_a")));
  })(jQuery),
  (function(r) {
    var n = r(".auto_menu");
    if (!(n.length < 1)) {
      var t = r(".fixed-right .menus");
      if (!(t.length < 1)) {
        var e = r(".widget-article-menu");
        e.length < 1 ||
          (e.removeClass("hidden"),
          e.append(
            (function a() {
              var e = '<h2 class="widget-title">文章目录</h2>';
              return (
                (e += '<div class="widget-content divNeedScroll"><ul>'),
                n.each(function() {
                  var t = "menu_" + n.index(r(this));
                  r(this).attr("id", t),
                    (e +=
                      '<li> <a href="#' +
                      t +
                      '">' +
                      r(this).text() +
                      "</a> </li>");
                }),
                (e += "</ul></div>")
              );
            })()
          ),
          t.prepend(
            '<span class="item article_menu"> <a href="#article_menu" data-sm="no"> <i class="icon-menu-font"></i> </a> </span>'
          ),
          orz.divNeedScrollInit(),
          orz.click(function() {
            if (!orz.md()) {
              var t = r(this).attr("href");
              return (
                o(t)
                  ? i(t)
                  : (function e(t) {
                      r(t).addClass("show_fixed");
                    })(t),
                !1
              );
            }
          }, ".article_menu a"),
          r("body").on("click", function(t) {
            if (!orz.md()) {
              t = t || window.event;
              var e = "#article_menu";
              o(e) && i(e);
            }
          }),
          orz.click(function() {
            if (!orz.md()) {
              var t = "#article_menu";
              o(t) && i(t);
            }
          }, "#article_menu a"),
          r(window).on("scroll", function() {
            var e =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0,
              n = 0;
            r(".auto_menu").map(function(t) {
              r(this).offset().top < e + 70 && (n = t);
            }),
              n < 0 && (n = 0),
              orz.log(n),
              r(".sidebar-fixed .widget-article-menu li")
                .removeClass("current")
                .eq(n)
                .addClass("current");
          }));
      }
    }
    function o(t) {
      return r(t).hasClass("show_fixed");
    }
    function i(t) {
      r(t).removeClass("show_fixed");
    }
  })(jQuery),
  (function(n) {
    function t() {
      var e = this;
      return (
        (a = new Date().getTime()),
        (i = setTimeout(function() {
          var t = r(e);
          s(".part-dropdown"),
            n("#" + t).addClass("show"),
            "no" == o(e) && n("body").addClass("hideScroll");
        }, 100)),
        !1
      );
    }
    var r = orz.attr("target"),
      o = orz.attr("body-scroll"),
      e = orz.removeClass("show"),
      i = 0,
      a = 0,
      s = function() {
        clearTimeout(i),
          e(".part-dropdown"),
          n("body").removeClass("hideScroll");
      };
    orz.hover(s, null)('.header a:not([data-component="dropdown-click"])'),
      orz.hover(
        t,
        function() {
          new Date().getTime() - a < 100 && s();
        },
        '[data-component="dropdown"]'
      ),
      orz.outClick(s, ".part-dropdown .container"),
      orz.hover(
        null,
        function() {
          n(".part-dropdown.show").hasClass("dropdown-search") || s();
        },
        ".part-dropdown .container"
      ),
      orz.click(t, '[data-component="dropdown-click"]'),
      orz.click(s, ".dropdown-close"),
      n("body").on("mouseleave", function(t) {
        t.clientY <= 0 && s();
      });
  })(jQuery),
  (function(s) {
    s("[data-component=simpleUpSlide]").each(function() {
      var t = s(this).children("ul");
      if (!(t.length < 1)) {
        var e = t.children("li");
        if (!(e.length < 1)) {
          var n = 1e3,
            r = 3e3,
            o = e.outerHeight(),
            i = 0;
          setTimeout(function a() {
            ++i >= e.length && (i = 0),
              t.animate({ top: 0 - i * o }, n),
              setTimeout(a, r);
          }, r);
        }
      }
    });
  })(jQuery),
  (function(i) {
    function a(t) {
      i(t).removeClass("hidden");
    }
    function s(t) {
      i(t)
        .children()
        .addClass("hidden");
    }
    function c(t) {
      i(t).removeClass("current");
    }
    function l(t) {
      i(t).addClass("current");
    }
    function d(t) {
      var e = u(this),
        n = h(this),
        r = f(this);
      if (
        (m(this),
        orz.isNotEmpty(t) && ((t = orz.jsonDecode(t)), orz.isNotEmpty(t)))
      ) {
        var o = t.data;
        orz.isNotEmpty(o) &&
          ((function(t, e, n) {
            var r = "",
              o = p(t);
            orz.map(function(t, e) {
              r += g[o](t, e);
            }, e),
              i(n).html(r);
          })(this, o, n),
          s(e),
          a(n),
          c(r),
          l(this));
      }
    }
    function t(t) {
      var e = u(t),
        n = h(t),
        r = f(t),
        o = { action: m(t), ppp: v(t) };
      return (
        !(function(t) {
          return 0 < i(t).children().length;
        })(n)
          ? orz.post(d, o, t)
          : (s(e), a(n), c(r), l(t)),
        !1
      );
    }
    var e = '[data-component="tab"]',
      u = orz.attr("tab-wrap"),
      h = orz.attr("tab-target"),
      f = orz.attr("tab-menus"),
      m = orz.attr("tab-action"),
      p = orz.attr("tab-type"),
      v = orz.attr("ppp"),
      n = orz.attr("event"),
      g = {
        "list-default": function(t) {
          var e = '<div class="list-item-default flex">';
          return (
            (e += '<div class="item-thumb">'),
            (e +=
              '<a href="' +
              t.href +
              '" class="h-scale" target="_blank"> <i class="thumb " style="background-image:url(' +
              t.img +
              ')"></i> </a>'),
            (e += "</div>"),
            (e += '<div class="item-content">'),
            (e += '<a href="' + t.href + '" target="_blank">'),
            (e += '<h2 class="title">  ' + t.title + "  </h2>"),
            (e += "<p>" + t.content + "</p>"),
            (e += "</a>"),
            (e +=
              '<h4> <i class="views">' +
              t.views +
              ' 人阅读</i> <i class="time">' +
              t.time +
              '</i> <i class="author"> '),
            t.uLink && (e += '<a href="' + t.uLink + '" target="_blank"> '),
            (e += t.author),
            t.uLink && (e += " </a>"),
            (e += " </i>"),
            (e += "</h4>"),
            (e += "</div>"),
            (e += "</div>")
          );
        },
        "list-simple": function(t, e) {
          return (
            '<li class="list-item-txt"> <h2 class="title"> <a href="' +
            t.href +
            '" target="_blank"> <span class="num">' +
            (e + 1) +
            "</span> " +
            t.title +
            " </a> </h2> </li>"
          );
        },
        "list-post": function(t) {
          var e =
            '<li class="item"><h2 class="title"> <a href="' +
            t.href +
            '" target="_blank"> ' +
            t.title +
            ' </a> </h2><h4><i class="time">' +
            t.time +
            '</i><i class="author">推荐： <a href="' +
            t.uLink +
            '" target="_blank"> ' +
            t.author +
            ' </a> </i><span class="tags">';
          return (
            t.tags &&
              orz.isArray(t.tags) &&
              orz.map(function(t) {
                e +=
                  '<a href="/tag/' +
                  t.slug +
                  '" target="_blank">' +
                  t.name +
                  "</a>";
              }, t.tags),
            (e += "</span></h4></li>")
          );
        }
      },
      r = orz.click(function() {
        if ("hover" != n(this)) return t(this);
      }),
      o = orz.hover(function() {
        "hover" == n(this) && t(this);
      }, i.noop);
    r(e), o(e);
  })(jQuery),
  (function(l) {
    var d = orz.attr("start"),
      u = orz.attr("end"),
      h = orz.attr("top");
    function t() {
      orz.md() &&
        l('[data-component="autofixed"]').each(function() {
          document.documentElement.clientHeight;
          var t =
              window.pageYOffset ||
              document.documentElement.scrollTop ||
              document.body.scrollTop ||
              0,
            e = l(this),
            n = l(d(e)),
            r = l(u(e)),
            o = n.offset().top,
            i = r.offset().top,
            a = h(e),
            s = o - a,
            c = i + r.outerHeight() - e.outerHeight() - a;
          e.removeClass("autofixed-fixed"),
            e.removeClass("autofixed-absolute"),
            s <= t && t <= c && e.addClass("autofixed-fixed"),
            c < t && e.addClass("autofixed-absolute");
        });
    }
    t(), l(window).on("scroll", orz.scroll(t)), l(window).resize(t);
  })(jQuery),
  (function(i) {
    var a = orz.attr("autofixed");
    !(function t() {
      i('[data-component="sidebar-autofixed"]').each(function() {
        var t = a(this),
          e = i(this).children(".sidebar-fixed");
        if (orz.isNotEmpty(t)) {
          var n = i(t);
          if (0 < n.length) {
            var r = i(this).children(".widget"),
              o = (r.length, !1);
            n.each(function() {
              var t = n.index(i(this));
              o = i(this)[0] == r.eq(r.length - n.length + t)[0];
            }),
              e.append(n.clone(!0, !0)),
              o && (n.addClass("hidden"), e.addClass("show"));
          }
        }
      });
    })();
  })(jQuery),
  (function(a) {
    var s = "[data-component=fav]";
    function n(t) {
      return a(t).attr("data-id");
    }
    function i(t, e) {
      var n = (function o(t) {
          return a(t).attr("data-count") || 0;
        })(t),
        r = (function i(t) {
          return a(t).attr("data-original-count") || 0;
        })(t);
      (e = 0 < e ? r - 0 + e : n - 0 + e),
        a(s)
          .filter('[data-id="' + a(t).attr("data-id") + '"]')
          .children("em")
          .html(e),
        a(s)
          .filter('[data-id="' + a(t).attr("data-id") + '"]')
          .attr("data-count", e);
    }
    function c() {
      a(s).each(function() {
        a(this).removeClass("has_fav"),
          d(n(a(this)))
            ? (a(this).addClass("has_fav"),
              a(this)
                .find(".txt")
                .html("已收藏"),
              (function e(t) {
                return i(t, 1);
              })(this))
            : a(this)
                .find(".txt")
                .html("收藏");
      });
    }
    function l() {
      return orz.currentUser.fav || [];
    }
    function d(t) {
      var e = l();
      return 0 <= orz.inArray(t, e);
    }
    var t = orz.click(function() {
      if (!orz.currentUser) return orz.showLogin(), !1;
      var t = n(this);
      return (
        d(t)
          ? ((function r(e) {
              if (d(e)) {
                var t = l();
                (t = orz.filter(function(t) {
                  return t != e;
                }, t)),
                  (orz.currentUser.fav = t);
                var n = {
                  action: "fav",
                  do: "remove",
                  uid: orz.currentUser.id,
                  pid: e
                };
                orz.post(a.noop, n, this);
              }
            })(t),
            (function e(t) {
              return i(t, -1);
            })(this))
          : (function o(t) {
              if (!d(t)) {
                var e = l();
                e.unshift(t - 0), (orz.currentUser.fav = e);
                var n = {
                  action: "fav",
                  do: "add",
                  uid: orz.currentUser.id,
                  pid: t
                };
                orz.post(
                  function(t) {
                    (t && (t = orz.jsonDecode(t)) && "done" == t.data) ||
                      ((location.href = location.href + "#login"),
                      location.reload());
                  },
                  n,
                  this
                );
              }
            })(t),
        c(),
        !1
      );
    });
    a(document).on("userLogged", c), t(s);
  })(jQuery),
  (function(o) {
    var t = "[data-component=zan]",
      n = orz.post(function(t) {
        orz.done(this);
      }),
      e = orz.click(function() {
        if (!orz.isPending(this)) {
          var t = (function(t) {
              return {
                action: "zan",
                pid: orz.attr("pid", o(t)),
                cid: orz.attr("cid", o(t))
              };
            })(this),
            e = n(t);
          orz.pending(this),
            o(this).hasClass("has_zan")
              ? orz.done(this)
              : (e(this),
                (function(t) {
                  var e = orz.attr("pid", o(t)),
                    n = orz.attr("cid", o(t));
                  0 < e ? orz.set_post_zan(e) : 0 < n && orz.set_comment_zan(n);
                })(this),
                orz.zanInit());
        }
      });
    function r(t, e) {
      var n = (function r(t) {
        return o(t).attr("data-count") || 0;
      })(t);
      o(t)
        .children(".count")
        .html(n - 0 + e);
    }
    (orz.zanInit = function() {
      o(t).each(function() {
        o(this).removeClass("has_zan"),
          (function(t) {
            var e = orz.attr("pid", o(t)),
              n = orz.attr("cid", o(t));
            return 0 < e
              ? orz.has_post_zan(e)
              : 0 < n && orz.has_comment_zan(n);
          })(this) &&
            (o(this).addClass("has_zan"),
            o(this)
              .find(".txt")
              .html("已赞"),
            (function e(t) {
              return r(t, 1);
            })(this));
      });
    }),
      e(t),
      orz.zanInit();
  })(jQuery),
  (function(l) {
    var d = ".img-zoom",
      e = ".img-pn-btn",
      u = 0,
      h = 0,
      t = orz.click(function() {
        document.documentElement.clientWidth;
        if (!orz.md()) return !1;
        l(this).hasClass("zoom_in")
          ? (r(), n())
          : ((function c(t) {
              var e = document.documentElement.clientWidth,
                n = l(t).height(),
                r = l(t).outerWidth(),
                o = l(t).offset(),
                i =
                  window.pageYOffset ||
                  document.documentElement.scrollTop ||
                  document.body.scrollTop ||
                  0;
              (nw = e), (u = i);
              var a = 0 - o.left + e / 2 - r / 2,
                s = i - o.top + 58;
              (h = l(d).index(l(t))),
                l(t).addClass("zoom_in"),
                l(t).css({
                  transform: "translate(" + a + "px," + s + "px)",
                  width: r,
                  height: n
                }),
                l(t)
                  .children("img")
                  .css({ "max-width": e }),
                l(".modal-mark").addClass("modal-show"),
                l(".modal-mark").addClass("modal-show-for-img");
            })(this),
            (function t() {
              l(e).addClass("show");
            })());
      });
    function n() {
      l(e).removeClass("show");
    }
    function r() {
      var t = l(".zoom_in");
      t.length < 1 ||
        (t.removeClass("zoom_in"),
        t.css({ transform: "none", width: "auto", height: "auto" }),
        t.children("img").css({ "max-width": "100%" }),
        l(".modal-mark").removeClass("modal-show"),
        l(".modal-mark").removeClass("modal-show-for-img"),
        l("html,body").scrollTop(u));
    }
    orz.click(r, ".modal-show-for-img"),
      (function o() {
        1 < l(d).length &&
          l("body").append(
            '<span class="prev-img img-pn-btn"> <i class="icon-left"></i> </span> <span class="next-img img-pn-btn"> <i class="icon-right"></i> </span>'
          );
      })(),
      t(d),
      orz.click(function(t) {
        t.stopPropagation(), t.preventDefault();
        var e = h;
        return (
          l(this).hasClass("prev-img")
            ? --e <= 0 && (e = 0)
            : ++e >= l(d).length && l(d).length,
          e != h &&
            l(d)
              .eq(h)
              .trigger("click"),
          l(d)
            .eq(e)
            .trigger("click"),
          !1
        );
      }, e),
      orz.click(n, ".modal-mark");
  })(jQuery),
  (function(n) {
    function t(t) {
      var e = o(t);
      n(e).addClass("show");
    }
    function e(t) {
      var e = o(t);
      n(e).removeClass("show");
    }
    var r = '[data-component="open-division"]',
      o = orz.attr("target"),
      i = orz.attr("event"),
      a = orz.click(function() {
        return "click" == i(this) && t(this), !1;
      }),
      s = orz.outClick(function() {
        "click" == i(this) && e(this);
      }),
      c = orz.hover(
        function() {
          "hover" == i(this) && t(this);
        },
        function() {
          "hover" == i(this) && e(this);
        }
      );
    a(r), s(r), c(r);
  })(jQuery),
  (function(f) {
    function m(t) {
      f(t).removeClass("disable");
    }
    function p(t) {
      f(t).addClass("disable");
    }
    function e(t, e) {
      var n = f(t).children("ul");
      if (1 == n.length) {
        var r = n.children("li");
        if (!(r.length < 1)) {
          n.stop(!0, !0);
          var o =
              f(t).width() -
              f(t)
                .children(".fy")
                .outerWidth(),
            i = n.width(),
            a = r.filter(".current");
          a.length < 1 && (a = r.eq(0));
          var s = r.index(a),
            c = s - e,
            l = 0,
            d = 0;
          if (e < 0)
            for (d = s; d < r.length && ((c = d), l < o); d++)
              l += r.eq(d).outerWidth();
          else
            for (d = s - 1; 0 <= d && l < o; d--)
              (l += r.eq(d).outerWidth()), (c = d);
          c >= r.length - 1 &&
            ((c = r.length - 1), (l -= r.eq(r.length - 1).outerWidth())),
            c < 0 && (c = 0);
          var u = parseFloat(n.css("left"));
          0 < c ? m(f(t).find(".prev")) : p(f(t).find(".prev"));
          var h = u + e * l;
          0 <= h && (h = 0),
            i <= o - h ? p(f(t).find(".next")) : m(f(t).find(".next")),
            n.animate({ left: h }, 50, function() {
              orz.log(c),
                r
                  .removeClass("current")
                  .eq(c)
                  .addClass("current");
            });
        }
      }
    }
    function o(t) {
      return e(t, 1);
    }
    function i(t) {
      return e(t, -1);
    }
    function t() {
      f(".auto-scroll-menu").each(function() {
        var t = f(this),
          e = f(this).children("ul");
        1 == e.length &&
          (t.width() < e.width()
            ? (function n(t) {
                f(t).hasClass("need-scroll") ||
                  (f(t).addClass("need-scroll"),
                  f(t).append(
                    '<div class="fy"><span class="prev disable"><i class="icon-left"></i></span><span class="next"><i class="icon-right"></i></span></div>'
                  ),
                  f(t)
                    .find(".fy span")
                    .on("click", function() {
                      f(this).hasClass("disable") ||
                        (f(this).hasClass("prev") ? o(t) : i(t));
                    }),
                  touchEvent.swipeRight(f(t)[0], function() {
                    o(t);
                  }),
                  touchEvent.swipeLeft(f(t)[0], function() {
                    i(t);
                  }));
              })(t)
            : (function r(t) {
                f(t).removeClass("need-scroll"),
                  f(t)
                    .children(".fy")
                    .remove();
              })(t));
      });
    }
    setTimeout(t, 10), f(window).on("resize", t);
  })(jQuery),
  (function(t) {
    var e = t(".article-menus");
    function n() {
      if (orz.md())
        e.children(".menu-r")
          .children("ul")
          .children(".menu-item")
          .remove();
      else {
        if (
          0 <
          e
            .children(".menu-r")
            .children("ul")
            .children(".menu-item").length
        )
          return;
        e
          .children(".menu-r")
          .children("ul")
          .prepend(
            e
              .children(".menu")
              .children("li")
              .clone(!0, !0)
          ),
          e
            .children(".menu-r")
            .find(".menu-item a")
            .attr("data-tab-menus", ".article-menus .menu-r a");
      }
    }
    e.length < 1 || (n(), t(window).on("resize", n));
  })(jQuery),
  (function(l) {
    l(".scroll-h").each(function() {
      var t = l(this),
        e = t.children("ul");
      if (!(e.length < 2)) {
        var n = 0,
          r = e.length,
          o = t
            .parent()
            .siblings(".hf-widget-title")
            .children(".pages");
        !(function c() {
          0 < o.length ||
            (t
              .parent()
              .siblings(".hf-widget-title")
              .append(
                '<div class="pages"><i class="prev"> <i class="icon-left"></i> </i><i class="next"> <i class="icon-right"></i> </i></div>'
              ),
            (o = t
              .parent()
              .siblings(".hf-widget-title")
              .children(".pages")));
        })();
        var i = o.children(".prev"),
          a = o.children(".next");
        i.on("click", function() {
          !(function t() {
            --n < 0 && (n = r - 1);
          })(),
            s();
        }),
          a.on("click", function() {
            !(function t() {
              r <= ++n && (n = 0);
            })(),
              s();
          }),
          touchEvent.swipeLeft(this, function() {
            a.trigger("click");
          }),
          touchEvent.swipeRight(this, function() {
            i.trigger("click");
          });
      }
      function s() {
        e.addClass("holdon"),
          e.removeClass("holdon-prev"),
          e.eq(n).removeClass("holdon"),
          e.eq(n - 1).addClass("holdon-prev");
      }
    });
  })(jQuery),
  (function(r) {
    var o = r(".fixed-sidebar");
    function t() {
      var t = document.documentElement.clientWidth,
        e = r(".header .container").outerWidth(),
        n = 0 - e / 2;
      o.removeClass("only-icon"),
        o.css({ "margin-left": n }),
        orz.show(o),
        (t - e) / 2 < o.outerWidth() && o.addClass("only-icon");
    }
    o.length < 1 || (t(), r(window).on("resize", t));
  })(jQuery),
  (function(e) {
    var t = e(".modal-menu");
    if (!(t.length < 1)) {
      var n = t.children(".modal-content");
      if (!(n.length < 1)) {
        var r = e(".search-content .form"),
          o = e(".menu-primary");
        !(function i() {
          n.append(r.clone()),
            n.append(
              o
                .clone()
                .attr("class", "menu")
                .attr("id", "")
            ),
            n.find('[data-component="dropdown"]').each(function() {
              var t = e("#" + e(this).attr("data-target"));
              t.length < 1 ||
                (e(this)
                  .parent()
                  .addClass("has-children"),
                e(this).after(
                  t
                    .find(".section-content")
                    .eq(0)
                    .clone()
                    .addClass("sub-nav")
                ),
                e(this).attr("data-component", ""));
            }),
            n.append(
              e(
                '<div class="site-info">优设网是国内极具人气的设计平台 <br> 2012年成立至今，一直专注于设计师的学习成长交流</div>'
              )
            );
        })(),
          orz.click(function() {
            return (
              e(this)
                .parent()
                .hasClass("show") ||
                e(".modal-menu .has-children").removeClass("show"),
              e(this)
                .parent()
                .toggleClass("show"),
              !1
            );
          }, ".modal-menu .has-children .link-0");
      }
    }
  })(jQuery),
  (function(t) {
    var s = 0,
      c = document.getElementsByTagName("body")[0],
      l =
        "富强,民主,文明,和谐,自由,平等,公正,法治,爱国,敬业,诚信,友善,你太棒了~,你发现了~,优设~,隐藏彩蛋！,你知道吗？,蓝剑蓝剑天下无敌！,学设计从这里开始,最后,优设,谢谢你,一直的支持,爱你哟~";
    (l = l.split(",")),
      orz.click(function(t) {
        var e = document.createElement("b"),
          n = 0;
        (e.style.color = "#ff5c00"),
          (e.style.zIndex = 9999),
          (e.style.position = "absolute"),
          (e.style.select = "none");
        var r = t.pageX,
          o = t.pageY;
        (e.style.left = r - 10 + "px"),
          (e.style.top = o - 20 + "px"),
          clearInterval(i),
          ++s % 2 == 1
            ? (e.innerText = "❤")
            : ((n = ((s / 2) % l.length) - 1) < 1 && (n = l.length - 1),
              (e.innerText = l[n])),
          (e.style.fontSize = 10 * Math.random() + 8 + "px");
        var i,
          a = 0;
        setTimeout(function() {
          i = setInterval(function() {
            150 == ++a && (clearInterval(i), c.removeChild(e)),
              (e.style.top = o - 20 - a + "px"),
              (e.style.opacity = (150 - a) / 120);
          }, 8);
        }, 70),
          c.appendChild(e);
      }, '[data-bubble="yes"]');
  })(jQuery),
  (function(t) {
    var e = t(".all-zt-main");
    if (!(e.length < 1)) {
      function n() {
        e.find(".more").removeClass("hidden"), o.removeClass("show");
      }
      var r = e.children(".item"),
        o = e.parent().siblings(".zt-rest");
      0 < o.length &&
        (0 < e.find(".more").length ||
          r
            .eq(8)
            .after(
              '<span class="item more"> <a href="#"><em>更多 <i class="icon-right"></i> </em></a> </span>'
            ),
        e.find(".more").on("click", function() {
          return t(this).addClass("hidden"), o.addClass("show"), !1;
        }),
        orz.outClick(n, ".all-zt .container"),
        orz.hover(t.noop, n, ".all-zt .container"));
    }
  })(jQuery),
  jQuery(function(t) {
    var e = t(".single-post");
    if (
      (e.length < 1 && (e = t(".single-hunter")),
      e.length < 1 && (e = t(".single-talk")),
      e.length < 1 && (e = t(".single-job")),
      !(e.length < 1))
    ) {
      var n,
        r,
        o = orz.match(/\bpostid-(\d+)\b/),
        i = ((n = t(e).attr("class")), (r = o(n)), orz.isArray(r) ? r[1] : 0),
        a = { action: "views", id: i };
      0 < i && orz.post(function() {}, a, this);
    }
  }),
  (function(r) {
    if (!(r(".news-body").length < 1)) {
      var o = r("[data-component=news-more]"),
        i = r("[data-component=loading]"),
        a = r(".news-content"),
        s = orz.attr("paged"),
        c = function(t, e) {
          orz.setAttr("paged", e, t);
        },
        t = orz.click(function() {
          return (
            o.hide(),
            i.show(),
            (function e() {
              var t = { action: "get_news", pd: s(o) };
              orz.post(n, t, null);
            })(),
            !1
          );
        });
      i.hide(), l(), t("[data-component=news-more] .btn");
    }
    function l() {
      var t = r("[data-views=no]");
      if (!(t.length < 1)) {
        var e = [];
        t.each(function() {
          e.push(orz.attr("pid", this));
        });
        var n = { action: "views", ids: e };
        orz.post(function() {}, n, null), t.attr("data-views", "yes");
      }
    }
    function n(t) {
      if (!orz.isEmpty(t)) {
        var e = (t = orz.jsonDecode(t)).data,
          n = t.total - 0;
        if (!orz.isEmpty(e)) {
          a.append(e);
          var r = s(o);
          (r -= 0), ++r < n && (c(o, r), o.show()), l();
        }
      }
      i.hide();
    }
  })(jQuery),
  (function(e) {
    function n() {
      return 0 < e("#qr").length;
    }
    var r = orz.attr("url");
    orz.click(function() {
      var t = r(this);
      return (
        orz.log(n()),
        n() ||
          e("body").append(
            '<div id="qr" class="qr_box modal-qr modal-show"><div class="show_qr"><h2>把好文章收藏到微信</h2><div id="url_qr"></div><p>打开微信，扫码分享<br>学设计 <span>优设网</span> 在这里</p><span class="close modal-close" data-modal-id="qr"><i class="icon-close"></i></span></div></div>'
          ),
        (function(t) {
          e("#url_qr").html(""), e("#url_qr").qrcode({ text: t });
        })(t),
        !1
      );
    })('[data-modal-id="qr"]');
  })(jQuery),
  (function(t) {
    orz.click(function() {
      t(this)
        .siblings(".share-div")
        .toggleClass("show");
    }, ".gongneng .btn-share"),
      orz.outClick(function() {
        t(".share-div").removeClass("show");
      }, ".gongneng .btn-share");
  })(jQuery),
  (function(r) {
    var o = 0;
    orz.click(function(t) {
      clearTimeout(o),
        r(".copyTip").remove(),
        r(this)
          .children(".copy-content")
          .select(),
        document.execCommand("copy");
      return (
        (function n(t, e) {
          r("body").append('<div class="copyTip">' + t + "</div>"),
            (o = setTimeout(function() {
              var t = r(e).offset();
              orz.log(t),
                r(".copyTip").addClass("show"),
                r(".copyTip").css({
                  left: t.left + r(e).outerWidth() / 2 - 20,
                  top: t.top - r(".copyTip").outerHeight() - 15
                });
            }, 50)),
            (o = setTimeout(function() {
              r(".copyTip").removeClass("show");
            }, 500)),
            (o = setTimeout(function() {
              r(".copyTip").remove();
            }, 1e3));
        })("已复制", this),
        !1
      );
    }, ".copy-link");
  })(jQuery),
  (function(n) {
    var o = orz.attr("url"),
      i = orz.attr("title");
    orz.click(function() {
      var t = o(this),
        e = i(this);
      return (
        orz.isEmpty(t) && (t = location.href),
        orz.isEmpty(e) && (e = n("title").text()),
        (function r(t, e) {
          try {
            window.external.addFavorite(e, t);
          } catch (n) {
            try {
              window.sidebar.addPanel(t, e, "");
            } catch (n) {
              alert(
                "抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加"
              );
            }
          }
        })(e, t),
        !1
      );
    }, ".btn-fav");
  })(jQuery),
  (function(t) {
    var e = t(".page-sidebar");
    function n() {
      e.css({ "margin-left": 0 - t(".page-content").width() / 2 }),
        e.addClass("show");
    }
    e.length < 1 || (n(), t(window).resize(n));
  })(jQuery),
  (function(i) {
    if (!(i("body.single").length < 1)) {
      var a = orz.match(/\bpostid-(\d+)\b/);
      i(document).on("userLogged", function() {
        var t = (function o() {
            var t = i(".post-header .post-title");
            return (
              t.length < 1 && (t = i(".zt-singular-header .block-main>h2")),
              t.length < 1 && (t = i(".hunter-singular-main .title")),
              t.length < 1 && (t = i(".job-header-main .job-title")),
              t.length < 1 && (t = i()),
              t
            );
          })(),
          e = (function(t) {
            var e = i(t).attr("class"),
              n = a(e);
            return orz.isArray(n) ? n[1] : 0;
          })(i("body")),
          n = orz.currentUser.menus.edit || "";
        if (orz.isNotEmpty(n)) {
          var r =
            '<span class="edit_btn"> <a href="' +
            (n.replace("edit", "post") + "?post=" + e + "&action=edit") +
            '" class="btn btn-orange">编辑</a> </span>';
          t.append(r);
        }
      });
    }
  })(jQuery),
  (function(t) {
    "IE浏览器" == orz.getDevice() &&
      t("head").append(
        '<link rel="stylesheet" href="https://www.uisdc.com/app/themes/U/ui/css/ie.css" type="text/css" media="all" />'
      );
  })(jQuery),
  (function(t) {
    function e() {
      if (!orz.md()) return !1;
    }
    orz.click(e, ".post-recommend .recommend-titles a"),
      orz.click(e, ".widget-post-tabs .tabs-title a"),
      orz.click(function() {
        if (!orz.lg()) return !1;
      }, '[data-component="dropdown"]');
  })(jQuery),
  (function(n) {
    n("a").tap(function(t) {
      if (!orz.md()) {
        var e = n(this).attr("href");
        orz.isNotEmpty(e) && (window.location = e);
      }
      return !1;
    });
  })(jQuery),
  (function(t) {
    var e = t(".widget-hunter-revealed");
    if (!(e.length < 1)) {
      var n = e.children(".widget-content");
      n.length < 1 || (r(), t(window).on("resize", r));
    }
    function r() {
      if (orz.md() && !orz.lg()) {
        var t = parseFloat(n.css("padding-top")),
          e = parseFloat(n.css("padding-bottom"));
        n.height(Math.floor((370 * n.outerWidth()) / 314 - t - e));
      }
    }
  })(jQuery),
  (function(t) {
    if (window.app_native && window.app_native.onReceivedTouchIcons) {
      var i = [];
      !(function n() {
        (normalElements = document.querySelectorAll(
          "link[rel='apple-touch-icon']"
        )),
          (precomposedElements = document.querySelectorAll(
            "link[rel='apple-touch-icon-precomposed']"
          )),
          e(normalElements),
          e(precomposedElements);
        var t = JSON.stringify(i);
        window.app_native.onReceivedTouchIcons(document.URL, t);
      })();
    }
    function e(t) {
      for (var e, n = t.length, r = 0; r < n; r++) {
        var o = {
          sizes: (e = t[r]).hasAttribute("sizes") ? e.sizes[0] : "",
          rel: e.rel,
          href: e.href
        };
        i.push(o);
      }
    }
  })(jQuery),
  (function(t) {
    t("body").on("change", ".select-go", function() {
      location.href = t(this).val();
    });
  })(jQuery),
  jQuery(function(o) {
    function i(t, e) {
      orz
        .show(o(e).find(".error"))
        .children("p")
        .html(t);
    }
    o(".is_anonymous").on("change", function() {
      o(this).prop("checked") ? o(this).val("yes") : o(this).val("no");
    }),
      o("body").on("focusin", ".talk_title", function() {
        !(function e(t) {
          orz.hidden(o(t).find(".error"));
        })(
          o(this)
            .parent()
            .parent()
        );
      }),
      o(".talk_write_form").on("submit", function() {
        var t = orz.trim(orz.get_form_item_val("talk_title", this)),
          e = orz.trim(orz.get_form_item_val("talk_desc", this)),
          n = orz.get_form_item_val("is_anonymous", this),
          r = "";
        return (
          orz.isEmpty(t) && (r += "请输入标题"),
          orz.isNotEmpty(r)
            ? i(r, o(this))
            : orz.post(
                function(t) {
                  var e = "";
                  if (
                    ((t = orz.jsonDecode(t))
                      ? orz.isNotEmpty(t.error) && (e = t.error)
                      : (e = "出错了，请重试。"),
                    orz.isNotEmpty(e))
                  )
                    return i(e, this), !1;
                },
                { action: "post_talk", title: t, desc: e, is_anonymous: n },
                this
              ),
          !1
        );
      });
  }),
  jQuery,
  (orz.get_comments_html = function(t, o) {
    var i = "";
    return (
      orz.isArray(t) &&
        orz.map(function(t) {
          var e = t.author_url,
            n = t.approved,
            r = t.content;
          (i +=
            '<div class="comment-item appr_' +
            n +
            " " +
            (o ? "animated flash" : "") +
            " level_" +
            (0 < t.parent ? "1" : "0") +
            '" id="comment_' +
            t.id +
            '">'),
            (i += '<div class="item-avatar">'),
            orz.isNotEmpty(e) && (i += '<a href="' + e + '" target="_blank">'),
            (i +=
              '<i class="thumb" style="background-image:url(' +
              t.avatar +
              ');"></i>'),
            orz.isNotEmpty(e) && (i += "</a>"),
            (i += "</div>"),
            (i += '<div class="item-content">'),
            (i += '<div class="item-main">'),
            (i += '<h3 class="item-title">'),
            orz.isNotEmpty(e) && (i += '<a href="' + e + '" target="_blank">'),
            (i += t.author),
            orz.isNotEmpty(e) && (i += "</a>"),
            t.parent_author &&
              (i +=
                ' <small>回复给 <a href="#comment_' +
                t.parent +
                '">' +
                t.parent_author +
                "</a> </small>"),
            1 != n && (i += '<span class="pending">评论审核中</span>'),
            1 == t.is_sticky && (i += '<span class="sticky">置顶</span>'),
            (i += "</h3>"),
            (i += '<div class="item-entry">' + r + "</div>"),
            (i += "</div>"),
            (i += '<h4 class="meta">'),
            (i += "<span>" + orz.getDateDiff(t.time) + "</span>"),
            (i += "<span>来自 " + (t.city || "宇宙") + "</span>"),
            (i += "<span>" + t.device + "</span>"),
            1 == n &&
              ((i +=
                '<span> <em class="btn-reply" data-cid="' +
                t.id +
                '">回复</em> </span>'),
              (i +=
                '<span> <em class="btn-zan ' +
                (0 < t.zan ? "zans" : "") +
                '"  data-component="zan" data-cid="' +
                t.id +
                '" data-count="' +
                t.zan +
                '">点赞 <i class="count">' +
                (t.zan || "") +
                "</i> </em> </span>")),
            orz.currentUser &&
              "editor" == orz.currentUser.is &&
              t.parent <= 0 &&
              (1 == t.is_sticky
                ? (i +=
                    '<span class="sticky_btn has_sticky" data-cid="' +
                    t.id +
                    '">取消置顶</span>')
                : (i +=
                    '<span class="sticky_btn no_sticky" data-cid="' +
                    t.id +
                    '">置顶</span>'),
              1 != t.is_recommend
                ? (i +=
                    '<span class="comment_to_btn" data-action="comment_to_home" data-cid="' +
                    t.id +
                    '">推送热评</span>')
                : (i +=
                    '<span class="comment_to_btn" data-action="remove_comment_to_home" data-cid="' +
                    t.id +
                    '">移除热评</span>')),
            (i += "</h4>"),
            (i += "</div>"),
            (i += "</div>");
        }, t),
      i
    );
  }),
  (function(t) {
    var e = t(".comment-div");
    if (!(e.length < 1)) {
      var n = e.children(".section-title").children(".sub");
      t(document).on("userNotLogged", function() {
        n.html(
          '点击 <span class="modal-open clr_orange" data-modal-id="modal_login">登录</span> 微信，亮头像秀观点，' +
            n.html()
        );
      });
    }
  })(jQuery),
  (function(s) {
    if (!(s(".comment-div").length < 1)) {
      var i = s(".comment-write"),
        t = (s(".comment-list"), ".comment-write .comment-word"),
        e = ".comment-write .form-yzm img",
        c = ".comment-write .btn-submit",
        n = orz.get_form_item_val,
        a = orz.attr("total"),
        l = n("user-name"),
        d = n("comment"),
        u = n("prefix"),
        h = n("yzm"),
        f = n("pid"),
        m = n("parent"),
        p = "";
      r(),
        v(".lineLen"),
        s(window).on("resize", r),
        s(document).on("userLogged", function b() {
          i.addClass("userLogged"),
            (function e() {
              var t = orz.currentUser.avatar;
              s(".comment-write .user-avatar .thumb").css({
                "background-image": "url(" + t + ")"
              });
            })(),
            (function n() {
              var t = orz.currentUser.name;
              s(".comment-write .user-name").html(t);
            })();
        }),
        s(document).on("userNotLogged", function k() {
          i.addClass("userNotLogged");
        }),
        s("body").on("keyup", t, o),
        s("body").on("mouseup", t, o),
        s("body").on("focus", t, function _() {
          y(),
            i.hasClass("userNotLogged") &&
              (function e() {
                var t = s(".form-yzm");
                t.removeClass("hidden"), t.find("img").trigger("click");
              })();
        }),
        s("body").on("focus", ".comment-write .comment-yzm", function C() {
          y();
        }),
        s("body").on("click", e, g),
        s("body").on("submit", ".comment-write", function j() {
          if (orz.isPending(c)) return !1;
          var t,
            e = "",
            n = "",
            r = "",
            o = f(this),
            i = m(this);
          (t = d(this)),
            s(this).hasClass("userNotLogged") &&
              ((e = l(this)), (n = u(this)), (r = h(this)));
          var a = {
            action: "post_comment",
            uName: e,
            comment: t,
            prefix: n,
            yzm: r,
            pid: o,
            parent: i,
            city: "",
            device: orz.getDevice()
          };
          return (
            returnCitySN && (a.city = returnCitySN.cname),
            orz.isEmpty(t)
              ? z("请输入评论内容")
              : s(this).hasClass("userNotLogged") && orz.isEmpty(r)
              ? z("请输入验证码")
              : t == p
              ? z("不可以发一样的评论喔。")
              : (orz.pending(c), orz.post(w, a, null)),
            !1
          );
        }),
        s("body").on("click", ".error-box .close", y);
    }
    function r() {
      s(".lineLen").each(function() {
        var t = parseInt(s(this).css("font-size")),
          e = s(this).width(),
          n = parseInt(s(this).css("padding-left")),
          r = parseInt(s(this).css("padding-right"));
        orz.setAttr("line", Math.ceil((2 * (e - n - r)) / t), s(this));
      });
    }
    function v(t) {
      var e = s(t).val();
      orz.isEmpty(e) && (e = s(t).attr("data-placeholder"));
      for (
        var n = orz.attr("line", t),
          r = parseInt(s(t).css("line-height")),
          o = 1,
          i = 0,
          a = 0;
        a < e.length;
        a++
      )
        10 == e.charCodeAt(a)
          ? ((i = 0), o++)
          : (127 < e.charCodeAt(a) ? (i += 2) : i++, n <= i && (o++, (i = 0)));
      s(t).height(o * r);
    }
    function o() {
      v(this),
        (function o(t) {
          var e = s(t).val(),
            n = a(t),
            r = n - e.length;
          e.length > n && ((r = 0), (e = e.substring(0, n - 1)), s(t).val(e)),
            s(t)
              .siblings(".rest")
              .children("em")
              .html(r);
        })(this);
    }
    function g() {
      var r = s(e);
      orz.post(
        function(t) {
          r.attr(
            "src",
            (function e(t) {
              return (
                "/wp-content/themes/U/captcha/captcha.php?prefix=" +
                t +
                "&nonce=" +
                new Date().getTime()
              );
            })(t)
          ),
            (function n(t) {
              s('[name="prefix"]').val(t);
            })(t);
        },
        { action: "get_captcha" },
        null
      );
    }
    function z(t) {
      s(".error-box")
        .removeClass("hide")
        .children(".item-content")
        .html(t);
    }
    function y() {
      s(".error-box")
        .addClass("hide")
        .children(".item-content")
        .html("");
    }
    function w(t) {
      if ((orz.done(c), orz.isNotEmpty(t))) {
        var e = orz.jsonDecode(t);
        if (e) {
          var n = e.data;
          orz.isNotEmpty(n)
            ? ((function r(t) {
                (html = orz.get_comments_html(t, !0)), i.append(html);
              })(n),
              (p = n[0].content),
              (function o() {
                i.find('[name="comment"]').val(""),
                  i.find('[name="yzm"]').val("");
              })())
            : z(e.error.join("<br>"));
        } else z(t);
      } else z("评论失败，请重试");
      i.hasClass("userNotLogged") && g();
    }
  })(jQuery),
  (function(e) {
    if (!(e(".comment-div").length < 1)) {
      var n = e(".comment-write"),
        i = e(".comment-list"),
        a = e(".content-loading"),
        s = e(".comment-more"),
        c = e(".comment-nomore"),
        l = orz.attr("paged"),
        d = orz.attr("pid");
      t(),
        orz.click(t, ".btn-more-comments"),
        orz.click(function h() {
          var t = orz.attr("cid", e(this));
          e(this)
            .parents(".meta")
            .after(n),
            r(t),
            n.addClass("reply-write");
        }, ".btn-reply"),
        orz.click(function f() {
          n.removeClass("reply-write"), r(0), i.before(n);
        }, ".btn-reply-close");
    }
    function t() {
      var t = l(i),
        e = { action: "get_comments", pid: d(i), pd: t };
      !(function n() {
        a.removeClass("hidden");
      })(),
        (function r() {
          s.addClass("hidden");
        })(),
        (function o() {
          c.addClass("hidden");
        })(),
        orz.post(u, e, null);
    }
    function o() {
      s.removeClass("hidden"),
        (function e() {
          var t = l(i);
          (t -= 0), t++, orz.setAttr("paged", t, i);
        })();
    }
    function u(t) {
      if (t) {
        var e = orz.jsonDecode(t);
        e &&
          (i.append(orz.get_comments_html(e.data)),
          orz.zanInit(),
          i.find(".item-entry a").attr("target", "_blank"),
          20 <= e.data.length
            ? o()
            : (function n() {
                0 < i.children(".comment-item").length &&
                  c.removeClass("hidden");
              })());
      }
      !(function r() {
        a.addClass("hidden");
      })();
    }
    function r(t) {
      n.find('[name="parent"]').val(t);
    }
  })(jQuery),
  (function(r) {
    if (!(r(".comment-div").length < 1)) {
      function o(t) {
        if (orz.isNotEmpty(t)) {
          if (((t = orz.jsonDecode(t)), orz.isEmpty(t))) return;
          1 == t.data.sticky ? e(this) : n(this);
        }
      }
      var i = orz.attr("cid"),
        e = function(t) {
          r(t).addClass("has_sticky"), r(t).html("取消置顶");
        },
        n = function(t) {
          r(t).removeClass("has_sticky"), r(t).html("置顶");
        };
      orz.click(function() {
        var t = i(this),
          e = "no_sticky";
        !(function(t) {
          return r(t).hasClass("has_sticky");
        })(this) || (e = "has_sticky");
        var n = { action: "comment_sticky", status: e, commentId: t };
        return orz.post(o, n, this), !1;
      })(".sticky_btn");
    }
  })(jQuery),
  (function(e) {
    if (!(e(".comment-div").length < 1)) {
      var n = orz.attr("cid"),
        r = orz.attr("action");
      orz.click(function() {
        var t = { action: r(this), cid: n(this) };
        return (
          e(this).remove(),
          orz.post(
            function(t) {
              orz.log(t);
            },
            t,
            this
          ),
          !1
        );
      })(".comment_to_btn");
    }
  })(jQuery),
  (function(t) {
    t("body").on("click", '[data-target="search_dropdown"]', function() {
      setTimeout(function() {
        t("#search_dropdown")
          .find("input.txt")
          .trigger("focus");
      }, 500);
    });
  })(jQuery),
  (function(t) {
    var e = t(".dropdown-search");
    if (!(e.length < 1)) {
      var n = e.find(".search-content");
      r(), t(window).on("resize", r);
    }
    function r() {
      var t = document.documentElement.clientHeight;
      n.css({ "max-height": t - 59 - 50 - 50 });
    }
  })(jQuery),
  (function(n) {
    function r() {
      var t = orz.getCookie("search_history");
      return (
        orz.isNotEmpty(t) &&
          ((t = orz.jsonDecode(t)),
          (!orz.isEmpty(t) && orz.isObject(t)) || (t = {})),
        t
      );
    }
    var c = orz.lpad("0", 2);
    function t(t) {
      var e,
        n,
        r,
        o,
        i,
        a = [];
      if (orz.isObject(t))
        for (var s in t)
          t.hasOwnProperty(s) &&
            a.unshift(
              "<li><span>" +
                ((o = t[s]),
                (i = void 0),
                (i = new Date()).setTime(o),
                c(i.getMonth() + 1) +
                  "-" +
                  c(i.getDate()) +
                  " " +
                  c(i.getHours()) +
                  ":" +
                  c(i.getMinutes())) +
                '</span><a href="' +
                ((r = s), orz.currentPageUrl() + "?s=" + r) +
                '" title="' +
                s +
                '">' +
                ((n = 8),
                (e = s).length > n && (e = e.substring(0, n) + "..."),
                e) +
                '</a><i class="icon-close search-tag-close" data-tag="' +
                s +
                '"></i></li>'
            );
      return (
        orz.isEmpty(a) && (a = ["你还没搜索过喔。"]),
        (a = a.slice(0, 12)).join("")
      );
    }
    var e = r(),
      o = t(e);
    0 < n("body.search").length &&
      (!(function a() {
        var t = r(),
          e = orz._get("s");
        orz.isNotEmpty(e) &&
          (delete t[(e = decodeURIComponent(e))],
          (t[e] = new Date().getTime()),
          orz.setCookie("search_history", orz.jsonEncode(t)));
      })(),
      (function s() {
        var t = n(".search-widget-history .widget-title");
        if (!(t.length < 1)) {
          var e = r();
          0 < Object.keys(e).length &&
            t.append('<span class="clear-all-history">全部清除</span>');
        }
      })());
    var i = n("#search_history");
    0 < i.length &&
      (i.html(o),
      orz.isEmpty(e) && i.parents(".history").addClass("no-history")),
      orz.click(function l() {
        orz.setCookie("search_history", ""),
          n(this).remove(),
          n("#search_history").html(t({}));
      }, ".clear-all-history"),
      orz.click(function d() {
        var t = r();
        delete t[n(this).attr("data-tag")],
          orz.setCookie("search_history", orz.jsonEncode(t)),
          n(this)
            .parent()
            .remove();
      }, ".search-tag-close"),
      n(".search-item").on("click", function() {
        if (!orz.sm())
          return (
            (document.location = n(this)
              .children("h3")
              .children("a")
              .attr("href")),
            !1
          );
      });
  })(jQuery),
  (function(i) {
    function t() {
      var t = i(".sidebar .divNeedScroll");
      if (!(t.length < 1)) {
        var e = document.documentElement.clientHeight,
          n = i(".sidebar-fixed");
        if (!(n.length < 1)) {
          var r = 0,
            o = orz.attr("top", n);
          0 < o && (r += o - 0),
            n.children(".widget").each(function() {
              i(this).hasClass("widget-article-menu")
                ? ((r += parseFloat(i(this).css("padding-top")) - 0),
                  (r += parseFloat(i(this).css("padding-bottom")) - 0),
                  (r += 52))
                : ((r += i(this).outerHeight() - 0),
                  (r += parseFloat(i(this).css("margin-bottom")) - 0));
            }),
            t.css("max-height", e - r),
            orz.setAttr("scrollInit", "no", t),
            orz.divNeedScrollInit();
        }
      }
    }
    setTimeout(t, 1e3), i(window).on("resize", t);
  })(jQuery),
  (function(t) {
    function e() {
      "#login" == location.hash &&
        t(".modal-open[data-modal-id=modal_login]").trigger("click");
    }
    t(window).on("load", e), orz.hash.push(e);
  })(jQuery),
  (function(t) {
    orz.currentUser = null;
    var e = orz.getCookie("currentUser");
    e
      ? ((e = orz.jsonDecode(decodeURIComponent(e))),
        (orz.currentUser = e) && t(document).trigger("userLogged"))
      : t(document).trigger("userNotLogged");
  })(jQuery),
  (function(i) {
    var a = i("#user_center");
    if (!(a.length < 1 || "user_center" != uisdc.page || uisdc.uid < 1)) {
      var s,
        c,
        l = {},
        d = {},
        t = i(".uc-header"),
        e = i(".user-center .user-avatar"),
        n = i(".user-center .user-name"),
        r = i(".user-center .user-job"),
        o = i(".user-center .user-info"),
        u = i(".views.count"),
        h = i(".publish.count"),
        f = i(".fav.count"),
        m = i(".user-menu"),
        p = i(".uc-submenu"),
        v = i(".user-submenu"),
        g = i(".sub-title"),
        z = i(".uc-content .content"),
        y = i(".uc-content .content .items"),
        w = i(".uc-content .content .pageds"),
        b = i(".uc-content .content .pageds .go"),
        k = i(".uc-content .content .pageds .nav"),
        _ = i(".mine-center"),
        C = i(".msg-center"),
        j = i(".setting-center"),
        x = !1,
        E =
          (i(".user-job"),
          i(".user-company"),
          i(".user-info"),
          i("[data-prop]")),
        T = { action: "user_center_info", uid: uisdc.uid };
      i("body").on("submit", ".setting-form", function() {
        if (orz.isPending(this)) return !1;
        var t = U("info"),
          e = U("company"),
          n = U("job");
        if ((orz.pending(this), t || e || n)) {
          var r = {
            action: "user_setting_save",
            info: t,
            company: e,
            job: n,
            uid: uisdc.uid
          };
          orz.post(
            function(t) {
              c = orz.deepCopy(s);
            },
            r,
            this
          );
        }
        return (
          orz.done(this),
          (function o() {
            i(".error").addClass("show"),
              setTimeout(function() {
                i(".error").removeClass("show");
              }, 2e3);
          })(),
          !1
        );
      });
      var O = {
        post: function W(t) {
          var e = '<div class="item">';
          return (
            (e += '<div class="item-post">'),
            (e += '<div class="item-thumb">'),
            (e += '<a href="' + t.href + '" class="h-mark" target="_blank">'),
            (e +=
              '<i class="thumb" style="background-image:url(' +
              t.image +
              ');"></i>'),
            (e += "</a>"),
            (e += "</div>"),
            (e += '<div class="item-main">'),
            (e += "<h2>"),
            (e += '<a href="' + t.href + '" target="_blank">'),
            (e += t.title),
            (e += "</a>"),
            (e += "</h2>"),
            (e += "<h4>"),
            (e += '<span class="time">' + t.time + "</span>"),
            (e +=
              '<span class="cat"> <a href="' +
              t.cat_link +
              '" target="_blank">' +
              t.cat +
              " </a> </span>"),
            (e += "</h4>"),
            (e += "</div>"),
            (e += "</div>"),
            (e += R(t)),
            (e += "</div>")
          );
        },
        hunter: function B(t) {
          var e = '<div class="item">';
          return (
            (e += '<div class="item-hunter">'),
            (e += '<a href="' + t.href + '" target="_blank">'),
            (e += "<h2>"),
            (e += t.title),
            (e += "</h2>"),
            (e += "<h4>"),
            (e += '<span class="time">' + t.time + "</span>"),
            (e += '<span class="product"> 产品：' + t.product + " </span>"),
            (e += "</h4>"),
            (e += '<div class="item-main">'),
            (e += '<div class="item-entry">'),
            (e += t.content),
            (e += "</div>"),
            (e += '<div class="item-thumb">'),
            (e +=
              '<i class="thumb" style="background-image:url(' +
              t.image +
              ');"></i>'),
            (e += "</div>"),
            (e += "</div>"),
            (e += "</a>"),
            (e += "</div>"),
            (e += R(t)),
            (e += "</div>")
          );
        },
        zt: function H(t) {
          var e = '<div class="item">';
          return (
            (e += '<div class="zt-item">'),
            (e += '<a href="' + t.href + '" target="_blank">'),
            (e += '<div class="item-thumb">'),
            (e +=
              '<i class="thumb" style="background-image:url(' +
              t.image +
              ');"></i>'),
            (e += "<h5>"),
            (e += '<span class="l">' + t.views + "人看过</span>"),
            (e += '<span class="r">' + t.count + "篇文章</span>"),
            (e += "</h5>"),
            (e += "</div>"),
            (e += "<h2>"),
            (e += t.title),
            (e += "</h2>"),
            (e += "<h4>" + t.subtitle + "</h4>"),
            (e +=
              '<div class="btns"> <span class="btn">查看专题</span> </div>'),
            (e += "</a>"),
            (e += "</div>"),
            (e += R(t)),
            (e += "</div>")
          );
        },
        talk: function Y(t) {
          var e = '<div class="item">';
          return (
            (e += '<div class="item-talk">'),
            (e += '<a href="' + t.href + '" target="_blank">'),
            (e += '<div class="item-main">'),
            (e += '<div class="item-thumb">'),
            (e +=
              '<i class="thumb" style="background-image:url(' +
              t.image +
              ');"></i>'),
            (e += "</div>"),
            (e += "<h3>" + t.author + "</h3>"),
            (e += "<h4>" + t.time + "</h4>"),
            (e += "<h2>" + t.title + "</h2>"),
            (e += '<div class="item-entry">' + t.content + "</div>"),
            (e += "</div>"),
            (e += '<div class="item-extra">'),
            (e += '<div class="extra">'),
            (e += "<strong>" + t.zan + "</strong><span>赞</span>"),
            (e += "</div>"),
            (e += '<div class="extra">'),
            (e += "<strong>" + t.comment_count + "</strong><span>评论</span>"),
            (e += "</div>"),
            (e += "</div>"),
            (e += "</a>"),
            (e += "</div>"),
            (e += "</div>")
          );
        }
      };
      A()
        ? m.html(
            ' <a href="#fav">我收藏的</a>  <a href="#publish">我发布的</a>  <a href="#setting">帐户设置</a> '
          )
        : m.html(' <a href="#publish">发布</a>  <a href="#fav">收藏</a> '),
        i(window).on("load", I),
        orz.hash.push(I),
        orz.post(
          function G(t) {
            if (t) {
              var e = (t = orz.jsonDecode(t)).data;
              e &&
                ((s = e),
                (c = orz.deepCopy(e)),
                0 < e.publish && !0,
                q(),
                E.each(function() {
                  i(this).val(s[i(this).attr("data-prop")]),
                    i(this)
                      .siblings()
                      .find('[data-name="' + i(this).attr("data-prop") + '"]')
                      .html(s[i(this).attr("data-prop")]);
                }),
                0 < e.views
                  ? u.children("strong").html(e.views)
                  : u.addClass("hidden"),
                0 < e.publish
                  ? h.children("strong").html(e.publish)
                  : (h.addClass("hidden"),
                    (function n() {
                      A() ||
                        (m
                          .children("a")
                          .eq(0)
                          .remove(),
                        I(),
                        Q());
                    })()),
                0 < e.fav
                  ? f.children("strong").html(e.fav)
                  : (f.children("strong").html(e.fav),
                    (function r() {
                      A() || Q();
                    })()),
                i("body").trigger("user_info_ready"));
            }
          },
          T,
          a
        ),
        orz.click(function() {
          var t = i(".uc-menus").offset();
          i("html,body").animate({ scrollTop: t.top }, 10);
        }, ".nav-pages a"),
        i("body").on("user_info_ready", function $() {
          x || ((x = !0), E.on("blur", M));
        }),
        i("body").on("user_info_change", q),
        orz.click(function() {
          var t = i(this).parents(".item"),
            e = {
              action: "fav",
              do: "remove",
              uid: orz.attr("uid", this),
              pid: orz.attr("pid", this)
            };
          return t.remove(), orz.post(function(t) {}, e, this), !1;
        }, ".remove_fav");
    }
    function A() {
      return !!orz.currentUser && orz.currentUser.id == uisdc.uid;
    }
    function Q() {
      var t = i(".user-404");
      if (t.length < 1) {
        z.after('<div class="user-404">很抱歉，没有更多内容了喔。</div>');
      } else t.removeClass("hidden");
      z.addClass("hidden");
    }
    function S() {
      var t = i(".user-404");
      0 < t.length && t.addClass("hidden"), z.removeClass("hidden");
    }
    function N() {
      var t = orz.match(/#\d+$/)(location.hash);
      return t ? t[0] : "#1";
    }
    function D() {
      var t = orz.match(/#[^#]+/)(location.hash);
      return t ? m.children('[href="' + t[0] + '"]') : m.children("a").eq(0);
    }
    function q() {
      t.removeClass("hidden"),
        e.css("background-image", "url(" + s.avatar + ")"),
        n.html(s.name),
        r.html(s.company + " " + s.job),
        o.html(s.info);
    }
    function F(t) {
      var e = 18;
      switch (t) {
        case "#publish#post":
        case "#fav#post":
          e = 18;
          break;
        case "#publish#hunter":
        case "#fav#hunter":
          e = 9;
          break;
        case "#publish#talk":
          e = 3;
          break;
        case "#fav#zt":
          e = 8;
      }
      return e;
    }
    function I() {
      S(),
        v.html(""),
        p.addClass("hidden"),
        _.addClass("hidden"),
        z.addClass("hidden"),
        C.addClass("hidden"),
        j.addClass("hidden"),
        y.html("");
      var t = D();
      switch (
        (m.children("a").removeClass("current"),
        t.addClass("current"),
        t.attr("href"))
      ) {
        case "#publish":
          z.removeClass("hidden"),
            v.html(
              ' <a href="#publish#post">设计文章</a>  <a href="#publish#hunter">细节猎人</a>  <a href="#publish#talk">设计话题</a> '
            ),
            p.removeClass("hidden");
          break;
        case "#fav":
          z.removeClass("hidden"),
            v.html(
              ' <a href="#fav#post">设计文章</a>  <a href="#fav#zt">设计专题</a>  <a href="#fav#hunter">细节猎人</a> '
            ),
            p.removeClass("hidden");
          break;
        case "#mine":
          _.removeClass("hidden");
          break;
        case "#msg":
          C.removeClass("hidden"),
            v.html(
              ' <a href="#msg#all">全部消息</a>  <a href="#msg#system">系统消息</a>  <a href="#msg#comment">评论回复</a> '
            ),
            p.removeClass("hidden");
          break;
        case "#setting":
          j.removeClass("hidden"),
            v.html("<span>以下资料来自微信</span>"),
            p.removeClass("hidden");
      }
      g.html(t.text());
      var e = (function o() {
        var t = orz.match(/#[^#]+#[^#]+/)(location.hash);
        return t ? v.children('[href="' + t[0] + '"]') : v.children("a").eq(0);
      })();
      v.children("a").removeClass("current"), e.addClass("current");
      var n = N().substring(1);
      n < 1 && (n = 1);
      var r = {
        action: "user_center_data",
        uid: uisdc.uid,
        type: e.attr("href"),
        paged: n,
        ppp: F(e.attr("href"))
      };
      "#mine" == t.attr("href") && (r.type = "#mine"),
        "#setting" == t.attr("href") && (r.type = "#setting"),
        (function i(t) {
          var e = t.type,
            n = t.paged;
          if (orz.match("#fav")(e) || orz.match("#publish")(e)) {
            if (orz.isArray(l[e]) && (l[e][n] || orz.match("#fav")(e)))
              return L(l[e][n], e);
            orz.post(P, t, a);
          }
          orz.match("#mine")(e);
          orz.match("#msg")(e);
          orz.match("#setting")(e);
        })(r);
    }
    function M() {
      var t = i(this).attr("data-prop"),
        e = (s[t], i(this).val());
      (s[t] = e),
        q(),
        (function n(t) {
          i(t)
            .siblings(".holdTxt")
            .removeClass("hidden")
            .children("em")
            .html(i(t).val()),
            i(t).addClass("hidden");
        })(this);
    }
    function U(t) {
      return s[t] != c[t] ? s[t] : "";
    }
    function P(t) {
      if (t) {
        var e,
          n = (t = orz.jsonDecode(t)).data,
          r = t.type,
          o = t.post_type,
          i = t.pages,
          a = t.paged,
          s = "#" + r + "#" + o;
        if (n) {
          if (
            ("publish" == r &&
              ((d[s] = i), orz.isArray(l[s]) || (l[s] = []), (l[s][a] = n[o])),
            "fav" == r)
          )
            for (var c in n)
              if (n.hasOwnProperty(c)) {
                for (
                  e = n[c], l["#fav#" + c] = [], l["#fav#" + c].push([]);
                  0 < e.length;

                )
                  l["#fav#" + c].push(e.splice(0, F("#fav#" + c)));
                d["#fav#" + c] = l["#fav#" + c].length - 1;
              }
          L(l[s][a], s);
        }
      }
    }
    function L(t, e) {
      if (t && 0 < t.length) {
        S();
        var n = t[0].post_type;
        y.attr("class", "items"),
          y.addClass("items-" + n),
          y.html(orz.map(O[n], t).join("")),
          w.removeClass("hidden"),
          (function o(t) {
            var e, n, r;
            switch ((orz.log(t), t)) {
              case "post":
                (e = "/archives"), (n = "设计文章");
                break;
              case "hunter":
                (e = "/hunters"), (n = "细节猎人");
                break;
              case "talk":
                (e = "/talk"), (n = "设计话题");
                break;
              case "zt":
                (e = "/zt"), (n = "设计专题");
            }
            (r =
              '<a href="' +
              e +
              '" target="_blank" class="btn btn-orange">前往' +
              n +
              ' <i class="icon-right"></i> </a>'),
              b.html(r);
          })(n),
          (function a(t) {
            var e = d[t],
              n = "",
              r = N().substring(1),
              o = "",
              i = "";
            0 < e &&
              (1 == r && (o = "hidden"),
              r == e && (i = "hidden"),
              (n +=
                '<li class="fy ' +
                o +
                '"><a href="' +
                t +
                "#" +
                (r - 1) +
                '" data-nav="prev"><span><i class="icon-left-open-big"></i> 上一页</span></a></li>'),
              (n +=
                '<li class="active disabled"><a href="' +
                t +
                "#" +
                r +
                '" data-nav="current"><span>' +
                r +
                "</span></a></li>"),
              (n +=
                '<li class="fy ' +
                i +
                '"><a href="' +
                t +
                "#" +
                (r - 0 + 1) +
                '" data-nav="next"><span>下一页 <i class="icon-right-open-big"></i></span></a></li>'),
              k.html(n));
          })(e);
      } else Q(), w.addClass("hidden");
    }
    function R(t) {
      var e = "";
      return (
        "#fav" == D().attr("href") &&
          A() &&
          ((e += '<div class="fav-edit">'),
          (e +=
            '已看完 <span class="btn btn-orange-border remove_fav" data-uid="' +
            uisdc.uid +
            '" data-pid="' +
            t.ID +
            '">移除</span>'),
          (e += "</div>")),
        e
      );
    }
  })(jQuery),
  (function(t) {
    if (!(t(".usercenter-body").length < 1))
      t(".header .container"),
        t(".header .site-menu"),
        t(".header .logo"),
        t(".header .header-login-search");
  })(jQuery),
  (function(e) {
    var n = orz.attr("target");
    orz.click(function() {
      var t = n(this);
      return (
        e(this).addClass("hidden"),
        e(this)
          .siblings('[data-prop="' + t + '"]')
          .removeClass("hidden")
          .focus(),
        !1
      );
    }, ".holdTxt");
  })(jQuery),
  (function(a) {
    if ("undefined" != typeof _hmt) {
      var s = orz.attr("category"),
        c = orz.attr("action"),
        l = orz.attr("label"),
        t = [
          { tag: "#spark_slide_homepage_new a", category: "首页轮播" },
          { tag: ".menu-primary .link-0", category: "主菜单" },
          { tag: ".hf-widget-2 a", category: "首屏设计师必备" },
          { tag: ".hf-widget-4 a", category: "首屏大课堂" },
          { tag: ".hf-widget-software a", category: "首屏软件教程" },
          { tag: ".hf-widget-hot-cats a", category: "首屏热门频道" },
          { tag: ".h-images a", category: "首页首屏图文" },
          { tag: ".ktuwen a", category: "图文广告", action: location.href },
          { tag: ".kingba a", category: "金主爸爸", label: "href" },
          { tag: ".widget-show a", category: "侧栏广告", label: "href" },
          { tag: ".archiveTopShow a", category: "频道顶部广告", label: "href" },
          { tag: ".pageTopShow a", category: "单页顶部广告", label: "href" },
          { tag: ".postTopShow a", category: "文章页顶部广告", label: "href" },
          { tag: ".archiveShow a", category: "频道底部广告", label: "href" },
          { tag: ".news-show a", category: "优设读报广告", label: "href" },
          { tag: ".article-show a", category: "内容底部广告", label: "href" },
          {
            tag: ".single-hunter .ts a",
            category: "细节猎人通栏",
            label: "href"
          },
          { tag: ".bottomShow a", category: "细节话题底部广告", label: "href" },
          { tag: ".article-bt a", category: "正文底部广告", label: "href" }
        ];
      a.map(t, function(i) {
        orz.click(function() {
          var t = a(i.tag).index(a(this));
          t++;
          var e = i.label;
          "href" == e && (e = a(this).attr("href"));
          var n = s(this) || i.category || i.tag,
            r = c(this) || i.action || "点击",
            o = l(this) || e || "序号：" + t;
          _hmt.push(["_trackEvent", n, r, o]);
        }, i.tag);
      });
    }
  })(jQuery);

  