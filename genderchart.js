/* globals d3, _*/

export default function genderBarChart(countrydata, country, year) {
  const records = countrydata[1].filter(
    (d) => d.NOC == country && d.Edition == year
  );

  let men = { sex: "Men", count: 0 };
  let women = { sex: "Women", count: 0 };

  let data = [men, women];

  for (let rec of records) {
    if (rec.Gender == "Men") men.count++;
    else women.count++;
  }

  d3.select("#barchart-by-gender > *").remove();

  var svg = d3.select("#barchart-by-gender"),
    margin = { top: 20, right: 40, bottom: 60, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(
    data.map(function (d) {
      return d.sex;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.count;
    }),
  ]);

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.bottom) + ")"
    )
    .style("text-anchor", "middle")
    .text("Gender")
    .attr("id", "genderTitle")
    .attr("font-weight", function (d, i) {
      return 600;
    });

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Medal Count");

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("style", (d) => (d.sex === "Men" ? "fill:steelblue" : "fill:pink"))
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.sex);
    })
    .attr("y", function (d) {
      return y(d.count);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.count);
    })
    .append("svg:title") // tooltip
    .text((d) => "Medal Total:" + d.count);
}
