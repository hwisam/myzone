var hwiCalendarDay = function (node) {
  this.$el = $(node);
  this.scope = "calendar";
  this.$form = $(
    "<div class='calendar'><div class='navi'><i class='cal-prev'>A</i><span class='cal-info'>2018년 07월</span><i class='cal-next'> > </i></div><div class='head'><em> > </em><em> > </em><em>ȭ</em><em>B</em><em>C</em><em>D</em><em>E</em></div><div class='content'></div></div>"
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
  this.firstDayOfpMonth;
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

hwiCalendarDay.prototype.initSwiper = function (week) {
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
            that.nextDay();

            that.$el
              .find(".hwi-slide")
              .eq(this.SlideNode.pNode)
              .empty()
              .append(that.returnCalendar());
          } else {
            that.prevDay();

            that.$el
              .find(".hwi-slide")
              .eq(this.SlideNode.pNode)
              .empty()
              .append(that.returnCalendar());
          }
          _presentIdx = this.SlideNode.pNode;
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
hwiCalendarDay.prototype.setDate = function (date) {
  var date = date || new Date();

  if (!arguments[0]) {
    this.pYear = date.getFullYear();
    this.pMonth = date.getMonth();
    this.pDay = date.getDate();
  }
  this.year = date.getFullYear();
  this.month = date.getMonth();
  this.day = date.getDate();
};
hwiCalendarDay.prototype.prevDay = function () {
  //console.log(this.pYear+'-'+(this.pMonth+1)+"-"+(this.pDay-1))
  this.setDate(new Date(this.year, this.month, this.day - 1));
};
hwiCalendarDay.prototype.nextDay = function () {
  //console.log(this.pYear+'-'+(this.pMonth+1)+"-"+(this.pDay+1))
  this.setDate(new Date(this.year, this.month, this.day + 1));
};
hwiCalendarDay.prototype.drawCalendarForSwiper = function (swiperObj) {
  var _$form = this.$form.clone();

  this.$el.empty().append(_$form);
  this.$el
    .find(".hwi-slide")
    .eq(1)
    .append(this.year + "-" + this.month + "-" + this.day);
};
hwiCalendarDay.prototype.returnCalendar = function () {
  var _$form = $(document.createDocumentFragment());

  _$form.append(this.year + "-" + this.month + "-" + this.day);
  return _$form;
};
