var layerPop = (function () {
  var form =
    '<div class="layer-pop" style="z-index:10000;">' +
    '	<div class="layer-content-wrap click-close">' +
    '		<div class="layer-content" >' +
    '			<div class="layer-bg click-close"></div>' +
    '			<h2 class="layer-content-tit">sample</h2>' +
    '			<div class="layer-content-cont">sample</div>' +
    '			<div  class="layer-content-btn"></div>' +
    '			<button class="click-close">닫기</button>' +
    "		</div>" +
    '		<div class="layer-content-dummy"></div>' +
    "	</div>" +
    "</div>";
  return function (_opt) {
    this.$el = $(form);
    this.scope = "layerpop";
    this.gScope = "layerpop" + new Date().getTime();
    this.opt = {
      type: "alert",
      cls: "alert",
      header: "header",
      content: "content",
      btn: [], //{txt:"",fn:""}
    };
    $.extend(this.opt, _opt);

    this.init();
  };
})();

layerPop.prototype.init = function () {
  this.setLayerPop();
  this.drawLayerPop();
  this.bindEvent();
};
layerPop.prototype.destroy = function () {
  this.unbindEvent();
  this.$el.remove();
};
layerPop.prototype.drawLayerPop = function () {
  $("body").prepend(this.$el);
  this._checkDupl();
};
layerPop.prototype.setLayerPop = function () {
  this._setZindex();
  this._setClass();
  this._setTitle();
  this._setContent();
  this._setBtn();
};
layerPop.prototype._setZindex = function () {
  if (this.constructor.bodyStyleOverflow == undefined) {
    this.constructor.bodyStyleOverflow = document.body.style.overflow;
    this.constructor.elZindex = parseInt(this.$el.css("z-index"));
  }
  this.$el.css("z-index", ++this.constructor.elZindex);
  //el.css("height",$(window).outerHeight()+'px');
};
layerPop.prototype._setClass = function () {
  this.$el.addClass(this.opt.cls);
};
layerPop.prototype._setTitle = function () {
  this.$el.find(".layer-content-tit").html(this.opt.header);
};
layerPop.prototype._setContent = function () {
  this.$el.find(".layer-content-cont").html(this.opt.content);
};
layerPop.prototype._setBtn = function () {
  var _n = 0,
    _$btn,
    $frgment,
    leng = this.opt.btn.length;

  if (!leng || this.opt.type != "alert") {
    this.$el.find(".layer-content-btn").remove();
  } else {
    $frgment = $(document.createDocumentFragment());
    for (_n; _n < leng; _n++) {
      _$btn = $(
        "<a href='#none' class='active' >" + this.opt.btn[_n].txt + "</a>"
      );
      _$btn.css({
        "background-color": this.opt.btn[_n].bg,
        width: 100 / leng + "%",
      });
      _$btn.bind("customEvent", this.opt.btn[_n].fn.bind(this));
      $frgment.append(_$btn);
    }
    this.$el.find(".layer-content-btn").append($frgment);
  }
};
layerPop.prototype.bindEvent = function () {
  this.$el.bind(
    "click." + this.scope,
    function (e) {
      if ($(e.target).hasClass("click-close")) {
        this.destroy();
      } else if ($(e.target).hasClass("active")) {
        e.preventDefault();
        $(e.target).trigger("customEvent");
      }
    }.bind(this)
  );
  /*
$(".container").bind("touchmove."+this.gScope,function(e) {
    console.log(this);
    e.preventDefault();
    e.stopPropagation();
});
*/

  /*
(function() {
    var
        that = this;

    $(window).bind("resize."+that.gScope,function(e) {
        var
            scroll = window.scrollY || window.pageYOffset|| document.documentElement.scrollTop;

        that.$el.css("top",scroll);
        that.opt.type == "page" && that.$el.find(".content").height($(window).height());
    });
}.bind(this))();
*/
};
layerPop.prototype.unbindEvent = function () {
  this.$el.unbind("click." + this.scope);
  /*
this.$el.find(".layer-content-wrap").unbind("touchmove."+this.scope);
*/
};
layerPop.prototype._checkDupl = function () {
  var $sibling = this.$el.siblings(".layer-pop:visible"),
    margin;

  if ($sibling.length > 0) {
    if (this.opt.type == "alert") {
      //this.$el.css({"margin-top":parseInt($sibling.css("margin-top"))+10,"margin-left":parseInt($sibling.css("margin-left"))+10});
    }
    this.$el.find(".layer-bg").remove();
  }
};
