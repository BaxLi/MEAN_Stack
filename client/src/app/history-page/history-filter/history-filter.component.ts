import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core'
import { MaterialDatePicker, MaterialService } from 'src/app/shared/classes/material.service'
import { Filter } from 'src/app/shared/interfaces'

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements  OnDestroy, AfterViewInit {
  @Output() onFilter: EventEmitter<Filter>
  @ViewChild('start') startRef: ElementRef
  @ViewChild('end') endRef: ElementRef

  order?: number
  start: MaterialDatePicker
  end: MaterialDatePicker

  isValid: boolean = false

  constructor() {
    this.onFilter = new EventEmitter<Filter>()
    this.endRef = this.startRef = new ElementRef({})
    this.end = this.start = {}
  }

  ngAfterViewInit(): void {
    if (this.startRef) {
      this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this))
      this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
    }
    if (this.order) this.isValid =true
  }

  validate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValid = true
      return
    }
    this.isValid = this.start.date < this.end.date
    return
  }

  ngOnDestroy(): void {
    if (this.start && this.start.destroy) this.start.destroy()
  }

  submitFilter() {
    const filter: Filter = {}
    if (this.order) filter.order = this.order
    if (this.start.date) filter.start = this.start.date
    if (this.end.date) filter.end = this.end.date

    if (this.onFilter) this.onFilter.emit(filter)
  }

}
