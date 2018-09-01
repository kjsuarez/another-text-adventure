import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.autoAuthUser()
  }
}
