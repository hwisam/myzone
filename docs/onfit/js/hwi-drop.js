var hwiDrop = function (node) {
  this.$el = $(node);
  this.dragObj = new hwiDrag(node);

  this.$self;
  this.$clone;

  this.arrMovingBlock = [];
  this.arrMovingBlockPos = [];

  this.newNum;
  this.oldNum;

  this.init();
};
hwiDrop.prototype.init = function () {
  this.bindEvent();
  this.resetMovingBlock();
  this.setMovingBlock();
};

hwiDrop.prototype.setMovingBlock = function () {
  this.$el.find("." + this.dragObj.draggableClass).each(
    function (i, v) {
      var _tmp;

      //v.style.backgroundColor = "#"+parseInt(Math.random()*0xffffff).toString(16)
      this.arrMovingBlock.push(v);
      _tmp = this.dragObj.getOffsetParents(v);
      this.arrMovingBlockPos.push({
        x: _tmp.x,
        y: _tmp.y,
        x2: v.offsetWidth + _tmp.x,
        y2: v.offsetHeight + _tmp.y,
      });
    }.bind(this)
  );
};
hwiDrop.prototype._drawClone = function () {
  this.$clone.addClass("clone");
  this.$clone.insertAfter(this.$self);
};
hwiDrop.prototype.resetMovingBlock = function () {
  if (this.$clone != undefined) {
    this.$self.removeClass("hwi-touch-ing").removeAttr("style");
    this.$clone.remove();
    this.$clone = undefined;
    this.$self = undefined;
    this.newNum = undefined;
    this.oldNum = undefined;

    $(this.arrMovingBlock).removeClass("target");
    this.arrMovingBlock = [];
    this.arrMovingBlockPos = [];
  }
};
hwiDrop.prototype.bindEvent = function () {
  /* 이벤트 초기화 */
  for (var key in this.dragObj.eventList) {
    this.dragObj.eventList[key] = [];
  }
  /*
this.dragObj.on("touchstart",function(e) {
    if ($(e.target).hasClass("hwi-touch-drop")) {
        //this._removeClone();
        this.$self = $(e.target);
        this.$clone = this.$self.clone();

        $(e.target).addClass("hwi-touch-ing");

        this._drawClone($(e.target));
    }
    return true;
}.bind(this));
*/
  /*
this.dragObj.on("touchstart",function(e) {
    if ($(e.target).hasClass("hwi-touch-point")) {
        //this._removeClone();
        
        this.$self = $(e.target).closest(".hwi-touch-drop");
        this.$clone = this.$self.clone();

        this.$self.addClass("hwi-touch-ing");

        this._drawClone(this.$self);
    }

this.dragObj.draggableClass = "hwi-touch-drop";
this.dragObj.draggableSubClass = "hwi-touch-point";
*/

  this.dragObj.on(
    "touchstart",
    function (e) {
      if (
        this.dragObj.draggableSubClass &&
        $(e.target).hasClass(this.dragObj.draggableSubClass)
      ) {
        //this._removeClone();

        this.$self = $(e.target).closest(".hwi-touch-drop");
        this.$clone = this.$self.clone();

        this.$self.addClass("hwi-touch-ing");

        this._drawClone(this.$self);
      } else if (
        !this.dragObj.draggableSubClass &&
        $(e.target).hasClass(this.dragObj.draggableClass)
      ) {
        //this._removeClone();

        this.$self = $(e.target);
        this.$clone = this.$self.clone();

        this.$self.addClass("hwi-touch-ing");

        this._drawClone(this.$self);
      }
      return true;
    }.bind(this)
  );

  this.dragObj.on(
    "touchend",
    function (e) {
      if (this.$self) {
        var targIdx;

        this.arrMovingBlock.forEach(
          function (v, i) {
            this.$self[0] === v && (targIdx = i);
          }.bind(this)
        );

        $(this.arrMovingBlock[targIdx]).insertAfter(
          this.arrMovingBlock[this.newNum]
        );
        $(this.arrMovingBlock[this.newNum]).insertAfter(this.$clone);

        this.resetMovingBlock();
        this.setMovingBlock();
      }
      return true;
    }.bind(this)
  );
  this.dragObj.on(
    "touchmove",
    function () {
      var oldNum = undefined,
        newNum = undefined;

      return function (e) {
        if (this.dragObj.isDrag) {
          this.arrMovingBlockPos.forEach(
            function (v, i) {
              if (
                ((!oldNum && !oldNum) || newNum != i) &&
                newNum != i &&
                e.touches[0].pageX > v.x &&
                e.touches[0].pageX < v.x2 &&
                e.touches[0].pageY > v.y &&
                e.touches[0].pageY < v.y2
              ) {
                $(this.arrMovingBlock).removeClass("inner-hover");
                $(this.arrMovingBlock[i]).addClass("inner-hover");

                if (newNum != oldNum) oldNum = newNum;

                newNum = i;

                console.log(newNum + " : " + oldNum);
                if (oldNum != undefined) {
                  $(this.arrMovingBlock[oldNum]).removeClass("target");
                  this.arrMovingBlock[newNum] !== this.$self[0] &&
                    $(this.arrMovingBlock[newNum]).addClass("target");

                  this.newNum = newNum;
                  this.oldNum = oldNum;
                }
              } else {
                $(this.arrMovingBlock[i]).removeClass("inner-hover");
              }
            }.bind(this)
          );
        }
        return true;
      }.bind(this);
    }.bind(this)()
  );
};
