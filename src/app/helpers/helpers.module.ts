import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { MatIconModule } from '@angular/material/icon';
import { NotificationComponent } from './notification/notification.component';
import { LanguageComponent } from './language/language.component';



@NgModule({
  declarations: [
    NotificationComponent,
    LanguageComponent
  ],
  imports: [
    MaterialModule,
    MatIconModule
  ],
  exports: [NotificationComponent, LanguageComponent]
})
export class HelpersModule { }
