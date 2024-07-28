import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-layout',
  templateUrl: './error-layout.component.html',
  styleUrls: ['./error-layout.component.scss']
})
export class ErrorLayoutComponent implements OnInit {
  mainSidebarOpen: any;
  
  constructor() { }

  ngOnInit(): void {
  }

  
  hoverEffect($event){
   this.mainSidebarOpen = $event.type == 'mouseover' ? 'main-sidebar-open' : '';
  }

}
