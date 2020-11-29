import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service'
import { Position } from 'src/app/shared/interfaces'
import { PositionsService } from 'src/app/shared/services/positions.service'

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() categoryId: string
  @ViewChild('modal') modalRef: ElementRef

  positions: Position[] = []
  loading: boolean = false
  modal?: MaterialInstance
  form: FormGroup
  positionId: any = null

  constructor(private positionsService: PositionsService) {
    this.categoryId = ''
    this.modalRef = new ElementRef({})
    this.form = new FormGroup({})
  }

  onModalSubmit(ev: Event) {
    const completed = () => {
      if (!!this.modal && this.modal.close) this.modal.close()
      this.form.enable()
    }

    this.form.disable()
    const pos: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }
    if (!this.positionId) {
      this.positionsService.createPosition(pos).subscribe(
        (pos) => {
          MaterialService.toast('New position successfuly created')
          this.positions.push(pos)
        },
        (err) => {
          MaterialService.toast(err.error.message || err.message)
        },
        completed
      )
    } else pos._id = this.positionId
    this.positionsService.updatePosition(pos).subscribe(
      (position) => {
        MaterialService.toast('Position successfuly updated')
        const idx = this.positions.findIndex((p) => p._id === position._id)
        this.positions[idx] = position
      },
      (err) => MaterialService.toast(err.error.message || err.message),
      completed
    )
  }

  onSelectedPosition(pos: Position) {
    if (this.modal && !!this.modal.open) this.modal.open()
    this.positionId = pos._id
    this.form.patchValue({ name: pos.name, cost: pos.cost })
    MaterialService.updateTextInputs()
  }

  onDeletePosition(pos: Position) {
    const decision = window.confirm('Are you sure you want to DELETE this position ?')
    if (decision)
      this.positionsService.deletePosition(pos).subscribe(
        (msg) => {
          MaterialService.toast(msg.message)
          const idx = this.positions.findIndex((p) => p._id === pos._id)
          this.positions.splice(idx, 1)
        },
        (err) => MaterialService.toast(err.error.message || err.message),
      )
  }

  onAddPosition() {
    if (this.modal && !!this.modal.open) this.modal.open()
    this.positionId = null
    this.form.reset({ name: null, cost: 1 })
    MaterialService.updateTextInputs()
  }

  onModalCancel() {
    if (this.modal && !!this.modal.close) this.modal.close()
  }

  ngOnDestroy(): void {
    if (!!this.modal && !!this.modal.destroy) this.modal.destroy()
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')])
    })

    this.loading = true
    console.log('cat ID = ', this.categoryId)
    this.positionsService.fetch(this.categoryId).subscribe((positions) => {
      this.positions = positions
      this.loading = false
    })
  }

  get name() {
    return this.form?.get('name')
  }
  get cost() {
    return this.form?.get('cost')
  }
}
