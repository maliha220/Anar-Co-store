am5.ready(function() {

// Create root and chart
var root = am5.Root.new("my");

root.setThemes([
  am5themes_Animated.new(root)
]);

var chart = root.container.children.push( 
  am5percent.PieChart.new(root, {
    layout: root.verticalLayout
  }) 
);

// Create series
var series = chart.series.push(
  am5percent.PieSeries.new(root, {
    valueField: "percent",
    categoryField: "type",
    fillField: "color",
    alignLabels: false
  })
);

series.slices.template.set("templateField", "sliceSettings");
series.labels.template.set("radius", 30);

// Set up click events
series.slices.template.events.on("click", function(event) {
  console.log(event.target.dataItem.dataContext)
  if (event.target.dataItem.dataContext.id != undefined) {
    selected = event.target.dataItem.dataContext.id;
  } else {
    selected = undefined;
  }
  series.data.setAll(generateChartData());
});

// Define data
var selected;
var types = [
  { type: "انار تازه", percent: 75, color: am5.color(0xFF4D4D) },       // قرمز روشن
  { type: "رب انار", percent: 60, color: am5.color(0xFF6666) },         // قرمز ملایم
  { type: "شربت انار", percent: 50, color: am5.color(0xFF8080) },       // قرمز روشن‌تر
  { type: "خشکبار انار", percent: 40, color: am5.color(0xFF9999) }     // صورتی-قرمز ملایم
];


series.data.setAll(generateChartData());

function generateChartData() {
  var chartData = [];
  for (var i = 0; i < types.length; i++) {
    if (i == selected) {
      if(types[i].subs) {
        for (var x = 0; x < types[i].subs.length; x++) {
          chartData.push({
            type: types[i].subs[x].type,
            percent: types[i].subs[x].percent,
            color: types[i].color,
            pulled: true,
            sliceSettings: { active: true }
          });
        }
      }
    } else {
      chartData.push({
        type: types[i].type,
        percent: types[i].percent,
        color: types[i].color,
        id: i
      });
    }
  }
  return chartData;
}

}); // end am5.ready()
