import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {Poem} from "../model/poem";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class PoetryService {
  private carUpdateEmitter = new ReplaySubject<Poem[]>();
  private intervalId: number;

  constructor(private http: HttpClient,
              private snackbar: MatSnackBar) {

  }

}
