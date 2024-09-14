import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotificationComponent } from "../helpers/notification/notification.component";

@Injectable({ providedIn: 'root' })
export class NotificationService {

    constructor(private dialog: MatDialog, public snackBar: MatSnackBar) { }

    error(message: string) {
        this.dialog.open(NotificationComponent, { data: { message: message, type: NotificationType.Error } });
    }

    info(title: string, message: string) {
        this.dialog.open(NotificationComponent, { data: { title: title, message: message, type: NotificationType.Info } });
    }

    notifyChange(message: string) {
        this.snackBar.open(message, 'OK', { duration: 2000 });
    }
}

export enum NotificationType {
    Error,
    Info
}