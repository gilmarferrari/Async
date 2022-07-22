import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Singleton } from "src/app/singletons/singleton";
import Translations from "../../../assets/json/translations.json";

@Component({
    selector: 'app-language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss']
})

export class LanguageComponent {

    languages = Object.keys(Languages).map(key => key);

    constructor(private dialogRef: MatDialogRef<LanguageComponent>) { }

    onDismiss() {
        localStorage.setItem('language', Singleton.Language);
        this.dialogRef.close();
    }

    get Singleton() {
        return Singleton;
    }

    get Translations() {
        return Translations[Singleton.Language];
    }
}

export enum Languages {
    English = "English",
    Portuguese = "Portuguese"
}