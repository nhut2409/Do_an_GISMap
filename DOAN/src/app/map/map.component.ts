import { Component } from '@angular/core';
declare const mapJs: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

constructor(){
  
}
ngOnInit(): void {
  mapJs()
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  
  
}
}
