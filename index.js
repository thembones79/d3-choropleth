"use strict";

const title = `Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`;
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const path = d3.geoPath();

const render = (usa, edu) => {
  const bachelors = d => {
    for (let i = 0; i < edu.length; i++) {
      if (d.id === edu[i].fips) {
        let { bachelorsOrHigher } = edu[i];

        return bachelorsOrHigher;
      }
    }
    return 0;
  };

  const fips = d => {
    for (let i = 0; i < edu.length; i++) {
      if (d.id === edu[i].fips) {
        let { fips } = edu[i];

        return fips;
      }
    }
    return 0;
  };

  const tooltip = d3
    .select(".chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const tooltipText = d => {
    for (let i = 0; i < edu.length; i++) {
      if (d.id === edu[i].fips) {
        let { area_name, state, bachelorsOrHigher } = edu[i];

        return `${area_name}, ${state}: ${bachelorsOrHigher}%`;
      }
    }
    return "other";
  };

  const colorScale = d3
    .scaleSequential(d3.interpolateGreens)
    .domain([
      d3.min(topojson.feature(usa, usa.objects.counties).features, d =>
        bachelors(d)
      ),
      d3.max(topojson.feature(usa, usa.objects.counties).features, d =>
        bachelors(d)
      )
    ]);

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(usa, usa.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("data-fips", d => fips(d))
    .attr("data-education", d => bachelors(d))
    .attr("fill", d => colorScale(bachelors(d)))
    .on("mouseover", (d, i) => {
      tooltip.style("opacity", 0.8);
      tooltip
        .html(
          `<p class="bigger_text">
       ${tooltipText(d)}
       </p>
       `
        )
        .attr("data-education", d => bachelors(d))
        .style("left", "10px")
        .style("top", "10px")
        .style("transform", `translate(115px,75px)`);
    })
    .on("mouseout", d => {
      tooltip.style("opacity", 0);
    });

  svg
    .append("path")
    .attr("class", "county-borders")
    .attr(
      "d",
      path(
        topojson.mesh(usa, usa.objects.counties, function(a, b) {
          return a !== b;
        })
      )
    );

  svg
    .append("path")
    .attr("class", "state-borders")
    .attr("fill", "none")
    .attr(
      "d",
      path(
        topojson.mesh(usa, usa.objects.states, function(a, b) {
          return a !== b;
        })
      )
    );

  svg
    .append("text")
    .attr("class", "title")
    .attr("id", "description")
    .attr("y", 14)
    .attr("x", 190)
    .attr("text-anchor", "start")
    .text(title);

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("class", "legend")
    .style("transform", `translate(536px,45px)`);

  const legendGenerator = n => {
    let legendArr = [];
    const maxVal = d3.max(edu, d => d.bachelorsOrHigher);
    const minVal = d3.min(edu, d => d.bachelorsOrHigher);
    const valueLength = maxVal - minVal;
    const chunk = valueLength / n;
    for (let i = 0; i < n; i++) {
      legendArr.push(minVal + i * chunk);
    }
    return legendArr;
  };

  const legendData = legendGenerator(1000);

  const legendScale = d3
    .scaleLinear()
    .domain([d3.min(legendData), d3.max(legendData)])
    .range([250, 500]);

  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("class", "dot")
    .attr("y", -10)
    .attr("x", d => legendScale(d) - 182)
    .attr("width", 2)
    .attr("height", 10)
    .style("fill", d => colorScale(d));

  const legendAxis = d3
    .axisBottom(legendScale)
    .tickPadding(2)
    .tickSize(-10)
    .tickFormat(function(d) {
      return Math.round(d) + "%";
    });

  const legendAxisG = legend
    .append("g")
    .call(legendAxis)
    .attr("id", "legend-axis")
    .style("transform", `translate(-180px,0px)`);
};

Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
  ),
  d3.json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
  )
]).then(([usa, edu]) => {
  render(usa, edu);
});
