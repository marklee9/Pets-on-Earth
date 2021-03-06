const pieChart = () => {
  // Constants
  let width = 1000;
  let height = 800;
  let radius = 400;
  let color = d3.scaleOrdinal(d3.schemePastel1);

  // Selecting div
  let chart = d3.select("#pie-chart-area")
    .append("svg")
      .attr("width", width)
      .attr("height", height);

  // adding tooltip
  let tooltip = d3.select("#pie-chart-area")
    .append("div")
      .classed("tooltip", true);
  tooltip.append("div")
    .classed("continent", true);
  tooltip.append("div")
    .classed("population", true);
  tooltip.append("div")
    .classed("percentage", true);

// Fetching the data.
d3.json("data/main-data.json").then((data) => {
  d3.selectAll("input[type=checkbox]")
    .on("click", (d) => change(data));

  let dataOfInterest = data[0].byContinents.map((d) => {
      d.population = Number(d.population);
    return d;
  });

  update(dataOfInterest);
});

// User's input filters different outcome.
const change = (data) => {
  let userInput = [];
  d3.selectAll("input[type=checkbox]")._groups.forEach((d) => {
    d.forEach((d2) => {
      if (d2.checked) {
        userInput.push(d2.defaultValue);
      }
    });
  });
  let dataOfInterest= []; 
    data[0].byContinents.forEach((d) => {
    if (userInput.includes(d.continent)) {
      dataOfInterest.push({
        continent: d.continent,
        population: Number(d.population)
      });
    }
    return d;
  });
  update(dataOfInterest);
};

const update = (data) => {
  let pie = d3.pie()
    .sort(null)
    .value(d => d.population)(data);

  // Counting total population.
  let totalPopulation = 0;
    data.forEach((datum) => {
      totalPopulation += datum.population;
    });

    // Pie chart properties
    let arcs = d3.arc()
      .innerRadius(100)
      .outerRadius(300)
      .padAngle(0.2)
      .padRadius(50)
      .cornerRadius(30);

    // Hover effect on each slice
    let arcHover = d3.arc()
        .innerRadius(155)
        .outerRadius(350)
        .padAngle(0.05)
        .cornerRadius(40);
  
    // Pie slice
    let sections = chart.append("g")
      .attr("transform", "translate(400, 400)")
      .selectAll("path")
      .data(pie);

      chart.selectAll("path").remove();
  
      let section = sections.enter().append("path")
        .attr("d", (d) => arcs(d))
        .attr("fill", (d) => color(d.data.continent))
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave);

      function mouseOver(d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("d", (d2) => arcHover(d2));
        tooltip.attr("hidden", null);
        tooltip.select('.continent')
          .html(d.data.continent);
        tooltip.select('.population')
          .html(d.data.population.toLocaleString());
        let percentage = Math.round(1000 * d.data.population / totalPopulation) / 10;
        tooltip.select('.percentage')
          .html(String(percentage) + " %");
      }

      function mouseLeave() {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("d", (d2) => arcs(d2));
        tooltip.attr("hidden", true);
      }

    // Legends
    let legends = chart.append("g")
      .attr("transform", "translate(780, 500)")
      .selectAll(".legends")
      .data(pie);

      chart.selectAll(".legends").remove();
      
      let legend = legends.enter()
        .append("g")
        .classed("legends", true)
        .attr("transform", (d,i) => "translate(0, " + ((i + 1) * 30) + ")");
        
      legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", (d) => color(d.data.continent));

      legend.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text((d) => d.data.continent);
  };
};

pieChart();