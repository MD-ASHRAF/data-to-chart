const form = document.getElementById('data-form');
const chartContainer = document.getElementById('chart-container');
const donutChartContainer = document.getElementById('donutChartContainer');
const backBtn = document.getElementById('back');
const generateChartBtn = document.getElementById('generateChart');
const printBtn = document.getElementById('printBtn');

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

    const data = months.map((month, index) => ({ label: month, value: values[index], isExpanded: false }));
    chartContainer.innerHTML = '';
    generateChart(data);
  }
}

backBtn.addEventListener('click', (event) => {
   window.open('index.html', '_self');
});

function generateChart(data) {
  // SVG dimensions
  const height = 400;
  const margin = 50;
  const width =  chartContainer.getBoundingClientRect().width;
  const radius = Math.min(width, height) / 2 - margin;

  // Color scale
  // Color scale
  const color = d3.scaleOrdinal()
  .domain(data.map((d, i) => i))
  .range(d3.schemeCategory10.slice(0, data.length));

  // Arc generator
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Pie function
  const pie = d3.pie()
    .value(d => d.value);

  // Create SVG
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2 + 10}, ${height / 2})`);

  // Create arcs
  const arcs = svg.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  // Add paths
  // Add paths
arcs.append("path")
  .attr("d", arc)
  .attr("fill", (d, i) => color(i))
  .on("click", function(node, d) {
    const currentAngle = (d.endAngle - d.startAngle);
    const newAngle = currentAngle + 0.1;
    let arcOver;
    if (!d.data.isExpanded) {
    // Expand the slice
      const currentAngle = (d.endAngle - d.startAngle);
      const newAngle = currentAngle + 0.1;
      arcOver = d3.arc()
        .innerRadius(0)
        .outerRadius(radius * 1.1);
        d.data.isExpanded = true;
        
      } else {
        arcOver = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

        d.data.isExpanded = false;
    }
    d3.select(this)
        .transition()
        .duration(500)
        .attr("d", arcOver(d));
  });

  

// Add labels
arcs.append("line")
  .attr("x1", d => arc.centroid(d)[0])
  .attr("y1", d => arc.centroid(d)[1])
  .attr("x2", d => {
    const angle = (d.startAngle + d.endAngle) / 2;
    const length = d.endAngle - d.startAngle < 0.1 ? radius * 1.5 : radius * 1.2;
    return Math.cos(angle - Math.PI / 2) * length;
  })
  .attr("y2", d => {
    const angle = (d.startAngle + d.endAngle) / 2;
    const length = d.endAngle - d.startAngle < 0.1 ? radius * 1.5 : radius * 1.2;
    return Math.sin(angle - Math.PI / 2) * length;
  })
  .attr("stroke", "#4b4b4b");

arcs.append("text")
  .attr("x", d => {
    const angle = (d.startAngle + d.endAngle) / 2;
    const length = d.endAngle - d.startAngle < 0.1 ? radius * 1.7 : radius * 1.4;
    return Math.cos(angle - Math.PI / 2) * length;
  })
  .attr("y", d => {
    const angle = (d.startAngle + d.endAngle) / 2;
    const length = d.endAngle - d.startAngle < 0.1 ? radius * 1.7 : radius * 1.4;
    return Math.sin(angle - Math.PI / 2) * length + 5;
  })
  .text(d => d.data.label +': '+d.data.value)
  .attr("text-anchor", d => {
    const angle = (d.startAngle + d.endAngle) / 2;
    return angle > Math.PI / 2 && angle < Math.PI * 3 / 2 ? "end" : "start";
  })
  .attr("alignment-baseline", "middle");

  // adjusting svg width if override
  const parentGroup = document.querySelector('#chart-container svg > g');
  const groupWIdth = parentGroup.getBoundingClientRect().width;
  const groupheight = parentGroup.getBoundingClientRect().height;
  const parentSVG = document.querySelector('#chart-container svg');
  const parentHeight = parentSVG.getBoundingClientRect().height;
  console.log(document.querySelector('#chart-container svg > g').getBoundingClientRect().width)
  parentSVG.style.width = groupWIdth > width ? (groupWIdth + 40) + 'px': width + 'px';
  parentSVG.style.height = groupheight + 50 > parentHeight ? (groupheight + 100) + 'px': parentHeight + 'px';
  parentGroup.classList.add('move')


// Add legend
const legend =  d3.select("#chart-container").append("div").attr("class", "legends-wrap");

data.forEach((d, i) => {
  const  wrap = legend.append("p").attr("class", "legend");

  wrap.append("span")
    .style("width", '10px')
    .style("height", '10px')
    .style("margin-right", '5px')
    .style("display", 'inline-block')
    .style("background-color", color(i));

  wrap.append("span")
    .text(d.label +': '+ d.value);
});
}

function downloadAsIMage() {
  const doc = new window.jspdf.jsPDF();
  const element = chartContainer;
  const originalHeight = element.style.height;

    element.style.height = 'auto';
    element.style.height = (element.scrollHeight + 50)  + 'px';

    domtoimage.toPng(element)
        .then(function (dataUrl) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'pie-chart.png';
            link.click();
             element.style.height = originalHeight;
        })
        .catch(function (error) {
            console.error('Error generating image:', error);
             element.style.height = originalHeight;
        });
}

printBtn.addEventListener('click', function(event) {
  event.preventDefault();
  downloadAsIMage();
});
