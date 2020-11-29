import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { Router } from '@angular/router'
import { MaterialService } from '../../classes/material.service'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})

export class SiteLayoutComponent implements  AfterViewInit {

  @ViewChild("floating") floatingRef: ElementRef;

  links = [
    { url: '/overview', name: 'Overview' },
    { url: '/analytics', name: 'Analytics' },
    { url: '/history', name: 'History' },
    { url: '/order', name: 'Add order' },
    { url: '/categories', name: 'Categories' }
  ]

  constructor(private auth: AuthService, private router: Router) {
    this.floatingRef=new ElementRef('')
  }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef)
  }

  logout(ev: Event): void {
    ev.preventDefault()
    this.auth.logout()
    this.router.navigate(['/login'])
  }
}
