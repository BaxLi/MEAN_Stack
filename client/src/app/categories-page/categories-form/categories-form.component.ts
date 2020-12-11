import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { switchMap } from 'rxjs/operators'
import { of } from 'rxjs'

import { CategoriesService } from 'src/app/shared/services/categories.service'
import { MaterialService } from 'src/app/shared/classes/material.service'
import { Category } from 'src/app/shared/interfaces'

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') inputRef: ElementRef
  isNew: boolean = true
  form: FormGroup
  image!: File
  imagePreview!: any
  category!: Category

  constructor(
                private route: ActivatedRoute,
                private categoriesService: CategoriesService,
                private router:Router
              )
    {
    this.form = new FormGroup({})
    this.inputRef = new ElementRef({})
  }

  ngOnInit(): void {
    this.form = new FormGroup({ name: new FormControl(null, Validators.required) })

    this.form.disable()
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params.id) {
            this.isNew = false
            return this.categoriesService.fetchById(params.id)
          }
          return of(null)
        })
      )
      .subscribe(
        (category: Category | any) => {
          if (category) {
            this.form.setValue({ name: category.name })
            this.imagePreview = category.imageSrc
            this.category = category
            MaterialService.updateTextInputs()
          }
        },
        (error) => MaterialService.toast(error.error.message || error.message)
      )
    this.form.enable()
  }

  onSubmit(ev: Event) {
    let obs$
    this.form.disable()

    if (this.isNew) {
      obs$=this.categoriesService.createNewCategory(this.form.value.name, this.image)
    } else {
      obs$=this.categoriesService.updateCategory(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      (category: Category | any) =>{
        if (category?.message === "category updated successfuly")
       { MaterialService.toast('Changes are saved successfully')}

        this.form.enable()
      },
      (err)=>{
        MaterialService.toast(err.error.message || err.message)
        this.form.enable()
      },
    )

  }

  deleteCategory(ev: Event){
    const decision=window.confirm("Are you sure you want to delete ?"+this.category.name)
    if (decision) {
      this.categoriesService.deleteCategory(this.category._id).subscribe(
        (res)=>{MaterialService.toast(res.message)},
        (err)=>{MaterialService.toast(err.error.message)},
        ()=>{
          this.router.navigate(['/categories'])
          this.category={name:'', _id:''}
      },
      )}
  }

  get name() {
    return this.form.get('name')
  }

  get categoryId():string {
    return this.category._id
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(ev: any) {
    const file = ev.target.files[0]
    this.image = file

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }
}
