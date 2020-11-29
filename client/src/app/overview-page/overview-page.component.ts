import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Observable } from 'rxjs'
import { MaterialInstance, MaterialService } from '../shared/classes/material.service'
import { OverviewPage } from '../shared/interfaces'
import { AnalyticsService } from '../shared/services/analytics.service'

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef: ElementRef
  data$?: Observable<OverviewPage>
  tapTarget?: MaterialInstance
  yesterday:Date=new Date()

  constructor(private analytics: AnalyticsService) {
    this.tapTargetRef = new ElementRef({})
  }

  openInfo(){
    if (this.tapTarget && this.tapTarget.open) this.tapTarget.open()
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  ngOnDestroy(): void {
    if (this.tapTarget && this.tapTarget.destroy) this.tapTarget.destroy()
  }

  ngOnInit(): void {
    this.data$ = this.analytics.getOverview()
    this.yesterday.setDate(this.yesterday.getDate() -1)
  }
}
