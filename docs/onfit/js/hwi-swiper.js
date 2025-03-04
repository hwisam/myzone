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
      direction: "horizontal", // 가로형,세로형 vertical,horizontal
      transitionDuration: "300ms", // 스와이퍼 진행시간
      transitionTimingFunction: "linear",
      angel: 65,
      screenForm: "page", // page, list
      boundGuide: 0, // 스크롤시 바운드 되어지는 X,Y좌표(screenForm의 값이 list일때 사용됨)
      // defaultX // 기본 한 셀의 가로길이(screenForm의 값이 list일때 사용됨)
      // defaultY // 기본 한 셀의 세로길이(screenForm의 값이 list일때 사용됨)
      InitEventList: ["touchstart", "touchmove", "touchend"],
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
      orginX: 0, // 현재까지 이동한 x좌표(screenForm의 값이 list일때 사용됨)
      orginY: 0, // 현재까지 이동한 y좌표(screenForm의 값이 list일때 사용됨)
      boundGuideX: 0, // 스크롤시 바운드 되어지는 X좌표(screenForm의 값이 list일때 사용됨)[좌측을 0으로]
      boundGuideY: 0, // 스크롤시 바운드 되어지는 Y좌표(screenForm의 값이 list일때 사용됨)[상단을 0으로]
    };
    //this.emitMouse = false;
    this.__proto__.init = function () {
      this._buildInitHtml();
      this._attachEvent();
      if (this.isListOfScreenForm()) this.initListOfScreenForm();
      else this.initPageOfScreenForm();
    };
    this.__proto__.initListOfScreenForm = function () {
      var x = 0,
        y = 0,
        z = 0;

      this.isDirecHoriz()
        ? (this.pos.orginX = this.defOpt.defaultX)
        : (this.pos.orginY = this.defOpt.defaultY);
      this.isDirecHoriz()
        ? (this.defaultX = this.defOpt.defaultX || this.elWidth)
        : (this.defaultY = this.defOpt.defaultY || this.elHeight);
      this.SlideNode.increaseFlagNum &&
        (tmp = this.defaultX * this.SlideNode.increaseFlagNum);

      if (this.isDirecHoriz()) {
        this.pos.boundGuideX = this.defOpt.boundGuide;
        this.pos.orginX = this.pos.boundGuideX;
        for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
          this.SlideNode.node[_len].style.width = this.defaultX + "px";
          this.SlideNode.node[_len].style.transform =
            "translate3d(" +
            (this.defaultX * _len + this.pos.orginX) +
            "px, " +
            y +
            "px, " +
            z +
            "px)";
          this.SlideNode.node[_len].classList.add("active");
        }
      } else {
        this.pos.boundGuideY = this.defOpt.boundGuide;
        this.pos.orginY = this.pos.boundGuideY;
        for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
          this.SlideNode.node[_len].style.height = this.defaultY + "px";
          this.SlideNode.node[_len].style.transform =
            "translate3d(" +
            x +
            "px, " +
            (this.defaultY * _len + this.pos.orginY) +
            "px, " +
            z +
            "px)";
          this.SlideNode.node[_len].classList.add("active");
        }
      }
    };
    this.__proto__.initPageOfScreenForm = function () {
      this.goPage(1);
    };
    this.__proto__.isDirecBoth = function (e) {
      return this.defOpt.direction == "both" ? true : false;
    };
    this.__proto__.isListOfScreenForm = function () {
      return this.defOpt.screenForm == "list" ? true : false;
    };
    this.__proto__.isDirecHoriz = function (e) {
      return this.defOpt.direction == "horizontal" ? true : false;
    };
    this.__proto__.isDirecvert = function (e) {
      return this.defOpt.direction == "vertical" ? true : false;
    };
    this.__proto__.initMotionRelate = function () {
      this.pos.isMovingContinuity = undefined;
      this.pos.momento.x = 0;
      this.pos.momento.y = 0;

      for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
        this.SlideNode.node[_len].style.transitionDuration = "0ms";
      }
    };
    this.__proto__._retIdxInSlideNode = function (value) {
      var _cnt = 0;

      for (_cnt; _cnt < a.SlideNode.node.length; _cnt++) {
        if (this.SlideNode.node[_cnt].textContent === value) return _cnt;
      }
    };
    this.__proto__.setPosIsMovingContinuity = function (x, y) {
      var angle,
        _x = Math.pow(x, 2),
        _y = Math.pow(y, 2),
        delta = Math.sqrt(_x + _y);

      if (delta > 4) {
        if (this.isDirecHoriz()) angle = (Math.atan2(-y, x) * 180) / Math.PI;
        else angle = (Math.atan2(-x, y) * 180) / Math.PI;
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
    this.__proto__.ontouchstart = function (e) {
      this.pos.startX = e.touches[0].pageX;
      this.pos.startY = e.touches[0].pageY;

      this.initMotionRelate();
    };
    this.__proto__.ontouchmove = function (e) {
      var x = e.touches[0].pageX - this.pos.startX,
        y = e.touches[0].pageY - this.pos.startY,
        z = 0,
        realX = this.isDirecHoriz() ? x : 0,
        realY = this.isDirecvert() ? y : 0,
        realZ = 0;

      this.setPosIsMovingContinuity(x, y); // setting : this.pos.isMovingContinuity

      if (this.pos.isMovingContinuity === true) {
        e.preventDefault();
        e.stopPropagation();
        //this.SlideNode.setActivePos(this);  // touchmove 동안 active index  체크
        if (this.isListOfScreenForm()) {
          this._animateList(realX, realY);
        } else {
          this._animatePage(realX, realY);
        }
      }
      this.pos.momento.x = this.pos.x - x;
      this.pos.momento.y = this.pos.y - y;
      this.pos.x = x;
      this.pos.y = y;
    };
    this.__proto__.ontouchend = function (e) {
      e && e.preventDefault();
      e && e.stopPropagation();

      if (this.isListOfScreenForm()) {
        if (this.pos.isMovingContinuity === true) {
          this.setAdjustMomento();
          this._animateList();
          this._setAfterPos();
        }
      } else {
        this.SlideNode.setPresentPos(this);
        this._animatePage();
      }
    };
    this.__proto__._animatePage = function (_x, _y) {
      var x = _x || 0,
        y = _y || 0,
        z = 0,
        duration = _x || _y ? "0ms" : this.defOpt.transitionDuration;

      this.SlideNode.node[this.SlideNode.pNode].style.transitionDuration =
        duration;
      this.SlideNode.node[this.SlideNode.aNode].style.transitionDuration =
        duration;
      this.SlideNode.node[this.SlideNode.nNode].style.transitionDuration =
        duration;

      if (this.isDirecHoriz()) {
        this.SlideNode.node[this.SlideNode.pNode].style.transform =
          "translate3d(" + x + "px," + y + "px," + z + "px)";
        this.SlideNode.node[this.SlideNode.aNode].style.transform =
          "translate3d(" + (x - this.elWidth) + "px," + y + "px," + z + "px)";
        this.SlideNode.node[this.SlideNode.nNode].style.transform =
          "translate3d(" + (x + this.elWidth) + "px," + y + "px," + z + "px)";
      } else {
        this.SlideNode.node[this.SlideNode.pNode].style.transform =
          "translate3d(" + x + "px," + y + "px," + z + "px)";
        this.SlideNode.node[this.SlideNode.aNode].style.transform =
          "translate3d(" + x + "px," + (y - this.elHeight) + "px," + z + "px)";
        this.SlideNode.node[this.SlideNode.nNode].style.transform =
          "translate3d(" + x + "px," + (y + this.elHeight) + "px," + z + "px)";
      }
    };
    this.__proto__._animateList = function (_x, _y) {
      var adjustX = 0,
        adjustY = 0,
        duration = _x || _y ? "0ms" : this.defOpt.transitionDuration,
        matrix = _x || _y || 0;

      if (this.isDirecHoriz()) {
        for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
          adjustX = this.defaultX * _len + this.pos.orginX;
          this.SlideNode.node[_len].style.transitionDuration = duration;
          this.SlideNode.node[_len].style.transform =
            "translate3d(" + (adjustX + matrix) + "px, " + adjustY + "px, 0px)";
        }
      } else {
        for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
          adjustY = this.defaultY * _len + this.pos.orginY;
          this.SlideNode.node[_len].style.transitionDuration = duration;
          this.SlideNode.node[_len].style.transform =
            "translate3d(" + adjustX + "px, " + (adjustY + matrix) + "px, 0px)";
        }
      }
    };
    // 모멘토의한 이동할 거리를 미리 셋팅함.
    this.__proto__.setAdjustMomento = function (e) {
      if (this.isDirecHoriz()) {
        this.pos.orginX =
          parseInt(
            this.SlideNode.node[0].style.transform
              .replace(/translate3d[^0-9\-.,]/g, "")
              .split(",")[0]
          ) -
          this.pos.momento.x * 10;
        this.pos.orginX =
          Math.round(this.pos.orginX / this.defOpt.defaultX) *
          this.defOpt.defaultX;
      } else {
        this.pos.orginY =
          parseInt(
            this.SlideNode.node[0].style.transform
              .replace(/translate3d[^0-9\-.,]/g, "")
              .split(",")[1]
          ) -
          this.pos.momento.y * 10;
        this.pos.orginY =
          Math.round(this.pos.orginY / this.defOpt.defaultY) *
          this.defOpt.defaultY;
      }
    };
    this.__proto__._setAfterPos = function (e) {
      if (this.isDirecHoriz()) {
        if (this.pos.orginX > this.pos.boundGuideX) {
          setTimeout(
            function () {
              var x = 0,
                y = 0,
                z = 0;

              for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
                this.SlideNode.node[_len].style.transitionDuration = "250ms";
                this.SlideNode.node[_len].style.transform =
                  "translate3d(" +
                  (x + this.defaultX * _len + this.pos.boundGuideX) +
                  "px, " +
                  y +
                  "px, " +
                  z +
                  "px)";
              }
              this.pos.orginX = this.pos.boundGuideX;
            }.bind(this),
            0
          );
        } else if (
          this.pos.orginX <
          this.elWidth -
            this.defaultX * this.SlideNode.node.length -
            this.pos.boundGuideX
        ) {
          setTimeout(
            function () {
              var x = 0,
                y = 0,
                z = 0;

              for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
                this.SlideNode.node[_len].style.transitionDuration = "250ms";
                this.SlideNode.node[_len].style.transform =
                  "translate3d(" +
                  (this.elWidth -
                    this.defaultX * this.SlideNode.node.length +
                    this.defaultX * _len -
                    this.pos.boundGuideX) +
                  "px, " +
                  y +
                  "px, " +
                  z +
                  "px)";
              }
              this.pos.orginX =
                this.elWidth - this.defaultX * _len - this.pos.boundGuideX;
              console.log(this.pos.orginX);
            }.bind(this),
            0
          );
        }
      } else {
        if (this.pos.orginY > this.pos.boundGuideY) {
          setTimeout(
            function () {
              var x = 0,
                y = 0,
                z = 0;

              for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
                this.SlideNode.node[_len].style.transitionDuration = "250ms";
                this.SlideNode.node[_len].style.transform =
                  "translate3d(" +
                  x +
                  "px, " +
                  (y + this.defaultY * _len + this.pos.boundGuideY) +
                  "px, " +
                  z +
                  "px)";
              }
              this.pos.orginY = this.pos.boundGuideY;
            }.bind(this),
            0
          );
        } else if (
          this.pos.orginY <
          this.elHeight -
            this.defaultY * this.SlideNode.node.length -
            this.pos.boundGuideY
        ) {
          setTimeout(
            function () {
              var x = 0,
                y = 0,
                z = 0;

              for (var _len = 0; _len < this.SlideNode.node.length; _len++) {
                this.SlideNode.node[_len].style.transitionDuration = "250ms";
                this.SlideNode.node[_len].style.transform =
                  "translate3d(" +
                  x +
                  "px, " +
                  (this.elHeight -
                    this.defaultY * this.SlideNode.node.length +
                    this.defaultY * _len -
                    this.pos.boundGuideY) +
                  "px, " +
                  z +
                  "px)";
              }
              this.pos.orginY =
                this.elHeight - this.defaultY * _len - this.pos.boundGuideY;
            }.bind(this),
            0
          );
        }
      }
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
      this._animatePage();
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
        var _len = 0,
          delta;

        if (typeof that == "object") {
          delta = that.isDirecHoriz() ? that.pos.x : that.pos.y;
          if (that.pos.isMovingContinuity && Math.abs(delta) >= 50) {
            if (that && that.pos) {
              if (delta > 0) {
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
          }.bind(that)();
      },
    });
    this.__proto__.setSlideNode = function () {
      this.SlideNode.node = this.wrap.children;
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

    this.__proto__.reset = function () {
      this.initMotionRelate();
      if (this.isListOfScreenForm()) this.initListOfScreenForm();
      else this.initPageOfScreenForm();
    };
    this.__proto__.getVal = function () {
      return this.SlideNode.node[
        (this.pos.boundGuideY - this.pos.orginY) / this.defOpt.defaultY
      ].textContent;
    };
    this.__proto__.setVal = function (value) {
      var _cnt = 0,
        idx = 0;

      idx = this._retIdxInSlideNode(value);

      if (this.isDirecHoriz()) {
        val = this.pos.boundGuideX - idx * this.defaultX;
        this.pos.orginX = 0;
        this._animateList(val, 0);
        this.pos.orginX = val;
      } else {
        val = this.pos.boundGuideY - idx * this.defaultY;
        this.pos.orginY = 0;
        this._animateList(0, val);
        this.pos.orginY = val;
      }
    };
    this.init();
  };
})(window);
