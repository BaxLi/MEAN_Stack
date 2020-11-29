import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Order } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})

export class HistoryListComponent implements OnDestroy, AfterViewInit {
@Input('orders') orders:Order[]
@ViewChild('modal') modalRef:ElementRef

modal:MaterialInstance
clickedOrder?:Order

  constructor() {
    this.orders = []
    this.modalRef = new ElementRef({})
    this.modal={}
  }

  selectedOrder(order:Order){
    this.clickedOrder=order
    if (this.modal&&this.modal.open) this.modal.open()
  }

  ngAfterViewInit(): void {
    this.modal=MaterialService.initModal(this.modalRef)
  }

  modalClose(): void {
    if (this.modal && this.modal.close) this.modal.close()
  }

  ngOnDestroy(): void {
    if (this.modal && this.modal.destroy) this.modal.destroy();
  }

  computePrice(order:Order):number {
    return order.list.reduce(
      (total, item)=>{ return total += item.cost*(item.quantity||0)},
      0)
  }

}
