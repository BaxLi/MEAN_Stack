import { Injectable } from '@angular/core'
import { OrderPosition, Position } from '../shared/interfaces'

@Injectable()
export class OrderService {
  public list: OrderPosition[] = []
  public price = 0
  public totalCost = 0

  constructor() {}

  private calculateTotal(): number {
    return this.list.reduce((total, item) => {
      return (total += (item.quantity || 0) * item.cost)
    }, 0)
  }

  add(pos: Position) {
    const orderPosition: OrderPosition = Object.assign(
      {},
      { name: pos.name, cost: pos.cost, quantity: pos.quantity, _id: pos._id }
    )
    const candidate = this.list.find((p) => p._id === pos._id)

    if (candidate) {
      if (candidate.quantity) candidate.quantity += pos.quantity || 0
    } else {
      this.list.push(orderPosition)
    }
    this.totalCost = this.calculateTotal()
  }

  removeItem(pos: OrderPosition) {
    const candidateIdx = this.list.findIndex((p) => p._id === pos._id)
    if (candidateIdx >= 0) {
      this.list.splice(candidateIdx, 1)
      this.totalCost = this.calculateTotal()
    }
  }

  clear() {
    this.list=[]
    this.totalCost=0
  }
}
