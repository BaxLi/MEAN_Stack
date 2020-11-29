import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { MaterialInstance, MaterialService } from '../shared/classes/material.service'
import { Order, OrderPosition } from '../shared/interfaces'
import { OrdersService } from '../shared/services/orders.service'
import { OrderService } from './order.service'

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modelRef: ElementRef
  isRoot: Boolean = false
  modal: MaterialInstance = {}
  loading:boolean = false
  oSub!:Subscription

  constructor(private router: Router, public order: OrderService, private ordersService: OrdersService) {
    this.modelRef = new ElementRef({})
  }

  removeOrderItem(orderPosition: OrderPosition) {
    this.order.removeItem(orderPosition)
  }

  submitModal() {
    this.loading =true
    const order: Order = {
      list: this.order.list.map((item) => {
        delete item._id
        return item
      })
    }
    this.oSub=this.ordersService.create(order).subscribe(
      (newOrder) => {
        MaterialService.toast(`Order ${newOrder.order} added.`)
        this.order.clear()
      },
      (err) => {
        MaterialService.toast(`Error saving order to DB`+err.error.message)
      },
      () => {
        if (!!this.modal.close) this.modal.close()
        this.loading =false
      }
    )

  }

  openModal() {
    if (!!this.modal.open) this.modal.open()
  }

  cancelModal() {
    if (!!this.modal.close) this.modal.close()
  }

  ngAfterViewInit(): void {
    if (!!this.modal) this.modal = MaterialService.initModal(this.modelRef)
  }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngOnDestroy(): void {
    if (!!this.modal.destroy) this.modal.destroy()
    if (this.oSub) this.oSub.unsubscribe()
  }
}
