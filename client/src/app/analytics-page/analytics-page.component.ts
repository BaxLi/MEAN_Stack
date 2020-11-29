import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { Chart } from 'chart.js'

import { AnalyticsPage } from '../shared/interfaces'
import { AnalyticsService } from '../shared/services/analytics.service'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef?: ElementRef
  @ViewChild('order') orderRef?: ElementRef

  average: number = 0
  pending = true
  aSub?: Subscription

  constructor(private service: AnalyticsService) {}

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe()
  }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(255,99.132)'
    }

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54,162,235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map((item) => item.label)
      gainConfig.data = data.chart.map((item) => item.gain)

      orderConfig.labels = data.chart.map((item) => item.label)
      orderConfig.data = data.chart.map((item) => item.order)

      const gainCtx = this.gainRef?.nativeElement.getContext('2d')
      const orderCtx = this.orderRef?.nativeElement.getContext('2d')

      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }
}

function createChartConfig({ labels, data, label, color }) {
  return {
    type: 'line',
    options: { responsive: true },
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
