import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { MaterialService } from '../shared/classes/material.service'
import { User } from '../shared/interfaces'
import { AuthService } from '../shared/services/auth.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup
  aSub: Subscription

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.form = new FormGroup({})
    this.aSub = new Subscription()
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Successful registration!')
      } else if (params['accessDenied']) {
        MaterialService.toast('Access Denied, please authorise first')
      } else if (params['sessionFailed']) {
        MaterialService.toast('Access Denied, token expired, relogin')
      }
    })
  }

  get email() {
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  onSubmitForm(ev: Event) {
    const user: User = {
      ...this.form.value
    }
    this.form.disable()
    this.aSub = this.auth.login(user).subscribe(
      () => {
        MaterialService.toast('Successful login')
        this.router.navigate(['/overview'])
      },
      (err) => {
        MaterialService.toast(err.error.message || err.message)
        this.form.enable()
      }
    )
  }

  ngOnDestroy(): void {
    if (this.aSub) this.aSub?.unsubscribe()
  }
}
