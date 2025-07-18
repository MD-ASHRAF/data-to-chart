const form = document.getElementById('data-form');
const chartContainer = document.getElementById('chart-container');
const barChartContainer = document.getElementById('barChartContainer');
const backBtn = document.getElementById('back');
const chartColor = document.getElementById('chartColor');
const printBtn = document.getElementById('printBtn');
const generateChartBtn = document.getElementById('generateChart');
const chartConatinerMapping = {
    barChart: "bar-chart.html",
    donutChart: "donutChartContainer"
}



form.addEventListener('submit', (e) => {
  e.preventDefault();
  prepareChartData();
});

function prepareChartData() {
  const monthField = document.getElementById('months');
  const valueField = document.getElementById('values');
  if (monthField.value?.length && valueField.value?.length) {
    const months = document.getElementById('months').value?.split(',').map((month) => month.trim());
    const values = document.getElementById('values').value?.split(',').map((value) => parseInt(value.trim()));

    const data = months.map((month, index) => ({ month, value: values[index] }));
    chartContainer.innerHTML = '';
    generateChart(data);
  }
}

backBtn.addEventListener('click', (event) => {
    window.open('index.html', '_self');
});

/* printBtn.addEventListener('click', (event) => {
    window.print();
    cordova.plugins.printer.print();
}); */

chartColor.addEventListener('input', (event) => {
      console.log('Input event: New color is', event.target.value);
      prepareChartData();
});

function generateChart(data) {
  const margin = { top: 30, right: 20, bottom: 70, left: 40 };
  const width = chartContainer.getBoundingClientRect().width - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select('#chart-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map((d) => d.month))
    .range([0, width])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([height, 0]);

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.month))
    .attr('y',  (d) => yScale(d.value || 0))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => height - yScale(d.value || 0))
    .attr('class', 'bar')
    .attr('fill', chartColor.value) 
    .transition()
    .duration(1000)
    .attr('y', (d) => yScale(d.value))
    .attr('height', (d) => height - yScale(d.value || 0));

    svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text((d) => d.value || 0)
        .attr('x', (d) => xScale(d.month) + xScale.bandwidth() / 2)
        .attr('y', (d) => height)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .transition()
        .duration(1000)
        .attr('y', (d) => yScale(d.value || 5) - 5);

  const xAxis = d3.axisBottom(xScale);
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'x-axis')
    .call(xAxis);
    
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

  // giving color to axis and child elements
  d3.selectAll('.x-axis path, .x-axis line, .y-axis path, .y-axis line').attr('stroke', '#000');
  d3.selectAll('.x-axis text, .y-axis text').attr('fill', '#000');
  d3.selectAll('.x-axis text').attr("transform", "rotate(-45)")
  .attr("x", -10)
  .attr("y", 10)
  .style("text-anchor", "end");
}
