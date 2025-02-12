import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PoetryService} from "../service/poetry.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {Poem} from "../model/poem";
import {NgForOf, NgIf} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {

  poems: Poem[] = [];
  destroyed = new ReplaySubject<boolean>(1);
  searchInProgress: boolean = false;

  constructor(private poetryService: PoetryService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // Subscribe to search results
    this.poetryService.listenForPoemResults().pipe(takeUntil(this.destroyed))
      .subscribe(poems => {
        this.poems = poems || [];
        this.changeDetectorRef.markForCheck();
    });

    // Subscribe to search progress
    this.poetryService.listenForSearchProgressUpdates().pipe(takeUntil(this.destroyed))
      .subscribe(searchInProgress => {
        this.searchInProgress = searchInProgress;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

}
