import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  @Input() data: any;
  colors = ['#f1c40f', '#17a589', '#2471a3', '#cb4335', '#7d3c98', '#2e86c1'];

  linechart = [];


  randomScalingFactor() {
    return Math.round(Math.random() * 100);
  }

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    let lineconfig = {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: []
      },
      options: {
        responsive: false,
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Month'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        }
      }
    }
    for (var _i = 0; _i < 6; _i++) {
      lineconfig.data.datasets.push({
        label: 'My Second dataset',
        fill: false,
        backgroundColor: this.colors[_i],
        borderColor: this.colors[_i]
        data: [
          this.randomScalingFactor(),
          this.randomScalingFactor(),
          this.randomScalingFactor(),
          this.randomScalingFactor(),
          this.randomScalingFactor(),
          this.randomScalingFactor(),
          this.randomScalingFactor()
        ],
      });

    }






    this.linechart = new Chart('line', lineconfig);
  }


}
