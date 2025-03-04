var imgPuzzleRotate = function (el, opt) {
  this.$el = $(el);

  this.$style = $("<style>");
  this.$wrapForm = $("<div class='wrap'>");
  this.$cellForm = $("<i>");

  this.$img = this.$el.find("img");

  this.cellWidth;
  this.cellHeight;

  this.option = {
    horSpace: 4,
    verSpace: 3,
    grap: 4,
  };

  $.extend(this.option, opt);

  this.init();
};
imgPuzzleRotate.prototype.init = function () {
  if (this.$img[0].complete) {
    this.setStruEnv();
    this.doBoneStruc();
    this.executeRotate();
  } else {
    this.loadImg();
  }
};
imgPuzzleRotate.prototype.loadImg = function () {
  this.$img.load(
    function () {
      this.setStruEnv();
      this.doBoneStruc();
      this.executeRotate();
    }.bind(this)
  );
};
imgPuzzleRotate.prototype.executeRotate = function () {
  var that = this;

  this.$img.remove();
  this.$el.find("i").css("transition-duration", "initial");

  this.$wrapForm.each(function (i, v) {
    $(v)
      .find("i")
      .each(function (i, v) {
        (function () {
          var rand = Math.random() * 845;

          return (function () {
            var duration = 1;

            setTimeout(function () {
              var cellIndex = $(v).index(),
                deg = 0,
                increase = 50,
                interval,
                intervalFn;

              intervalFn = function () {
                interval = setInterval(function () {
                  deg = deg + increase;
                  $(v).css("transform", "rotateX(" + deg + "deg)");

                  if (deg >= 720) {
                    clearInterval(interval);
                    deg = 0;
                    duration = duration + 3;
                    intervalFn();
                  }
                  if (duration >= 9) {
                    clearInterval(interval);
                    deg = 0;
                  }
                }, duration);
              };
              intervalFn();

              that.$el
                .unbind("mouseenter.rotate" + cellIndex)
                .bind("mouseenter.rotate" + cellIndex, function () {
                  clearInterval(interval);
                  $(v).css("transform", "rotateX(0deg)");
                  that.$el.unbind("mouseenter.rotate" + cellIndex);
                });

              $(v)
                .unbind("mouseenter.rotate")
                .bind("mouseenter.rotate", function () {
                  clearInterval(interval);
                  $(v).css({ transform: "rotateX(0deg)" });
                });
            }, rand);
          })();
        })();
      });
  });
};
imgPuzzleRotate.prototype.setStruEnv = function () {
  var style, wrapWidth, wrapHeight;

  this.cellWidth = parseInt(this.$img[0].width / this.option.horSpace);
  this.cellHeight = parseInt(this.$img[0].height / this.option.verSpace);

  style =
    "	i { " +
    "		width : " +
    this.cellWidth +
    "px;" +
    "		height : " +
    this.cellHeight +
    "px;" +
    "		margin-right: " +
    this.option.grap +
    "px;" +
    "		margin-bottom: " +
    this.option.grap +
    "px;" +
    "		background:url(" +
    this.$img[0].src +
    ") no-repeat 0 0 ;" +
    "	} ";

  $("head").append(this.$style.text(style));

  if (this.option.grap) {
    wrapWidth = this.$img[0].width + this.option.horSpace * this.option.grap;
    wrapHeight = this.$img[0].height + this.option.verSpace * this.option.grap;
  } else {
    wrapWidth = this.$img[0].width;
    wrapHeight = this.$img[0].height;
  }

  this.$wrapForm.css({ width: wrapWidth, height: wrapHeight });
  this.$el.css({
    width: wrapWidth - this.option.grap,
    height: wrapHeight - this.option.grap,
  });
};
imgPuzzleRotate.prototype.doBoneStruc = function () {
  var countH = 0,
    countV = 0;

  for (countV; countV < this.option.verSpace; countV++) {
    for (countH = 0; countH < this.option.horSpace; countH++) {
      var $cellClone = this.$cellForm.clone();

      $cellClone.css(
        "background-position",
        -(countH * this.cellWidth) + "px " + -(countV * this.cellHeight) + "px"
      );
      this.$wrapForm.append($cellClone);
    }
  }
  this.$el.append(this.$wrapForm);
};
