import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'
import { MaterialService } from 'src/app/shared/classes/material.service'
import { Position } from 'src/app/shared/interfaces'
import { PositionsService } from 'src/app/shared/services/positions.service'
import { OrderService } from '../order.service'

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {
  positions$!: Observable<Position[]>

  constructor(private route: ActivatedRoute, private positionService: PositionsService, private order: OrderService) {}

  ngOnInit(): void {
    this.positions$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.positionService.fetch(params.id)
      }),
      map((position: Position[]) => {
        return position.map((position) => {
          position.quantity = 0
          return position
        })
      })
    )
  }

  addToOrder(pos: Position) {
    this.order.add(pos)
    MaterialService.toast(`${pos.quantity} x ${pos.name} addeded to the order.`)
  }

}
