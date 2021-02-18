import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  options: FormGroup;

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tService: ToastrService) {

    this.options = formBuilder.group({
      bottom: 0,
      fixed: true,
      top: 0
    });
  }

  ngOnInit(): void {
  }

  startAuthorRegistration(): void {
    this.tService.success('Author registration process started', 'Success');
  }

  startReaderRegistration(): void {
    this.tService.success('Reader registration process started', 'Success');
  }

  startWorkPublishing(): void {
    this.tService.success('Work publishing process started', 'Success');
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('authUser');
  }

}
