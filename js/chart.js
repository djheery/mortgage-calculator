let repayChart = document.getElementById("myChart");
let myChart = new Chart(repayChart, {
  type: 'bar',
  data: {
    labels: [
      "5 Years", "10 Years", "15 Years", "20 Years", "25 Years", "30 Years", "35 Years", "40 Years"
    ],
    datasets: [{
      label: 'Amount to repay: ',
      data: [
        0,0,0,0,0,0,0,0
      ],
      backgroundColor: [
          'rgba(186,153,47, 0.9)',
      ],
      borderColor: [
          'rgb(62,62,66)',
      ],
      borderWidth: 0
    }]
  },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        position: 'start'
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      scales: {  
        xAxes: [{
          position: 'bottom',
          ticks:{
            min: 0,
            max: 200000
          }
          }],
        yAxes: [{
          ticks: {
            // callback: ,
          },
          scaleLabel: {
            display: true,
          }
        }]
      }    
    }
  });


console.log(myChart.options.scales.yAxes.ticks)
Chart.defaults.borderColor = '#e6e6e6'
// chart.options.plugins.legend.position = 'top'


