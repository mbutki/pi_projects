var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/graphs', function (req, res) {
  res.send({
    chartData: {
        labels: ["11:23", "11:24", "11:25", "11:26", "11:27", "11:28"],
        datasets: [{
            label: 'Temp in family room (f)',
            data: [64, 66, 68, 68, 66, 65],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

