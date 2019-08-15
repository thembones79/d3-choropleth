"use strict";

const title = `Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`;
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const path = d3.geoPath();

/*

const loadAndProcessData = () =>
  Promise.all([
    d3.json(
      "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
    ),
    d3.json(
      "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
    )
  ]).then(([usa, edu]) => {
    const rowById = edu.reduce((accumulator, d) => {
      accumulator[d.area_name] = d;
      return accumulator;
    }, {});

    /*
  const countryName = {}

  tsvData.map(d=>{
  countryName[d.iso_n3]=d.name;
  })


    const countyMap = topojson.feature(usa, usa.objects.counties);

    countyMap.features.forEach(d => {
      Object.assign(d.properties, rowById[d.id]);
    });

    return countyMap;
  });



loadAndProcessData().then(countyMap => {

console.log(countyMap)



  svg
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(countyMap, countyMap.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "ass");

  svg
    .append("path")
    .attr("class", "county-borders")
    .attr(
      "d",
      path(
        topojson.mesh(countyMap, countyMap.objects.counties, function(a, b) {
          return a !== b;
        })
      )
    );











  colorScale
    .domain(countries.features.map(colorValue))
    .domain(
      colorScale
        .domain()
        .sort()
        .reverse()
    )
    .range(schemeSpectral[colorScale.domain().length]);

  colorLegendG.call(colorLegend, {
    colorScale,
    circleRadius: 8,
    spacing: 20,
    textOffset: 20,
    backgroundRectWidth: 250
  });

  const paths = g.selectAll("path").data(countries.features);

  paths
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", d => pathGenerator(d))
    .attr("fill", d => colorScale(colorValue(d)))
    .append("title")
    .text(d => d.properties.name + ": " + colorValue(d));





});



*/

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
    .attr("fill", d => colorScale(bachelors(d)))
    .append("title")
    .text(d => {
      for (let i = 0; i < edu.length; i++) {
        if (d.id === edu[i].fips) {
          let { area_name, state, bachelorsOrHigher } = edu[i];

          return `${area_name}, ${state}, smart people: ${bachelorsOrHigher}`;
        }
      }
      return "other";
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

     svg.append("text")
       .attr("class", "title")
       .attr("id", "description")
       .attr("y", 14)
       .attr("x", 190)
       .attr("text-anchor", "start")
       .text(title);




  const legenda = svg
    .append("g")
    .attr("id", "legend")
    .style(
      "transform",
      `translate(500px,50px)`
    );

  legenda.append("text").text("Legend:");

const legendaScale = d3
  .scaleLinear()
  .domain([0,100])
  .range([250, 700])
  .nice();

legenda
  .selectAll("rect")
  .data(edu)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("y", -18)
  .attr("x", d => legendaScale(d.bachelorsOrHigher) - 165)
  .attr("width", 2)
  .attr("height", 500)
  .style("fill", d => colorScale(d.bachelorsOrHigher));





  console.log({ edu });
/*
  const baseTemperature = data.baseTemperature;
  const xValue = d => d.year;
  const xAxisLabel = "Year";
  const yValue = d => d.month - 1;
  const yAxisLabel = "Month";
  const temperature = d => d.variance + baseTemperature;
  const rectWidth = 10;
  const margin = { top: 50, right: 40, bottom: 120, left: 90 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const tooltip = d3
    .select(".chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data.monthlyVariance, d => d.year),
      d3.max(data.monthlyVariance, d => d.year)
    ])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleBand()
    .domain(data.monthlyVariance.map(yValue))
    .range([0, innerHeight]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const yAxisTickFormat = number =>
    d3
      .format(".0f")(number)
      .replace(number, months[number]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("y", d => yScale(yValue(d)))
    .attr("x", d => xScale(xValue(d)))
    .attr("width", rectWidth)
    .attr("height", yScale.bandwidth())
    .attr("data-year", function(d) {
      return d.year;
    })
    .attr("data-month", function(d) {
      return d.month - 1;
    })
    .attr("data-temp", function(d) {
      return temperature(d);
    })
    .style("fill", d => colorScale(temperature(d)))

    .on("mouseover", (d, i) => {
      tooltip.style("opacity", 0.8);
      tooltip
        .html(
          `
       <p class="smaller_text">
       <strong>
       ${months[d.month - 1]}, ${d.year}
       </strong>
       </p>
       <p class="bigger_text">
       <strong>
       ${d3.format(".2f")(temperature(d))}°C
       </strong>
       </p>
       <p class="smaller_text">
       (Change: ${d3.format(".2f")(d.variance)}°C)
       </p>
       `
        )
        .attr("data-year", d.year)
        .style("left", xScale(xValue(d)) + "px")
        .style("top", yScale(yValue(d)) + "px")
        .style("transform", `translate(135px,95px)`);
    })
    .on("mouseout", d => {
      tooltip.style("opacity", 0);
    });

  const xAxis = d3
    .axisBottom(xScale)
    .tickPadding(2)
    .ticks(20)
    .tickFormat(d3.format("d"));

  const yAxis = d3
    .axisLeft(yScale)
    .tickPadding(1)
    .tickFormat(yAxisTickFormat);

  const yAxisG = g
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis");

  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -75)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel);

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 45)
    .attr("x", innerWidth / 2)
    .text(xAxisLabel);
*/


  const legend = svg
    .append("g")
    .attr("id", "legend")
    .style(
      "transform",
      `translate(200px,80px)`
    );

  legend.append("text").text("Legend2:");

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
    .range([250, 700])
    .nice();

  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("class", "dot")
    .attr("y", -18)
    .attr("x", d => legendScale(d) - 165)
    .attr("width", 2)
    .attr("height", 10)
    .style("fill", d => colorScale(d));

  const legendAxisTickFormat = number =>
    d3
      .format(".0f")(number)
      .replace(number, number + "°C");

  const legendAxis = d3
    .axisBottom(legendScale)
    .tickPadding(2)
    .tickFormat(legendAxisTickFormat);

  const legendAxisG = g
    .append("g")
    .call(legendAxis)
    .attr("id", "legend-axis")
    .attr("transform", `translate(150,${innerHeight + 100})`);
};

/*
d3.json(
  "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
)
  .then(usa => {
    console.log(usa);
    render(usa);
  })
  .then(
    d3
      .json(
        "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
      )
      .then(edu => {
        console.log(edu);
      })
  );
*/

Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
  ),
  d3.json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
  )
]).then(([usa, edu]) => {
  console.log(usa);
  console.log(edu);
  render(usa, edu);
});
