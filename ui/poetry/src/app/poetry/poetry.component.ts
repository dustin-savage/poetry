import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-poetry',
  templateUrl: './poetry.component.html',
  styleUrl: './poetry.component.scss'
})
export class PoetryComponent {

  constructor() {
  }

}
