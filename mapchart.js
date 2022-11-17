/* globals d3, _*/
/* globals topojson, _*/

import genderChart from './genderchart.js';
import eventChart from './eventchart.js';
import medalTypeChart from './medalTypeChart.js';
import countryName from './countryName.js';

Promise.all([
        d3.json('world-110m.json'),d3.csv('athlete_medals.csv',d3.autoType)]
      ).then((data) => { 
        const defaultYear = 2008
        
        let map = data[0]
        let countries = data[1];
        
        let medals = computeMedalsForYear(defaultYear);
        
        const features = topojson.feature(map, map.objects.countries).features;

        const mySelect = document.getElementById('year-category');
        
        function computeMedalsForYear(year){
            let medalsForYear=[];
            let dataForYear=countries.filter(d=>d.Edition == year);
            for(let row of dataForYear){
               let country = row.NOC;
               let record = medalsForYear.find(d=>d.Country == country);
               if(!record){
                   record = {Country: country, Total: 0};
                   medalsForYear.push(record);
               }
               record.Total++;
            }
            return medalsForYear;
            
        }
        
        mySelect.onchange = function() {
            let year = document.getElementById("year-category").value;
            year = parseInt(year);
            d3.select("svg").remove();
            d3.select('#svgGender').remove();
            d3.select('#chartAges').remove();
            const countryDIV = document.getElementById("country");
            if (countryDIV.style.display !== "none"){
              countryDIV.style.display = "none";
            }
            
            medals = computeMedalsForYear(year)
            
            filterData(year);
        }
        
  
        let total = 0; 

        const filterData = (year) => {
            let restOfCountries = [];
              for (let i = 0; i < features.length; i++){
                let exist = false;
                for(let j =0; j<medals.length; j++){
                    if(medals[j].Country === features[i].properties.name){
                        features[i].properties.Total = medals[j].Total;
                        exist = true;
                    }
                }
                if(!exist) {
                  restOfCountries.push(features[i].properties.name)
                }
            }

            const width = 1500;
            const height = 500;

            const projection = d3.geoMercator()
                .fitExtent([[0,0], [width, height]],
                topojson.feature(map, map.objects.countries));

            const path = d3.geoPath()
                .projection(projection);
            const color = d3.scaleQuantize(d3.extent(features, d=>d.properties.Total), d3.schemeBlues[9])


           const hasMedals = (data) => {

              if(restOfCountries.includes(data.properties.name)){
                return "White"
              } 
             else {
                return color(data.properties.Total)
              }
            }
            
            
            const svg = d3.select('.mapchart').append('svg')
                .attr('viewBox', [0,0,width,height])

            svg.selectAll('path')
                .data(features)
                .join('path')
                .attr('d', path)
                .attr('fill', d => hasMedals(d))
                .on("mouseenter", (event, d) => {
                    const pos = d3.pointer(event, window);
                        d3.select("#tooltip")
                        .style("left", pos[0] + "px")
                        .style("top", pos[1] + "px")
                        .select("#value")
                        .html(
                            "Country: " + d.properties.name + "<br>" +
                            "Total medals: " + d.properties.Total + "<br>" 
                        )
                        d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseleave", (event, d) => {
                  d3.select("#tooltip").classed("hidden", true);

                })
                
                .on("click", (event,d)=> {
                  const countryDIV = document.getElementById("country");
                  countryDIV.innerHTML = `<span>${d.properties.name}<span>`; 
                  d3.select("#barchart-by-gender > *").remove();
                  d3.select("#barchart-by-event>*").remove();
                  d3.select("#piechart-by-medaltype>*").remove();
                  d3.select("#genderTitle").remove();
                  d3.select("#medalTitle").remove();

                          
                  if(d.properties.Total>0){ 
                      genderChart(data, d.properties.name, year)
                      eventChart(data, d.properties.name, year)
                      medalTypeChart(data, d.properties.name, year)
                  }
                });

            svg.append('path')
                .datum(topojson.mesh(map, map.objects.countries))
                .attr("d", path)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr("class", "subunit-boundary");
            }
            filterData(2008);
    });