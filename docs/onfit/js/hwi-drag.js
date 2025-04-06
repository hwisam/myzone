var hwiDrag = function (obj) {
  this.$el = $(obj);
  this.$target;
  this.InitEventList = [
    "mousedown",
    "mousemove",
    "mouseup",
    "touchstart",
    "touchmove",
    "touchend",
  ];
  this.eventList = {};
  this.InitEventList.forEach(
    function (v, i) {
      this.eventList["on" + v] = [];
    }.bind(this)
  );
  this.eventAddrPoint = {};

  this.isDrag = false;

  this.targetDefaultTop;
  this.targetDefaultLeft;
  this.targetOffsetTop;
  this.targetOffsetLeft;

  this.draggableClass = "hwi-touch-drop";
  this.draggableSubClass = "hwi-touch-point";
  this.movingType = ""; //horizontal,vertical,free,

  this.init();
};
hwiDrag.prototype.init = function () {
  this._attachEvent();
};
hwiDrag.prototype._attachEvent = function () {
  var aEvt = this.InitEventList,
    that = this,
    target = that.$el[0],
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
    that.eventAddrPoint = $.extend(that.eventAddrPoint, _tmp);
  });
};
hwiDrag.prototype._detachEvent = function () {
  var target = this.$el[0],
    aEvt = this.InitEventList;

  aEvt.forEach(
    function (v, i) {
      this.$el[0].removeEventListener(v, this.eventAddrPoint[v]);
    }.bind(this)
  );
};
hwiDrag.prototype._moving = function (v) {
  (this.movingType == "horizontal" || this.movingType == "") &&
    this.$target.css({ left: v.left });
  (this.movingType == "vertical" || this.movingType == "") &&
    this.$target.css({ top: v.top });
};
hwiDrag.prototype.onmousedown = function (e) {
  if ($(e.target).hasClass(this.draggableClass)) {
    this.$target = $(e.target);
    this.isDrag = true;
  }

  if (this.isDrag) {
    this.targetDefaultTop = e.pageY;
    this.targetDefaultLeft = e.pageX;
    this.targetOffsetTop = parseInt(this.$target.css("top"));
    this.targetOffsetLeft = parseInt(this.$target.css("left"));
  }
};
hwiDrag.prototype.onmousemove = function (e) {
  var x, y;

  if (this.isDrag) {
    e.preventDefault();

    (x = e.pageX - this.targetDefaultLeft + this.targetOffsetLeft),
      (y = e.pageY - this.targetDefaultTop + this.targetOffsetTop);

    this._moving({ left: x, top: y });
  }
};
hwiDrag.prototype.onmouseup = function (e) {
  this.$target = null;
  this.isDrag = false;
};
hwiDrag.prototype.getOffsetParents = (function () {
  var getOffset,
    cnt = 0,
    totOffsetX = 0,
    totOffsetY = 0;

  return (getOffset = function (node) {
    totOffsetX = totOffsetX + node.offsetLeft;
    totOffsetY = totOffsetY + node.offsetTop;
    cnt++;

    if (node.offsetParent) {
      return getOffset(node.offsetParent);
    } else {
      var _totOffsetX = totOffsetX,
        _totOffsetY = totOffsetY;

      cnt = 0;
      totOffsetX = 0;
      totOffsetY = 0;

      return { x: _totOffsetX, y: _totOffsetY };
    }
  });
})();
hwiDrag.prototype.ontouchstart = function (e) {
  if (!this.draggableSubClass && $(e.target).hasClass(this.draggableClass)) {
    this.$target = $(e.target);
    this.isDrag = true;
  } else if ($(e.target).hasClass(this.draggableSubClass)) {
    this.$target = $(e.target).closest("." + this.draggableClass);
    this.isDrag = true;
  }

  if (this.isDrag) {
    this.targetDefaultTop = e.touches[0].pageY;
    this.targetDefaultLeft = e.touches[0].pageX;
    this.targetOffsetTop = parseInt(this.$target.css("top"));
    this.targetOffsetLeft = parseInt(this.$target.css("left"));
  }
};
hwiDrag.prototype.ontouchmove = function (e) {
  var x, y;

  if (this.isDrag) {
    e.preventDefault();

    (x = e.touches[0].pageX - this.targetDefaultLeft + this.targetOffsetLeft),
      (y = e.touches[0].pageY - this.targetDefaultTop + this.targetOffsetTop);

    this._moving({ left: x, top: y });
  }
};
hwiDrag.prototype.ontouchend = function (e) {
  this.$target = null;
  this.isDrag = false;
};
hwiDrag.prototype.on = function (eventType, callBack) {
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
hwiDrag.prototype.off = function (eventType) {
  var _fnStr = "on" + eventType,
    _fn = this[_fnStr];

  if (this.hasOwnProperty(_fnStr)) {
    this.eventList[_fnStr].pop();
  }
};
