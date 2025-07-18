const dashboardContainer = document.getElementById('dashboard');
const generateChartBtn = document.getElementById('generateChart');
const chartConatinerMapping = {
    barChart: "bar-chart.html",
    donutChart: "donut-chart.html",
    pieChart: "pie-chart.html",
    progressChart: 'progress.html'
}

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

dashboardContainer.addEventListener('click', (event) => {
    console.log(event.target.id);
    if (chartConatinerMapping[event.target.id]) {
        openChartPage(event.target.id);
    }
})

function openChartPage(pageName) {
  window.open(chartConatinerMapping[pageName], '_self');
}
