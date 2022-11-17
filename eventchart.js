/* globals d3, _*/

export default function render_barchart_by_event(countrydata, country, year) {
  const records = countrydata[1].filter(
    (d) => d.NOC == country && d.Edition == year
  );
  
  let countMap = {};

  for (let rec of records) {
    let event = rec.Discipline;
    countMap[event] = (countMap[event] || 0) + 1;
  }

  let data = Object.keys(countMap).map((key) => ({
    event: key,
    count: countMap[key],
  }));
  data = data.sort((a, b) => b.count - a.count).slice(0, 5);

  // set the dimensions and margins of the graph
  var svg = d3.select("#barchart-by-event"),
        margin = {top: 20, right: 20, bottom: 60, left: 60},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

  var svg = d3
    .select("#barchart-by-event")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear().domain([0, d3.max(data, d=>d.count)]).range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
 
   svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom -20) + ")")
        .style("text-anchor", "middle")
        .text("Top 5 Event")
        .attr("font-weight",function(d,i) {return 600;})

  // Y axis
  var y = d3
    .scaleBand()
    .range([0, height])
    .domain(
      data.map(function (d) {
        return d.event;
      })
    )
    .padding(0.1);

  svg.append("g").call(d3.axisLeft(y));

  //Bars
  svg
    .selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0.2))
    .attr("y", function (d) {
      return y(d.event);
    })
    .attr("width", function (d) {
      return x(d.count);
    })
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")
    .append("svg:title") // tooltip
    .text((d) => d.count);
}