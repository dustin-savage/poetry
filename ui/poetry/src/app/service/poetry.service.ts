import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, ReplaySubject, take} from "rxjs";
import {Poem} from "../model/poem";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Filter} from "../model/filter";

@Injectable({
  providedIn: 'root'
})
export class PoetryService {
  private poemResultUpdateEmitter = new ReplaySubject<Poem[]>();
  private filterUpdateEmitter = new ReplaySubject<Filter[]>();
  private searchProgressEmitter = new ReplaySubject<boolean>();
  private maxPoemCount = "1000";

  constructor(private http: HttpClient,
              private snackbar: MatSnackBar) {

  }

  public listenForPoemResults(): Observable<Poem[]> {
    return this.poemResultUpdateEmitter.asObservable();
  }

  public listenForFilterUpdates(): Observable<Filter[]> {
    return this.filterUpdateEmitter.asObservable();
  }

  public listenForSearchProgressUpdates(): Observable<boolean> {
    return this.searchProgressEmitter.asObservable();
  }

  search(author: string, title: string): void {
    // Notify that Search is in progress
    this.searchProgressEmitter.next(true);

    // Build filters
    const filters = [{
      name: "author",
      value: author
    }, {
      name: "title",
      value: title
    }, {
      name: "poemcount",
      value: this.maxPoemCount
    }
    ];

    // Join filter name with a comma
    const filterNameStr: string = filters.filter(f => f.value.length)
      .map(f => f.name).join(",");

    // Join filter values with a semicolon
    const filterValueStr: string = filters.filter(f => f.value.length)
      .map(f => f.value).join(";");

    // Build url for query
    let url = `https://poetrydb.org/${filterNameStr}/${filterValueStr}/title,author,lines`;

    this.http.get<Poem[] | any>(url).pipe(take(1)).subscribe({
      next: poems => {
        if (Array.isArray(poems)) {
          // Notify observers of results
          this.poemResultUpdateEmitter.next(poems);
        } else {
          // Notify observers: No results found.
          this.poemResultUpdateEmitter.next([]);
        }
      },
      error: (err) => {
        this.snackbar.open("Error fetching poems: " + JSON.stringify(err), undefined, {
          duration: 10000
        });
      },
      complete: () => {
        // Notify that search is no longer in progress
        this.searchProgressEmitter.next(false);
      }
    });
  }

  selectFilter(filter: Filter) {
    this.filterUpdateEmitter.next([filter]);
  }

}
