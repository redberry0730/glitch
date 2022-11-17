/* globals d3, _*/

export default function render_medal_type_piechart(countrydata, country, year) {
  const records = countrydata[1].filter(
    (d) => d.NOC == country && d.Edition == year
  );

  //init data
  var data = [
    { medal: "Gold", count: 0 },
    { medal: "Silver", count: 0 },
    { medal: "Bronze", count: 0 },
  ];

  //aggregate medal count by type
  for (let rec of records) {
    let d = data.find((item) => item.medal == rec.Medal);
    if (d) {
      d.count++;
    }
  }

  var svg = d3.select("#piechart-by-medaltype"),
    width = +svg.attr("width") - 60,
    height = +svg.attr("height") - 60,
    radius = Math.min(width, height) / 2,
    g = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = { Gold: "gold", Silver: "silver", Bronze: "#CD7F32" };

  var pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.count;
    });

  var path = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var label = d3.arc().outerRadius(radius).innerRadius(0);

  var arc = g
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arc
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return color[d.data.medal];
    });

  arc
    .append("text")
    .attr("transform", function (d) {
      return "translate(" + label.centroid(d) + ")";
    })
    .attr("dy", "0.35em")
    .style("text-anchor", "middle")
    .text(function (d) {
      return d.data.medal + ":" + d.data.count;
    });

  svg
    .append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + 40) + ")")
    .style("text-anchor", "middle")
    .text("Medal Type")
    .attr("id", "medalTitle")
    .attr("font-weight", function (d, i) {
      return 600;
    });
}
