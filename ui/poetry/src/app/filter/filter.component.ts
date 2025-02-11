import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ReplaySubject, takeUntil} from "rxjs";
import {PoetryService} from "../service/poetry.service";
import {NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    NgForOf,
    MatIcon
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

  constructor(private poetryService: PoetryService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.poetryService.listenForPoemResults().pipe(takeUntil(this.destroyed))
      .subscribe(poems => {
        this.filterValues = //[...new Set(
          (poems || [])
            // Map poem to field value
            .map(poem => <string>(<any> poem)[this.filterField])
            // Remove nulls or empty strings
            .filter(p => p && p.length)
            // Sort alphabetically
            .sort((a, b) => a.localeCompare(b));
        // Unique values
        this.filterValues = [...new Set(this.filterValues)];


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

}
