import { Component, OnDestroy, OnInit } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { Category } from '../shared/interfaces'
import { CategoriesService } from '../shared/services/categories.service'

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  categories: Category[] = []
  loading:boolean = false
  aSub:any
  constructor(private categoriesService: CategoriesService) {
  }

  ngOnDestroy(): void {
    this.aSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.loading=true
    this.aSub=this.categoriesService.fetch().subscribe((res) => {
      this.categories = res
      this.loading=false
    })
  }
}
