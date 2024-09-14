import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationType } from 'src/app/services/notification.service';
import { Environment } from 'src/app/environment/environment';
import Translations from "../../../assets/json/translations.json";

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
    title: string = '';
    message: string = '';
    icon: string = '';
    color: string = '';

    constructor(public dialogRef: MatDialogRef<NotificationComponent>,
        @Inject(MAT_DIALOG_DATA) public notification: any) {
        this.message = notification.message;
        this.title = notification.title;

        switch (notification.type) {
            case NotificationType.Error:
                this.title = this.Translations['ErrorTitle'];
                this.icon = 'error';
                this.color = 'warn';
                break;
            case NotificationType.Info:
                this.icon = 'info';
                this.color = 'primary';
                break;
        }
    }

    onDismiss(): void {
        this.dialogRef.close(false);
    }

    get Translations() {
        return Translations[Environment.Language];
    }
}