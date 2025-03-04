var hwiCalendar = function (node) {
  this.$el = $(node);
  this.scope = "calendar";
  this.$form = $(
    "<div class='calendar'><div class='navi'><i class='cal-prev'>이전</i><span class='cal-info'>2018년 07월</span><i class='cal-next'>다음</i></div><div class='head'><em>일</em><em>월</em><em>화</em><em>수</em><em>목</em><em>금</em><em>토</em></div><div class='content'></div></div>"
  );
  this.swiperObj;

  this.pYear;
  this.pMonth;
  this.pDay;

  this.year;
  this.month;
  this.day;
  this.isWeek;
  this.weekOfMonth;
  this.weeksOfMonth;
  this.firstDayOfpMonth; //일:0 ~ 토:6
  this.ArrTotDayOfMonth = new Array(
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  );
  this.ArrDate = [];
  //this.init();
};

hwiCalendar.prototype.init = function (week) {
  week && (this.isWeek = true);
  this.setDate();
  //!week && (this.weekOfMonth = undefined);
  this.drawCalendar();
};
hwiCalendar.prototype.initSwiper = function (week) {
  var that = this,
    _presentIdx;

  this.$form
    .find(".content")
    .append(
      "<div class='hwi-wrap'><div class='hwi-slide' ></div><div class='hwi-slide' ></div><div class='hwi-slide' ></div></div>"
    );

  week && (this.isWeek = true);
  this.setDate();
  //!week && (this.weekOfMonth = undefined);

  this.drawCalendarForSwiper();
  this.bindEvent();
  this.swiperObj = new hwiSwiper(this.$el.find(".content")[0], {
    transitionDuration: "500ms",
  });
  this.swiperObj.goPage(1);

  (that = this), (_presentIdx = this.swiperObj.SlideNode.pNode);
  this.swiperObj.on("touchend", function () {
    setTimeout(
      function () {
        if (_presentIdx != this.SlideNode.pNode) {
          if (
            (_presentIdx == 0 && this.SlideNode.pNode == 1) ||
            (_presentIdx == 1 && this.SlideNode.pNode == 2) ||
            (_presentIdx == 2 && this.SlideNode.pNode == 0)
          ) {
            week ? that.nextWeek() : that.next();
            !week && (that.weekOfMonth = undefined);
            //console.log(that.weekOfMonth);

            that.$el
              .find(".hwi-slide")
              .eq(this.SlideNode.pNode)
              .empty()
              .append(that.returnCalendar());
          } else {
            week ? that.prevWeek() : that.prev();
            !week && (that.weekOfMonth = undefined);

            //console.log(that.weekOfMonth);

            that.$el
              .find(".hwi-slide")
              .eq(this.SlideNode.pNode)
              .empty()
              .append(that.returnCalendar());
          }
          _presentIdx = this.SlideNode.pNode;
          that.$el
            .find(".navi .cal-info")
            .html(
              that.year +
                "년 " +
                (that.month + 1) +
                "월 " +
                (that.weekOfMonth != undefined
                  ? "[" + (that.weekOfMonth + 1) + "주]"
                  : "")
            );
        }
      }.bind(this),
      0
    );
    return true;
  });
  this.swiperObj.on("touchstart", function () {
    that.$el.find(".hwi-slide").eq(this.SlideNode.aNode).empty();
    that.$el.find(".hwi-slide").eq(this.SlideNode.nNode).empty();
    return true;
  });
};
hwiCalendar.prototype.bindEvent = function (date) {
  var that = this;

  this.$el
    .find(".navi [class*='cal-']")
    .bind("click." + this.scope, function (e) {
      e.target.className == "cal-prev" &&
        (function () {
          that.swiperObj.pos.isMovingContinuity = true;
          that.swiperObj.pos.x = -100;
          that.swiperObj.SlideNode.setPresentPos(that.swiperObj);
          that.swiperObj.eventAddrPoint.touchend();

          that.$el
            .find(".hwi-slide")
            .eq(that.swiperObj.SlideNode.aNode)
            .empty();
        })();
      e.target.className == "cal-next" &&
        (function () {
          that.swiperObj.pos.isMovingContinuity = true;
          that.swiperObj.pos.x = 100;
          that.swiperObj.SlideNode.setPresentPos(that.swiperObj);
          that.swiperObj.eventAddrPoint.touchend();

          that.$el
            .find(".hwi-slide")
            .eq(that.swiperObj.SlideNode.nNode)
            .empty();
          /*
			calObj.swiperObj.on("touchend",function() {setTimeout(function() {console.log(this)},1000);return true;})
			*/
        })();
      e.target.className == "cal-info" &&
        (function () {
          var opt = {
            type: "alert",
            cls: "size-year",
            header:
              "<div class='navi'><i class='cal-year-prev'>이전</i><span class='cal-year-info'>" +
              that.year +
              "</span>년<i class='cal-year-next'>다음</i></div>",
            content:
              "<ul class='list'><li>1월</li><li>2월</li><li>3월</li><li>4월</li><li>5월</li><li>6월</li><li>7월</li><li>8월</li><li>9월</li><li>10월</li><li>11월</li><li>12월</li></ul>",
            btn: [],
          };
          var _layer = new layerPop(opt);
          _layer.$el.find(".list li").eq(that.month).addClass("on");

          _layer.$el.find(".navi").bind("click", function (e) {
            var year;

            if (
              $(e.target).hasClass("cal-year-prev") ||
              $(e.target).hasClass("cal-year-next")
            ) {
              $(e.target).hasClass("cal-year-prev") &&
                (year =
                  parseInt($(e.currentTarget).find(".cal-year-info").text()) -
                  1);
              $(e.target).hasClass("cal-year-next") &&
                (year =
                  parseInt($(e.currentTarget).find(".cal-year-info").text()) +
                  1);

              $(e.currentTarget).find(".cal-year-info").text(year);
              _layer.$el
                .find(".list")
                .empty()
                .append($(opt.content).find("li"));
              year == that.year &&
                _layer.$el.find(".list li").eq(that.month).addClass("on");
            }
          });
          _layer.$el.find(".list").bind("click", function (e) {
            that.setDate(
              new Date(
                _layer.$el.find(".cal-year-info").text(),
                parseInt(e.target.innerText) - 1,
                1
              )
            );

            //that.weekOfMonth = undefined;

            that.$el
              .find(".navi .cal-info")
              .html(
                that.year +
                  "년 " +
                  (that.month + 1) +
                  "월 " +
                  (that.weekOfMonth != undefined
                    ? "[" + (that.weekOfMonth + 1) + "주]"
                    : "")
              );
            that.$el
              .find(".hwi-slide")
              .eq(that.swiperObj.SlideNode.pNode)
              .empty()
              .append(that.returnCalendar());
            _layer.destroy();
          });
        })();
    });
};
hwiCalendar.prototype.setDate = function (date) {
  var date = date || new Date();

  if (!arguments[0]) {
    this.pYear = date.getFullYear();
    this.pMonth = date.getMonth();
    this.pDay = date.getDate();
  }
  this.year = date.getFullYear();
  this.month = date.getMonth();
  this.day = date.getDate();
  this.setFirstDayOfpMonth(); // first day of month
  this.setWeeksOfMonth(); // weeks of month
  this.setLeapMonth(); // leap month setting
  this.setArrDate(); // ArrDate setting
};
hwiCalendar.prototype.setFirstDayOfpMonth = function () {
  var setDate = new Date(this.year, this.month, 1);

  this.firstDayOfpMonth = setDate.getDay();
};
hwiCalendar.prototype.setWeeksOfMonth = function () {
  this.weeksOfMonth = Math.ceil(
    (this.ArrTotDayOfMonth[this.month] + this.firstDayOfpMonth) / 7
  );
};
hwiCalendar.prototype.setLeapMonth = function () {
  if ((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {
    this.ArrTotDayOfMonth[1] = 29;
  } else {
    this.ArrTotDayOfMonth[1] = 28;
  }
};
hwiCalendar.prototype.setArrDate = function () {
  var _wcnt = 0,
    _day = 1,
    daysOfMonth = this.ArrTotDayOfMonth[this.month];

  for (_wcnt; _wcnt < this.weeksOfMonth; _wcnt++) {
    this.ArrDate[_wcnt] = [];
    if (!_wcnt) {
      //this.ArrDate[0] = Array(this.firstDayOfpMonth);
      //this.ArrDate[0].fill(this.ArrTotDayOfMonth[this.month-1]);
      for (var k = this.firstDayOfpMonth; k > 0; k--) {
        this.ArrDate[0].push(this.ArrTotDayOfMonth[this.month - 1] + 1 - k);
      }
    }
    for (var _cnt = this.ArrDate[_wcnt].length; _cnt < 7; _cnt++) {
      //this.ArrDate[_wcnt].push((_day <= daysOfMonth)?_day:'');
      this.ArrDate[_wcnt].push(_day <= daysOfMonth ? _day : _day - daysOfMonth);

      if (
        this.pYear == this.year &&
        this.pMonth == this.month &&
        _day == this.day
      )
        this.weekOfMonth = _wcnt;

      _day++;
    }
  }

  !this.isWeek && (this.weekOfMonth = undefined);
};
hwiCalendar.prototype.prev = function () {
  var year = this.year,
    month = this.month;

  if (month < 1) {
    year = year - 1;
    month = 12;
  }
  this.ArrDate = [];
  this.weekOfMonth = undefined;
  this.setDate(new Date(year + "-" + month + "-1"));
};
hwiCalendar.prototype.next = function () {
  var year = this.year,
    month = this.month + 2;

  if (month > 12) {
    year = year + 1;
    month = 1;
  }
  this.ArrDate = [];
  this.weekOfMonth = undefined;
  this.setDate(new Date(year + "-" + month + "-1"));
};
hwiCalendar.prototype.prevWeek = function () {
  var weekOfMonth = this.weekOfMonth - 1;

  if (weekOfMonth < 0) {
    this.month = this.month - 1;

    if (this.month < 0) {
      this.year = this.year - 1;
      this.month = 11;
    }

    this.setFirstDayOfpMonth();
    this.weekOfMonth =
      Math.ceil(
        (this.ArrTotDayOfMonth[this.month] + this.firstDayOfpMonth) / 7
      ) - 1;
    this.setDate(
      new Date(
        this.year +
          "-" +
          (this.month + 1) +
          "-" +
          this.ArrTotDayOfMonth[this.month]
      )
    );
  } else {
    this.weekOfMonth = weekOfMonth;
  }
};
hwiCalendar.prototype.nextWeek = function () {
  var weekOfMonth = this.weekOfMonth + 1;

  this.weekOfMonth =
    Math.ceil((this.ArrTotDayOfMonth[this.month] + this.firstDayOfpMonth) / 7) -
    1;

  if (weekOfMonth > this.weekOfMonth) {
    this.month = this.month + 1;

    if (this.month > 11) {
      this.year = this.year + 1;
      this.month = 0;
    }

    this.setFirstDayOfpMonth();
    this.weekOfMonth = 0;
    this.setDate(new Date(this.year + "-" + (this.month + 1) + "-1"));
  } else {
    this.weekOfMonth = weekOfMonth;
  }
};
hwiCalendar.prototype.now = function () {
  this.setDate();
  this.drawCalendar();
};
hwiCalendar.prototype.drawCalendar = function ($node) {
  var _$form = this.$form.clone(),
    _$cell,
    $cell = $("<div class='day'></div>");

  this.ArrDate.forEach(
    function (v, i) {
      this.ArrDate[i].forEach(
        function (v2, i2) {
          _$cell = $cell.clone();
          !i2 && _$cell.addClass("clear");

          (this.weekOfMonth || this.weekOfMonth == 0) &&
            _$cell.addClass("hide") &&
            this.weekOfMonth == i &&
            _$cell.removeClass("hide");
          this.pYear == this.year &&
            this.pMonth == this.month &&
            this.pDay == this.ArrDate[i][i2] &&
            _$cell.addClass("now");

          //_$form.find(".content").append(_$cell.append(this.ArrDate[i][i2]));
          !$node
            ? _$form.find(".content").append(_$cell.append(this.ArrDate[i][i2]))
            : _$form
                .find(".hwi-slide")
                .eq($node.index())
                .append(_$cell.append(this.ArrDate[i][i2]));
        }.bind(this)
      );
    }.bind(this)
  );

  this.$el.empty().append(_$form);
  //this.$el.append("<div>"+this.year+"-"+(this.month+1)+"</div>");
};
hwiCalendar.prototype.drawCalendarForSwiper = function (swiperObj) {
  var _$form = this.$form.clone(),
    _$cell,
    $cell = $("<div class='day'></div>");

  this.ArrDate.forEach(
    function (v, i) {
      this.ArrDate[i].forEach(
        function (v2, i2) {
          _$cell = $cell.clone();
          !i2 && _$cell.addClass("clear");

          (this.weekOfMonth || this.weekOfMonth == 0) &&
            _$cell.addClass("hide") &&
            this.weekOfMonth == i &&
            _$cell.removeClass("hide");
          this.pYear == this.year &&
            this.pMonth == this.month &&
            this.pDay == this.ArrDate[i][i2] &&
            _$cell.addClass("now");

          i === 0 && this.ArrDate[i][i2] > 15 && _$cell.addClass("dim");
          i >= this.ArrDate.length - 1 &&
            this.ArrDate[i][i2] < 15 &&
            _$cell.addClass("dim");

          _$form
            .find(".hwi-slide")
            .eq(1)
            .append(_$cell.append(this.ArrDate[i][i2]));
        }.bind(this)
      );
    }.bind(this)
  );

  this.$el.empty().append(_$form);
  this.$el
    .find(".navi .cal-info")
    .html(
      this.year +
        "년 " +
        (this.month + 1) +
        "월 " +
        (this.weekOfMonth != undefined
          ? "[" + (this.weekOfMonth + 1) + "주]"
          : "")
    );
};
hwiCalendar.prototype.returnCalendar = function () {
  var _$form = $(document.createDocumentFragment()),
    _$cell,
    $cell = $("<div class='day'></div>");

  this.ArrDate.forEach(
    function (v, i) {
      this.ArrDate[i].forEach(
        function (v2, i2) {
          _$cell = $cell.clone();
          !i2 && _$cell.addClass("clear");

          this.isWeek &&
            _$cell.addClass("hide") &&
            this.weekOfMonth == i &&
            _$cell.removeClass("hide");
          this.pYear == this.year &&
            this.pMonth == this.month &&
            this.pDay == this.ArrDate[i][i2] &&
            _$cell.addClass("now");

          i === 0 && this.ArrDate[i][i2] > 15 && _$cell.addClass("dim");
          i >= this.ArrDate.length - 1 &&
            this.ArrDate[i][i2] < 15 &&
            _$cell.addClass("dim");

          //_$form.find(".content").append(_$cell.append(this.ArrDate[i][i2]));
          _$form.append(_$cell.append(this.ArrDate[i][i2]));
        }.bind(this)
      );
    }.bind(this)
  );

  return _$form;
};
