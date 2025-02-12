import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ReplaySubject, takeUntil} from "rxjs";
import {PoetryService} from "../service/poetry.service";
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    NgForOf,
    MatIcon,
    MatProgressSpinnerModule,
    NgIf
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {

  @Input()
  filterLabel: string;

  @Input()
  filterField: string;

  filterValues: string[] = [];
  destroyed = new ReplaySubject<boolean>(1);
  searchInProgress: boolean = false;
  private readonly fieldToFilterIcon: any = {
    title: "title",
    author: "person",
    defaultIcon: "error_outline"
  };

  constructor(private poetryService: PoetryService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // Subscribe to results to update filters
    this.poetryService.listenForPoemResults().pipe(takeUntil(this.destroyed))
      .subscribe(poems => {
        this.filterValues =
          (poems || [])
            // Map poem to field value
            .map(poem => <string>(<any> poem)[this.filterField])
            // Remove nulls or empty strings
            .filter(p => p && p.length)
            // Sort alphabetically
            .sort((a, b) => a.localeCompare(b));
        // Use set to get unique values
        this.filterValues = [...new Set(this.filterValues)];

        this.changeDetectorRef.markForCheck();
      });

    // Subscribe to search progress
    this.poetryService.listenForSearchProgressUpdates().pipe(takeUntil(this.destroyed))
      .subscribe(searchInProgress => {
        this.searchInProgress = searchInProgress;
        this.changeDetectorRef.markForCheck();
      });
  }

  onValueClick(value: string) {
    this.poetryService.selectFilter({
        field: this.filterField,
        value
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  onClearFilter() {
    this.poetryService.selectFilter({
      field: this.filterField,
      value: ""
    });
  }

  getFilterIcon(): string {
    return this.fieldToFilterIcon[this.filterField] || this.fieldToFilterIcon.defaultIcon;
  }
}
