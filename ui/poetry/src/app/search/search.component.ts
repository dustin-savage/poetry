import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {PoetryService} from "../service/poetry.service";
import {FormsModule} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly invalidChars = [";", "/"];
  private destroyed = new ReplaySubject<boolean>(1);
  author: string = "";
  title: string = "";
  resultCount: number = 0;

  constructor(private poetryService: PoetryService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.onSearch();

    // Subscribe to filter changes.
    this.poetryService.listenForFilterUpdates().pipe(takeUntil(this.destroyed)).subscribe(filters => {
      (filters || []).forEach(f => {
        if (f.field == 'author') {
          this.author = f.value || "";
          // Clear title when author is clicked.
          if (f.value) {
            this.title = "";
          }
        } else if (f.field == 'title') {
          this.title = f.value || "";
        }
      });
      this.changeDetectorRef.markForCheck();
      this.onSearch();
    });

    // Subscribe to results to update count.
    this.poetryService.listenForPoemResults().pipe(takeUntil(this.destroyed)).subscribe(poems => {
      this.resultCount = (poems || []).length;
      this.changeDetectorRef.markForCheck();
    });
  }

  onSearch() {
    this.poetryService.search(
      this.sanitize(this.author),
      this.sanitize(this.title)
    );
  }

  private sanitize(value: string) {
    let cleanValue = value;
    this.invalidChars.forEach(ch => {
      cleanValue = cleanValue.replaceAll(ch, "");
    });
    return cleanValue.trim();
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.onSearch();
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

}
