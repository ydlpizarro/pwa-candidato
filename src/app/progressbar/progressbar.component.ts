import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {
  color: ThemePalette = 'primary';
  value = '01. Informações básicas';

  constructor() { }

  ngOnInit() {
  }

}
