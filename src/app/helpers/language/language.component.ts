import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Environment } from "src/app/environment/environment";
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
        localStorage.setItem('language', Environment.Language);
        this.dialogRef.close();
    }

    get Environment() {
        return Environment;
    }

    get Translations() {
        return Translations[Environment.Language];
    }
}

export enum Languages {
    English = "English",
    Portuguese = "Portuguese"
}