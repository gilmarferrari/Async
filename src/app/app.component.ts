import { Component, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { delay } from 'rxjs/operators';
import { Environment } from './environment/environment';
import { LanguageComponent, Languages } from './helpers/language/language.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private loadingService: LoadingService, private dialog: MatDialog) { }

  ngOnInit() {
    this.listenToLoading();
    let storedLanguage = localStorage.getItem('language');
    Environment.Language = storedLanguage ?? Languages.English;

    if (!storedLanguage) {
      this.dialog.open(LanguageComponent);
    }
  }

  listenToLoading(): void {
    this.loadingService.loadingSub.pipe(delay(0)).subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
