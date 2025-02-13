import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {forkJoin, Observable, ReplaySubject, take} from "rxjs";
import {Poem} from "../model/poem";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Filter} from "../model/filter";

@Injectable({
  providedIn: 'root'
})
export class PoetryService {
  private poemResultUpdateEmitter = new ReplaySubject<Poem[]>();
  private filterResultUpdateEmitter = new ReplaySubject<Poem[]>();
  private filterUpdateEmitter = new ReplaySubject<Filter[]>();
  private searchProgressEmitter = new ReplaySubject<boolean>();
  private maxfilterCount = "1000";
  private maxPoemCount = "5";

  constructor(private http: HttpClient,
              private snackbar: MatSnackBar) {

  }

  public listenForPoemResults(): Observable<Poem[]> {
    return this.poemResultUpdateEmitter.asObservable();
  }
  public listenForFilterResults(): Observable<Poem[]> {
    return this.filterResultUpdateEmitter.asObservable();
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



    // Build url for query
    let filtersUrl = this.buildUrl(author, title, false);
    let resultsUrl = this.buildUrl(author, title, true);

    const obsArray: Observable<any>[] = [];
    obsArray.push(this.http.get<Poem[] | any>(filtersUrl));
    obsArray.push(this.http.get<Poem[] | any>(resultsUrl));
    forkJoin(obsArray).pipe(take(1)).subscribe({
      next: resultsArray => {
        // Handle filters
        const filterResults: Poem[] | any = resultsArray[0];
        if (Array.isArray(filterResults)) {
          // Notify observers of results
          this.filterResultUpdateEmitter.next(filterResults);
        } else {
          // Notify observers: No results found.
          this.filterResultUpdateEmitter.next([]);
        }
        // Handle poems
        const poemResults: Poem[] | any = resultsArray[1];
        if (Array.isArray(poemResults)) {
          // Notify observers of results
          this.poemResultUpdateEmitter.next(poemResults);
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

  private buildUrl(author: string, title: string, returnLines: boolean) {
    // Build filters
    const filters = [{
      name: "author",
      value: author
    }, {
      name: "title",
      value: title
    }, {
      name: "poemcount",
      value: returnLines ? this.maxPoemCount : this.maxfilterCount
    }
    ];

    // Join filter name with a comma
    const filterNameStr: string = filters.filter(f => f.value.length)
      .map(f => f.name).join(",");

    // Join filter values with a semicolon
    const filterValueStr: string = filters.filter(f => f.value.length)
      .map(f => f.value).join(";");

    // What fields to return
    const fields = returnLines ? "author,title,lines" : "author,title";

    // Build url
    return `https://poetrydb.org/${filterNameStr}/${filterValueStr}/${fields}`;
  }

}
