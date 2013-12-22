(function(){
var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(10, "%");

var svg = d3.select("#d3bar").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("dist/data/barchart.tsv", type, function(error, data) {
x.domain(data.map(function(d) { return d.letter; }));
y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);

svg.append("g")
.attr("class", "y axis")
.call(yAxis)
.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", ".71em")
.style("text-anchor", "end")
.text("Frequency");

svg.selectAll(".bar")
.data(data)
.enter().append("rect")
.attr("class", "bar")
.attr("x", function(d) { return x(d.letter); })
.attr("width", x.rangeBand())
.attr("y", function(d) { return y(d.frequency); })
.attr("height", function(d) { return height - y(d.frequency); });

});

function type(d) {
d.frequency = +d.frequency;
return d;
}
})();
(function(){
var margin = { top: 50, right: 0, bottom: 100, left: 30 },
width = 960 - margin.left - margin.right,
height = 430 - margin.top - margin.bottom,
gridSize = Math.floor(width / 24),
legendElementWidth = gridSize*2,
buckets = 9,
colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];


d3.tsv("dist/data/heat.tsv",
function(d) {
return {
day: +d.day,
hour: +d.hour,
value: +d.value
};
},
function(error, data) {
var colorScale = d3.scale.quantile()
.domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
.range(colors);

var svg = d3.select("#d3heat").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
.data(days)
.enter().append("text")
.text(function (d) { return d; })
.attr("x", 0)
.attr("y", function (d, i) { return i * gridSize; })
.style("text-anchor", "end")
.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
.data(times)
.enter().append("text")
.text(function(d) { return d; })
.attr("x", function(d, i) { return i * gridSize; })
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(" + gridSize / 2 + ", -6)")
.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var heatMap = svg.selectAll(".hour")
.data(data)
.enter().append("rect")
.attr("x", function(d) { return (d.hour - 1) * gridSize; })
.attr("y", function(d) { return (d.day - 1) * gridSize; })
.attr("rx", 4)
.attr("ry", 4)
.attr("class", "hour bordered")
.attr("width", gridSize)
.attr("height", gridSize)
.style("fill", colors[0]);

heatMap.transition().duration(1000)
.style("fill", function(d) { return colorScale(d.value); });

heatMap.append("title").text(function(d) { return d.value; });

var legend = svg.selectAll(".legend")
.data([0].concat(colorScale.quantiles()), function(d) { return d; })
.enter().append("g")
.attr("class", "legend");

legend.append("rect")
.attr("x", function(d, i) { return legendElementWidth * i; })
.attr("y", height)
.attr("width", legendElementWidth)
.attr("height", gridSize / 2)
.style("fill", function(d, i) { return colors[i]; });

legend.append("text")
.attr("class", "mono")
.text(function(d) { return "≥ " + Math.round(d); })
.attr("x", function(d, i) { return legendElementWidth * i; })
.attr("y", height + gridSize);
});
})();
(function(){
var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var line = d3.svg.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.close); });

var svg = d3.select("#d3Line").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("dist/data/line.tsv", function(error, data) {
data.forEach(function(d) {
d.date = parseDate(d.date);
d.close = +d.close;
});

x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain(d3.extent(data, function(d) { return d.close; }));

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);

svg.append("g")
.attr("class", "y axis")
.call(yAxis)
.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", ".71em")
.style("text-anchor", "end")
.text("Price ($)");

svg.append("path")
.datum(data)
.attr("class", "line")
.attr("d", line);
});})();
