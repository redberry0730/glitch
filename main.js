

// d3.csv("IHME_GBD_2010_MORTALITY_AGE_SPECIFIC_BY_COUNTRY_1970_2010-2.csv").then(function(data) {
// 	BarChartAges(data);
// })


d3.csv('medalists.cvs', d3.autoType).then(data => {
    medalCount = data;

    let bottom = medalCount.columns.slice(6);

    medalCount.forEach(d=> {
        let total = 0;
        bottom.forEach(element => total += d[element]);
        d.total = total;
    });
  
  
  