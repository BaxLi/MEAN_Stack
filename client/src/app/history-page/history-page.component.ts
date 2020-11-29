import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { MaterialInstance, MaterialService } from '../shared/classes/material.service'
import { Filter, Order } from '../shared/interfaces'
import { OrdersService } from '../shared/services/orders.service'

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef
  tooltip?: MaterialInstance
  isFilterVisible: boolean = false
  oSub?: Subscription
  loading: boolean = false
  reloading: boolean = false // for bunch page
  noMoreOrders: boolean = false

  orders: Order[] = []
  filter:Filter={}

  offset = 0
  limit = STEP

  constructor(private ordersService: OrdersService) {
    this.tooltipRef = new ElementRef({})
  }

  ngOnInit(): void {
    this.reloading = true
    this.fetchOrders()
  }

  private fetchOrders() {
    const params1 = {
      offset: this.offset,
      limit: this.limit
    }
    const params=Object.assign({},this.filter,params1 )
    this.oSub = this.ordersService.fetch(params).subscribe(
      (orders) => {
        this.orders = this.orders.concat(orders)
        this.noMoreOrders = orders.length < STEP
      },
      (err) => MaterialService.toast(err.error.message || err.message),
      () => {
        MaterialService.toast('Successfuly loaded')
        this.loading = false
        this.reloading = false
      }
    )
  }

  loadMore() {
    this.loading = true
    this.offset += STEP
    this.fetchOrders()
  }

  ngOnDestroy(): void {
    if (this.tooltip && this.tooltip.destroy) this.tooltip.destroy()
    this.oSub?.unsubscribe()
    this.filter={}
  }
  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  applyFilter(filter: Filter): void {
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetchOrders()
  }

  isFilterApplied():boolean {
    return this.isFilterVisible && (Object.keys(this.filter).length > 0)
  }
}
