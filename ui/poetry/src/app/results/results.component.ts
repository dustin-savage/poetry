import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PoetryService} from "../service/poetry.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {Poem} from "../model/poem";
import {NgForOf, NgIf} from "@angular/common";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatCardModule
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {

  poems: Poem[] = [];
  destroyed = new ReplaySubject<boolean>(1);

  constructor(private poetryService: PoetryService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.poetryService.listenForPoemResults().pipe(takeUntil(this.destroyed))
      .subscribe(poems => {
        this.poems = poems || [];
        this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

}
