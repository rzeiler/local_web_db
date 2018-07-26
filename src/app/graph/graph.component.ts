import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  Chart
} from 'chart.js';


import {
  BehaviorSubject
} from 'rxjs';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  private _data = new BehaviorSubject < any > ([]);

  _chart: Chart = null;

  @Input()
  set data(value) {
    this._data.next(value);
  };

  get data() {
    return this._data.getValue();
  }

  colors = ['#f1c40f', '#17a589', '#2471a3', '#cb4335', '#7d3c98', '#2e86c1'];
  @ViewChild("line") tref: ElementRef;
 

  constructor() {

  }

  ngOnInit() {

    const _current_date = new Date();
    const maxDays = new Date(_current_date.getFullYear(), _current_date.getMonth() + 1, 0).getDate();

    let _labels = [];
    let cash_data = [];

    for (let i = 1; i <= maxDays; i++) {
      _labels.push(i);
      cash_data.push(0);
    }


    let config = {
      type: 'line',
      data: {
        labels: _labels,
        datasets: [{
          fill: true,
          backgroundColor: 'rgba(255, 99, 132,.5)',
          borderColor: 'rgb(255, 99, 132)',
          data: cash_data
        }]
      },
      options: {
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(tooltipItem) {
                return "Summe: "+ tooltipItem.yLabel +" €"; 
                
            }
          }
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
              labelString: 'Tag'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Summe'
            }
          }]
        }
      }
    }
    this._chart = new Chart(this.tref.nativeElement, config);

    this._data.subscribe((d) => {
      cash_data = [];
      if (d != null) {
        /* sort */
        var byDate = d.slice(0);
        byDate.sort(function (a, b) {
          return a.createdate - b.createdate;
        });
        let lastSum: number = 0;
        for (let i = 1; i <= maxDays; i++) {
          lastSum = 0;
          const found = byDate.filter(item => new Date(item.createdate).getDate() == i);
          found.forEach(item => {
            lastSum = parseFloat(item.total) + lastSum;
          });
          cash_data.push( lastSum);
        }
      }
      this._chart.data.datasets.forEach((dataset) => {
        dataset.data = cash_data;
      });
      this._chart.update();
    });
  }

}
