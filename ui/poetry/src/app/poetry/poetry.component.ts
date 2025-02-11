import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PoetryService} from "../service/poetry.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-poetry',
  templateUrl: './poetry.component.html',
  styleUrl: './poetry.component.scss'
})
export class PoetryComponent implements OnInit {

  constructor(private poetryService: PoetryService,
              private snackbar: MatSnackBar,
              private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {

  }

}
