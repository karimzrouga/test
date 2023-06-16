import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

  export class MapComponent implements OnInit{ 
    ngOnInit() {
      // Map initialization 
     var map = L.map('map').setView([33.892166, 9.561555], 5);
  
     //osm layer
     var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     });
     osm.addTo(map);
      //Marker add
    var marker = L.marker([35.797986, 10.616659] )
    //.bindPopup('<iframe width="300" height="300" src="https://www.youtube.com/embed/jHd1u_lM32c?start=937&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
    .addTo(map)
    .openPopup();
  
    var myIcon = L.icon({
    iconUrl: '../assets/red_marker.png',
    iconSize: [40, 40],
  });
  }
  }


