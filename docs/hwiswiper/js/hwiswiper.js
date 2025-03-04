var hwiSwiper = (function (__window) {
  var clone = function (obj) {
      if (obj === null || typeof obj !== "object") return obj;

      var copy = obj.constructor();

      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = obj[attr];
        }
      }
      return copy;
    },
    extend = function extend() {
      for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
          if (arguments[i].hasOwnProperty(key))
            arguments[0][key] = arguments[i][key];
      return arguments[0];
    },
    createCustomEvent = function (evt, obj) {
      var evt;

      if (typeof __window.CustomEvent == "function") {
        evt = new __window.CustomEvent(
          evt,
          extend({ bubbles: true, cancelable: true }, obj)
        );
      } else {
      }

      return evt;
    };

  return function (container, opt) {
    this.el = container;
    this.wrap = this.el.getElementsByClassName("hwi-wrap")[0];
    this.elWidth = this.el.clientWidth;
    this.elHeight = this.el.clientHeight;

    this.defOpt = {
      direction: "horizontal",
      transitionDuration: "300ms",
      transitionTimingFunction: "linear",
      angel: 60,
      InitEventList: [
        "touchstart",
        "touchmove",
        "touchend",
        "mousedown",
        "mousemove",
        "mouseup",
      ],
    };
    this.defOpt = extend(this.defOpt, opt);

    this.eventList = {};
    this.defOpt.InitEventList.forEach(
      function (v, i) {
        this.eventList["on" + v] = [];
      }.bind(this)
    );
    this.eventAddrPoint = {};

    this.pos = {
      isMovingContinuity: undefined,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      momento: {
        x: 0,
        y: 0,
      },
    };

    this.emitMouse = false;

    this.__proto__.isDirecBoth = function (e) {
      if (this.defOpt.direction == "both") return true;
    };
    this.__proto__.isDirecHoriz = function (e) {
      if (this.defOpt.direction == "horizontal") return true;
    };
    this.__proto__.isDirecvert = function (e) {
      if (this.defOpt.direction == "vertical") return true;
    };

    this.__proto__.ontouchstart = function (e) {
      this.pos.isMovingContinuity = undefined;

      this.SlideNode.node[this.SlideNode.pNode].style.transitionDuration =
        "0ms";
      this.SlideNode.node[this.SlideNode.aNode].style.transitionDuration =
        "0ms";
      this.SlideNode.node[this.SlideNode.nNode].style.transitionDuration =
        "0ms";

      this.pos.startX = e.touches[0].pageX;
      this.pos.startY = e.touches[0].pageY;
    };

    this.__proto__.validateTouchMove = function (x, y) {
      var angle,
        _x = Math.pow(x, 2),
        _y = Math.pow(y, 2),
        delta = Math.sqrt(_x + _y);

      if (delta > 6) {
        angle = (Math.atan2(-y, x) * 180) / Math.PI;
      }
      if (angle === undefined) {
        this.pos.isMovingContinuity = false;
      }
      if (this.pos.isMovingContinuity === undefined) {
        if (
          (angle || angle == 0) &&
          (Math.abs(angle) <= this.defOpt.angel ||
            Math.abs(angle) >= 180 - this.defOpt.angel)
        ) {
          this.pos.isMovingContinuity = true;
        } else {
          this.pos.isMovingContinuity = false;
        }
      }
    };

    this.__proto__.ontouchmove = function (e) {
      var x = e.touches[0].pageX - this.pos.startX,
        y = e.touches[0].pageY - this.pos.startY,
        z = 0,
        realX = this.isDirecHoriz() ? x : 0,
        realY = this.isDirecvert() ? y : 0,
        realZ = 0;

      this.pos.momento.x = this.pos.x > x ? this.pos.x - x : x - this.pos.x;
      this.pos.momento.y = this.pos.y > y ? this.pos.y - y : y - this.pos.y;
      this.pos.x = x;
      this.pos.y = y;

      this.validateTouchMove(x, y); // this.pos.isMovingContinuity

      this.SlideNode.setActivePos(this);

      if (this.pos.isMovingContinuity === true) {
        e.preventDefault();
        e.stopPropagation();

        //console.log(realX);
        this.SlideNode.node[this.SlideNode.pNode].style.transform =
          "translate3d(" + realX + "px, " + realY + "px, " + z + "px)";
        this.SlideNode.node[this.SlideNode.aNode].style.transform =
          "translate3d(" +
          (realX - this.elWidth) +
          "px, " +
          realY +
          "px, " +
          z +
          "px)";
        this.SlideNode.node[this.SlideNode.nNode].style.transform =
          "translate3d(" +
          (realX + this.elWidth) +
          "px, " +
          realY +
          "px, " +
          z +
          "px)";
      }
    };
    this.__proto__.ontouchend = function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.SlideNode.setPresentPos(this);
      this.animate();

      //this.SlideNode.increaseFlagNum = undefined;
    };

    this.__proto__.onmousedown = function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.emitMouse = true;
      this.pos.isMovingContinuity = undefined;

      this.SlideNode.node[this.SlideNode.pNode].style.transitionDuration =
        "0ms";
      this.SlideNode.node[this.SlideNode.aNode].style.transitionDuration =
        "0ms";
      this.SlideNode.node[this.SlideNode.nNode].style.transitionDuration =
        "0ms";

      this.pos.startX = e.pageX;
      this.pos.startY = e.pageY;

      this.wrap.classList.add("cursor-hand-active");
    };
    this.__proto__.onmousemove = function (e) {
      if (this.emitMouse) {
        var x = e.pageX - this.pos.startX,
          y = e.pageY - this.pos.startY,
          z = 0,
          realX = this.isDirecHoriz() ? x : 0,
          realY = this.isDirecvert() ? y : 0,
          realZ = 0;

        this.pos.momento.x = this.pos.x > x ? this.pos.x - x : x - this.pos.x;
        this.pos.momento.y = this.pos.y > y ? this.pos.y - y : y - this.pos.y;
        this.pos.x = x;
        this.pos.y = y;

        this.pos.isMovingContinuity = true;
        if (this.pos.isMovingContinuity === true) {
          e.preventDefault();
          e.stopPropagation();

          this.SlideNode.node[this.SlideNode.pNode].style.transform =
            "translate3d(" + realX + "px, " + realY + "px, " + z + "px)";
          this.SlideNode.node[this.SlideNode.aNode].style.transform =
            "translate3d(" +
            (realX - this.elWidth) +
            "px, " +
            realY +
            "px, " +
            z +
            "px)";
          this.SlideNode.node[this.SlideNode.nNode].style.transform =
            "translate3d(" +
            (realX + this.elWidth) +
            "px, " +
            realY +
            "px, " +
            z +
            "px)";
        }
      }
    };
    this.__proto__.onmouseup = function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.emitMouse = false;

      this.SlideNode.setPresentPos(this);
      this.animate();
      this.wrap.classList.remove("cursor-hand-active");
    };

    this.__proto__._attachEvent = function () {
      var aEvt = this.defOpt.InitEventList,
        that = this,
        target = that.el,
        returnFn;

      aEvt.forEach(function (v, i) {
        var _tmp = {};

        target.addEventListener(
          v,
          (returnFn = function (e) {
            that["on" + v](e);
          })
        );

        _tmp[v] = returnFn;
        that.eventAddrPoint = extend(that.eventAddrPoint, _tmp);
      });
    };
    this.__proto__._detachEvent = function () {
      var target = this.el,
        aEvt = this.defOpt.InitEventList;

      aEvt.forEach(
        function (v, i) {
          this.el.removeEventListener(v, this.eventAddrPoint[v]);
        }.bind(this)
      );
    };
    this.__proto__._buildInitHtml = function () {
      this.setSlideNode();
    };
    this.__proto__.goPage = function (num) {
      this.SlideNode.setPresentPos(num);
      this.animate();
    };
    this.__proto__.animate = function () {
      var x = 0,
        y = 0,
        z = 0;
      /*
            this.on("touchstart",function() { return false; });
            this.on("touchmove",function() { return false; });
            this.on("touchend",function() { return false; });
            setTimeout(function() {
                this.off("touchstart");
                this.off("touchmove");
                this.off("touchend");
            }.bind(this),parseInt(this.defOpt.transitionDuration)-50);
*/

      this.SlideNode.node[this.SlideNode.pNode].style.transitionDuration =
        this.defOpt.transitionDuration;
      this.SlideNode.node[this.SlideNode.aNode].style.transitionDuration =
        this.defOpt.transitionDuration;
      this.SlideNode.node[this.SlideNode.nNode].style.transitionDuration =
        this.defOpt.transitionDuration;

      this.SlideNode.node[this.SlideNode.pNode].style.transform =
        "translate3d(" + x + "px, " + y + "px, " + z + "px)";
      this.SlideNode.node[this.SlideNode.aNode].style.transform =
        "translate3d(" + (x - this.elWidth) + "px, " + y + "px, " + z + "px)";
      this.SlideNode.node[this.SlideNode.nNode].style.transform =
        "translate3d(" + (x + this.elWidth) + "px, " + y + "px, " + z + "px)";
    };
    this.SlideNode = {
      node: [],
      isIng: false,
      pNode: 0,
      nNode: 0,
      aNode: 0,
      increaseFlagNum: undefined,
    };
    this.SlideNode = Object.create({
      setPresentPos: function (that) {
        var _len = 0;

        if (typeof that == "object") {
          if (that.pos.isMovingContinuity && Math.abs(that.pos.x) >= 50) {
            if (that && that.pos) {
              if (that.pos.x > 0) {
                this.pNode =
                  this.pNode - 1 < 0 ? this.node.length - 1 : this.pNode - 1;
              } else {
                this.pNode =
                  this.pNode + 1 >= this.node.length ? 0 : this.pNode + 1;
              }
            }
          }
        } else if (typeof that == "number") {
          this.pNode = that;
        }
        this.aNode = this.pNode - 1 < 0 ? this.node.length - 1 : this.pNode - 1;
        this.nNode = this.pNode + 1 >= this.node.length ? 0 : this.pNode + 1;
        for (_len; _len < this.node.length; _len++) {
          this.node[_len].className = this.node[_len].className.replace(
            " active",
            ""
          );
        }
        this.node[this.pNode].className =
          this.node[this.pNode].className + " active";
        this.node[this.nNode].className =
          this.node[this.nNode].className + " active";
        this.node[this.aNode].className =
          this.node[this.aNode].className + " active";
      },
      setActivePos: function (that) {
        Math.abs(that.pos.x) > that.elWidth &&
          this.increaseFlagNum != parseInt(that.pos.x / that.elWidth) &&
          function () {
            this.SlideNode.increaseFlagNum = parseInt(
              that.pos.x / that.elWidth
            );
            console.log(this.SlideNode.increaseFlagNum);
            /*
                            if (this.SlideNode.increaseFlagNum<0) {
                                this.SlideNode.pNode = this.SlideNode.aNode;
                            } else if (this.SlideNode.increaseFlagNum>0) {
                                this.SlideNode.pNode = this.SlideNode.nNode;
                            }
                            */
            //this.SlideNode.pNode =7;
            //that.pos.startX = parseInt(that.pos.startX + that.elWidth*this.SlideNode.increaseFlagNum);
            //this.SlideNode.setPresentPos(this);

            //this.SlideNode.node[this.SlideNode.aNode+this.SlideNode.increaseFlagNum].className = this.SlideNode.node[this.SlideNode.aNode+this.SlideNode.increaseFlagNum].className+" active";
            /*
                                //this.SlideNode.setPresentPos(((this.SlideNode.pNode-1 < 0) ? this.SlideNode.node.length-1: this.SlideNode.pNode-1));
                                this.el.dispatchEvent(new CustomEvent("touchend"));

                                
                                var a = new CustomEvent("touchstart");
                                extend(a,{touches:[{pageX:0}]});
                                this.el.dispatchEvent(a);
                                */
            /*
                            this.pos.startX = 0;
                            this.pos.x = 0;
                            */
          }.bind(that)();

        /*
                        this.aNode = (this.pNode-1 < 0) ? this.node.length-1: this.pNode-1 ;
                        this.nNode = (this.pNode+1 >= this.node.length) ? 0: this.pNode+1 ;
                        for(_len;_len<this.node.length;_len++) {
                            this.node[_len].className = this.node[_len].className.replace(" active","");
                        }
                        this.node[this.pNode].className = this.node[this.pNode].className+" active";
                        this.node[this.nNode].className = this.node[this.nNode].className+" active";
                        this.node[this.aNode].className = this.node[this.aNode].className+" active";
                        */
      },
    });

    this.__proto__.setSlideNode = function () {
      this.SlideNode.node = this.wrap.children;
    };

    this.__proto__.init = function () {
      this._buildInitHtml();
      this._attachEvent();
      this.goPage(0);
    };

    this.__proto__.on = function (eventType, callBack) {
      var _fnStr = "on" + eventType,
        _fn = this[_fnStr],
        _callBack = function () {
          var _len = 0;

          return function () {
            if (typeof this.eventList[_fnStr][_len] != "function") {
              _len = 0;
              return true;
            } else if (this.eventList[_fnStr][_len](arguments[0])) {
              _len++;

              if (_len >= this.eventList[_fnStr].length) {
                _len = 0;
                return true;
              } else {
                return _callBack(arguments[0]);
              }
            } else {
              _len = 0;
              return false;
            }
          }.bind(this);
        }.bind(this)();

      this.eventList[_fnStr].push(callBack.bind(this));

      if (!this.hasOwnProperty(_fnStr)) {
        this[_fnStr] = function () {
          if (_callBack(arguments[0])) {
            _fn.apply(this, arguments);
          }
        };
      }
    };
    this.__proto__.off = function (eventType) {
      var _fnStr = "on" + eventType,
        _fn = this[_fnStr];

      if (this.hasOwnProperty(_fnStr)) {
        this.eventList[_fnStr].pop();
      }
    };

    this.init();
  };
})(window);
