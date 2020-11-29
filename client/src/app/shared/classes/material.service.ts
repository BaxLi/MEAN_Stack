import { ElementRef } from '@angular/core'

declare var M

export interface MaterialInstance {
  open?()
  close?()
  destroy?()
}
export interface MaterialDatePicker extends MaterialInstance {
  date?: Date
}

export class MaterialService {

  static initTapTarget(el:ElementRef):MaterialInstance{
    return M.TapTarget.init(el.nativeElement)
  }


  static initDatePicker(el: ElementRef, onClose: () => void): MaterialDatePicker {
    const rez = M.Datepicker.init(el.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearButton: true,
      onClose: onClose
    })
    return rez
  }

  static toast(message: string) {
    M.toast({ html: message })
  }

  static initializeFloatingButton(el: ElementRef): void {
    M.FloatingActionButton.init(el.nativeElement)
  }

  static updateTextInputs() {
    M.updateTextFields()
  }

  static initModal(el: ElementRef): MaterialInstance {
    if (el) return M.Modal.init(el.nativeElement)
    else return {}
  }

  static initTooltip(el: ElementRef): MaterialInstance {
    return M.Tooltip.init(el.nativeElement)
  }
}
