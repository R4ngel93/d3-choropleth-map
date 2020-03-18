import { colorLegend } from './legend.js';

/* Color */
const color = d3.scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeBlues[9]);

/* Data */
const COUNTY_URL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const EDUCATION_URL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';

/* SVG */
const svg = d3.select('svg');

/* Tooltip */
const tooltip = svg.append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

/* Path */
const myPath = d3.geoPath();

/* Load data */
const loadData = () => Promise.all([d3.json(COUNTY_URL), d3.json(EDUCATION_URL)])
  .then(([countiesData, educationData]) => {
    const counties = topojson.feature(countiesData, countiesData.objects.counties).features;
    svg.append('g')
      .attr('class', 'counties')
      .selectAll('path').data(counties)
      .enter().append('path')
      .attr('class', 'county')
      .attr("data-fips", (d) => d.id)
      .attr("data-education", d => {
        let result = educationData.filter(obj => obj.fips == d.id);
        if (result[0]) {
          return result[0].bachelorsOrHigher
        }
        //could not find a matching fips id in the data
        console.log('could find data for: ', d.id);
        return 0;
      })
      .attr("fill", d => {
        let result = educationData.filter(obj => obj.fips == d.id);
        if (result[0]) {
          return color(result[0].bachelorsOrHigher)
        }
        return color(0);
      })
      .attr('d', myPath)
      .on("mouseover", function (d) {
        tooltip.style("opacity", .9);
        tooltip.html(() => {
          let result = educationData.filter((obj) => obj.fips == d.id);
          result[0] ? console.log(`${result[0]['area_name']}\n${result[0]['state']}: ${result[0].bachelorsOrHigher}%`) : 0;
          return result[0] ? `${result[0]['area_name']}\n${result[0]['state']}: ${result[0].bachelorsOrHigher}%` : 0;
        })
          .attr("data-education", () => {
            let result = educationData.filter(obj => obj.fips == d.id);
            if (result[0]) { return result[0].bachelorsOrHigher }
            console.log('could find data for: ', d.id);
            return 0;
          })
      })
      .on("mouseout", function (d) {
        tooltip.style("opacity", 0);
      });


  });

/* Main function */
(function main() {
  loadData();
  colorLegend();
})();
