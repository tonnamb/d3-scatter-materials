import * as d3 from "d3";

console.log('Loading app.js');

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Scale, range [=] pixels
var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory20);

// Axis objects
var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

// SVG object
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data
d3.csv("training.csv", function(error, data) {
  if (error) throw error;

  // Data formatting
  data.forEach(function(d) {
    d.bandGap = +d.bandGap;
    d.density = +d.density;
    d.formationEnergy = +d.formationEnergy;
    d.volume = +d.volume;
  });
  // console.log(data);

  // Domain [=] [min, max], .nice() extends domain so that it will round up
  x.domain(d3.extent(data, function(d) { return d.density; })).nice();
  y.domain(d3.extent(data, function(d) { return d.bandGap; })).nice();

  // Create x axis line, ticks
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  
  // Need to separate axis label from axis line for d3 v4
  svg.append("text")
      .attr("class", "label")
      .attr("transform", "translate(" + width + " ," + (height-10) + ")")
      .style("text-anchor", "end")
      .text("Density (g/cm^3)");

  // Create y axis line, ticks
  svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      
  // Create y axis label
  svg.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Band Gap (eV)");
  
  // Plot data as circles
  svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.density); })
        .attr("cy", function(d) { return y(d.bandGap); })
        .style("fill", function(d) { return color(d.chemicalFormula); });

/*
  // Add legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  */

});

