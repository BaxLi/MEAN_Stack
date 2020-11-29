import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { MaterialService } from '../shared/classes/material.service'
import { User } from '../shared/interfaces'
import { AuthService } from '../shared/services/auth.service'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form: FormGroup
  aSub: Subscription

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.form = new FormGroup({})
    this.aSub = new Subscription()
  }

  ngOnDestroy(): void {
    this?.aSub.unsubscribe()
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('registered')
      } else if (params['accessDenied']) {
        MaterialService.toast('Access denied')
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
    const user: User = { ...this.form.value }
    this.form.disable()
    this.aSub = this.auth.register(user).subscribe(
      () => {
        MaterialService.toast('register successfuly')
        this.router.navigate(['/login'], {
          queryParams: { registered: true }
        })
      },
      (err) => {
        MaterialService.toast(err.error.message || err.message)
        this.form.enable()
      }
    )
  }
}
