
am5.ready(function() {

  // ایجاد root
  var root = am5.Root.new("chartdiv");

  // تم انیمیشنی
  root.setThemes([am5themes_Animated.new(root)]);

  // داده‌ها
  var data = [
    { name: "فروش حضوری", steps: 45688, pictureSettings: { src: "js/chart.js/online_shop_52853.jpg" } },
    { name: "سفارش عمده", steps: 35781, pictureSettings: { src: "https://www.amcharts.com/wp-content/uploads/2019/04/joey.jpg" } },
    { name: "فروش آنلاین", steps: 25464, pictureSettings: { src: "https://www.amcharts.com/wp-content/uploads/2019/04/ross.jpg" } },
    { name: "صادرات", steps: 18788, pictureSettings: { src: "https://www.amcharts.com/wp-content/uploads/2019/04/phoebe.jpg" } },
    { name: "فروش فصلی", steps: 15465, pictureSettings: { src: "https://www.amcharts.com/wp-content/uploads/2019/04/rachel.jpg" } },
    { name: "تخفیف‌ها و جشنواره‌ها", steps: 11561, pictureSettings: { src: "https://www.amcharts.com/wp-content/uploads/2019/04/chandler.jpg" } }
  ];

  // ایجاد نمودار
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      paddingTop: 100,  // فاصله از بالا برای متن‌ها
      paddingBottom: 70,
      paddingLeft: 40,
      paddingRight: 40
    })
  );

  // محور X
  var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 60 });
  xRenderer.grid.template.set("visible", false);
  xRenderer.labels.template.setAll({
    rotation: 0,
    centerX: 0.5,
    centerY: 0,
    dy: 10,          // فاصله پایین از ستون
    fontSize: 13,
    oversizedBehavior: "wrap",
    maxWidth: 100
  });

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, { categoryField: "name", renderer: xRenderer })
  );

  // محور Y
  var yRenderer = am5xy.AxisRendererY.new(root, {});
  yRenderer.grid.template.set("strokeDasharray", [3]);
  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, { min: 0, renderer: yRenderer })
  );

  // سری داده‌ها
  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Steps",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "steps",
      categoryXField: "name",
      sequencedInterpolation: true,
      calculateAggregates: true,
      maskBullets: false,
      tooltip: am5.Tooltip.new(root, { dy: -30, pointerOrientation: "vertical", labelText: "{valueY}" })
    })
  );

  series.columns.template.setAll({
    strokeOpacity: 0,
    cornerRadiusTL: 10,
    cornerRadiusTR: 10,
    cornerRadiusBL: 10,
    cornerRadiusBR: 10,
    maxWidth: 50,
    fillOpacity: 0.8
  });

  // Bullet
  var circleTemplate = am5.Template.new({});
  series.bullets.push(function(root, series, dataItem) {
    var bulletContainer = am5.Container.new(root, { dy: -10 }); // جابجایی کمی بالاتر
    var circle = bulletContainer.children.push(am5.Circle.new(root, { radius: 30 }, circleTemplate));
    var maskCircle = bulletContainer.children.push(am5.Circle.new(root, { radius: 25 }));
    var imageContainer = bulletContainer.children.push(am5.Container.new(root, { mask: maskCircle }));

    var image = imageContainer.children.push(
      am5.Picture.new(root, {
        templateField: "pictureSettings",
        centerX: am5.p50,
        centerY: am5.p50,
        width: 40,
        height: 40
      })
    );

    return am5.Bullet.new(root, { locationY: 0, sprite: bulletContainer });
  });

  // Heat rules
  series.set("heatRules", [
    { dataField: "valueY", min: am5.color(0xffcccc), max: am5.color(0x990000), target: series.columns.template, key: "fill" },
    { dataField: "valueY", min: am5.color(0xff3333), max: am5.color(0x990000), target: circleTemplate, key: "fill" }
  ]);

  // داده‌ها
  xAxis.data.setAll(data);
  series.data.setAll(data);

  // Cursor
  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineX.set("visible", false);
  cursor.lineY.set("visible", false);

  var currentlyHovered;
  series.columns.template.events.on("pointerover", function(e) { handleHover(e.target.dataItem); });
  series.columns.template.events.on("pointerout", function(e) { handleOut(); });
  function handleHover(dataItem) {
    if (dataItem && currentlyHovered != dataItem) {
      handleOut();
      currentlyHovered = dataItem;
      var bullet = dataItem.bullets[0];
      bullet.animate({ key: "locationY", to: 1, duration: 600, easing: am5.ease.out(am5.ease.cubic) });
    }
  }
  function handleOut() {
    if (currentlyHovered) {
      var bullet = currentlyHovered.bullets[0];
      bullet.animate({ key: "locationY", to: 0, duration: 600, easing: am5.ease.out(am5.ease.cubic) });
    }
  }

  // انیمیشن نمودار
  series.appear();
  chart.appear(1000, 100);

});