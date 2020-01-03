window.addEventListener('load', _ => {

    var data = {
        labels: [0],
        datasets: [
            {
                label: "alpha",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [0]
            },
            {
                label: "beta",
                fillColor: "rgba(100,187,205,0.2)",
                strokeColor: "rgba(100,187,205,1)",
                pointColor: "rgba(100,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [0]
            },
            {
                label: "gama",
                fillColor: "rgba(200,187,205,0.2)",
                strokeColor: "rgba(200,187,205,1)",
                pointColor: "rgba(200,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [0]
            }
        ]
    };


    let counter = 1;
    let flag = true;
    window.addEventListener('deviceorientation', (event) => {


        if (flag = true) {
            flag = false;
            setTimeout((event) => {
                data.labels.push(counter++)
                data.datasets[0].data.push(event.alpha);
               // data.datasets[1].data.push(event.beta);
               // data.datasets[2].data.push(event.gamma);
                console.log(event.alpha, event.beta, event.gamma)
                var ctx = document.getElementById("lineChart").getContext("2d");
                new Chart(ctx).Line(data,
                    { animation: false }
                );
                flag = true;
            }, 100, event)
        }

    })

    var chart = null;
    function displayLineChart() {

        var ctx = document.getElementById("lineChart").getContext("2d");
        var options = {};
        chart = new Chart(ctx).Line(data, options);
    }
    displayLineChart();
})