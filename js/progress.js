const form = document.getElementById('data-form');
const chartContainer = document.getElementById('chart-container');
const donutChartContainer = document.getElementById('TAContainer');
const backBtn = document.getElementById('back');
const generateChartBtn = document.getElementById('generateChart');
const printBtn = document.getElementById('printBtn');

const chartColorBtn = document.getElementById('chartColor');
let chartColor = '#de1768';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  prepareChartData();
});


chartColorBtn.addEventListener('input', (event) => {
      chartColor = event.target.value;
      prepareChartData();
});

function prepareChartData() {
  const target = document.getElementById('target').value;
  const achieved = document.getElementById('achieved').value;
  if (!isNaN(target) && !isNaN(achieved)) {
    const percentage = (achieved / target);
    chartContainer.innerHTML = '';
    generateChart(target, achieved, percentage);
  }
}

backBtn.addEventListener('click', (event) => {
  window.open('index.html', '_self');
});

function generateChart(target, achieved, percentage) {
  const margin = { top: 50, right: 20, bottom: 50, left: 20 };
  const width = chartContainer.getBoundingClientRect().width - margin.left - margin.right - 10;
  const height = 50;

  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const progress = percentage; // Progress value between 0 and 1
  const maxValue = Math.max(target, achieved);

  const progressBar = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width * (target / maxValue))
    .attr("height", height)
    .attr("rx", '28px')
    .attr("ry", '28px')
    .attr("stroke", chartColor)
    .attr("stroke-width", 2)
    .attr("fill", "#fff");

  const progressFill = svg.append("rect")
    .attr("x", 5)
    .attr("y", 5)
    .attr("width", 0)
    .attr("height", height - 10)
    .attr("rx", '23px')
    .attr("ry", '24px')
    .attr("fill", chartColor);

  progressFill.transition()
  .duration(1500) // Animation duration in milliseconds
  .attr("width", Math.min(width - 10, (width - 10) * progress));

  const progressText = svg.append("text")
    .attr("x", 0)
    .attr("y", height / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style('fill', "#fff")
    .style('font-size', "16px")
    .style('stroke-width', "2")
    .text(`${Math.round(progress * 100)}%`);

  progressText.transition()
  .duration(1500)
  .tween("text", function() {
    const node = this;
    const interpolator = d3.interpolate(0, progress);
    return function(t) {
      node.textContent = `${Math.round(interpolator(t) * 100)}%`;
    };
  })
  .attr("x", Math.min(width - 30, (width - 30) * progress));

  // marker target
  const markerLineTarget = svg.append("line")
    .attr("x1", width * (target / maxValue))
    .attr("y1", -20)
    .attr("x2", width * (target / maxValue))
    .attr("y2", 0)
    .attr("stroke", "black")
    .attr("stroke-dasharray", 2,2)
    .attr("stroke-width", 1);

  const markerTextTarget = svg.append("text")
    .attr("x", width * (target / maxValue))
    .attr("y", - 25)
    .attr("id", 'markerTargetText')
    .attr("text-anchor", "middle")
    .text('Target: ' + target);

    
  const markerTargetTextWidth = d3.select('#markerTargetText').node().getBoundingClientRect().width;

  markerTextTarget.attr("x", width * (target / maxValue) - (markerTargetTextWidth / 2.2))

  // marker achieved
  const markerLine = svg.append("line")
    .attr("x1", height / 2)
    .attr("y1", height + 2)
    .attr("x2", height / 2)
    .attr("y2", height + 20)
    .attr("stroke", "black")
    .attr("stroke-dasharray", 2,2)
    .attr("stroke-width", 1);

  const markerText = svg.append("text")
    .attr("x", 0)
    .attr("y", height + 35)
    .attr("id", 'markerText')
    .attr("text-anchor", "middle")
    .text('Achieved: ' + achieved);

  markerLine.transition()
  .duration(1000)
  .attr("x1", Math.min(width - 10, (width - 10) * progress))
  .attr("x2", Math.min(width - 10, (width - 10) * progress));

  const markerTextWidth = d3.select('#markerText').node().getBoundingClientRect().width;

  markerText.transition()
    .duration(1000)
    .attr("x", Math.min(width - 10, (width - 10) * progress) - markerTextWidth / 2);
}


function downloadAsIMage() {
  domtoimage
    // make sure this ID matches the ID of the area you want to export
    .toJpeg(donutChartContainer, {
      quality: 0.95
    })
    .then(function (dataUrl) {
      // this actually makes the download "happen"
      var link = document.createElement("a");
      // you can name the file whatever you'd like
      // this is the file the user sees when downloading
      link.download = "file.jpeg";
      link.href = dataUrl;
      link.click();
    });
}
