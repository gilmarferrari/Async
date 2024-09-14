import { Component, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NotificationService } from "../services/notification.service";
import { RequestService } from "../services/request.service";
import { Environment } from "../environment/environment";
import { HttpParams } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { LanguageComponent } from "../helpers/language/language.component";
import Translations from "../../assets/json/translations.json";
import moment from "moment";
import { Extensions } from "../helpers/extensions.module";
import { Clipboard } from '@angular/cdk/clipboard';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent {
    requestType: any = RequestType.GET;
    requestTypes: any[] = Object.keys(RequestType).map(key => key);
    authorizationTypes: any[] = Object.keys(AuthorizationType).map(key => key);
    history: any[] = [];
    response = {};
    bodyType: BodyType = BodyType.JSON;
    file: any = {};
    dates: any[] = [];
    showingFullHistory: boolean = false;
    requestRepeatCount: number = 0;

    @ViewChild("request") requestInput: any;
    @ViewChild("body") bodyInput: any;

    constructor(private requestService: RequestService, private sanitizer: DomSanitizer, private notificationService: NotificationService, private dialog: MatDialog,
        private clipboard: Clipboard, private route: ActivatedRoute, private router: Router) {
        this.history = JSON.parse(localStorage.getItem('history') ?? '[]');
        this.getHistory(3);
    }

    ngAfterViewInit() {
        const requestType = this.route.snapshot.queryParams['requestType'];
        const url = this.route.snapshot.queryParams['url'];
        const body = this.route.snapshot.queryParams['body']?.replace(/'/g, '"');
        const authType = this.route.snapshot.queryParams['authType'];

        this.requestType = requestType ?? this.requestType;
        this.requestInput.nativeElement.value = url ?? this.requestInput.nativeElement.value?.trim();
        this.bodyInput.nativeElement.value = body ?? this.bodyInput.nativeElement.value?.trim();

        Environment.AuthorizationType = authType ?? AuthorizationType.None;
        Environment.Token = undefined;
        
        this.beutify(this.bodyInput);

        this.router.navigate(['/async'], { relativeTo: this.route, replaceUrl: true });
    }

    sendRequest(url: string, body: any) {
        if (url?.length <= 0 || !url.toLowerCase().startsWith('http')) {
            this.notificationService.error(this.Translations['NoHttpProtocol'])
            return;
        }

        switch (this.bodyType) {
            case BodyType.File:
                body = this.file.body;
                break;
        }

        let requestLog = {
            type: this.requestType,
            url: url,
            body: body,
            status: Status.Pending,
            authType: Environment.AuthorizationType,
            token: Environment.Token,
            date: new Date()
        };

        this.history.push(requestLog);

        let splitUrl = url.split('?');
        let request = splitUrl[0];
        let params = new HttpParams();
        let observe: any;

        let urlParams = new URLSearchParams(`${splitUrl[1]}`);

        urlParams.forEach((value, key) => {
            params = params.append(key, value);
        });

        switch (this.requestType) {
            case RequestType.GET:
                observe = this.requestService.get(request, params);
                break;
            case RequestType.PUT:
                observe = this.requestService.put(request, params, body);
                break;
            case RequestType.PATCH:
                observe = this.requestService.patch(request, params, body);
                break;
            case RequestType.POST:
                observe = this.requestService.post(request, params, body);
                break;
            case RequestType.DELETE:
                observe = this.requestService.delete(request, params, body);
                break;
        }

        let performedRequestsCount: number = 0;

        do {
            this.performRequest(observe, requestLog);
            performedRequestsCount++;
        }
        while (performedRequestsCount < this.requestRepeatCount);
    }

    performRequest(observe: any, requestLog: any) {
        observe.subscribe({
            next: (response: any) => {
                this.history.find(i => i == requestLog).status = Status.Success;
                this.response = response;
                localStorage.setItem('history', JSON.stringify(this.history));
                this.getHistory();
            },
            error: (error: any) => {
                this.history.find(i => i == requestLog).status = Status.Error
                this.response = error;
                localStorage.setItem('history', JSON.stringify(this.history));
                this.getHistory();
            }
        });
    }

    beutify(field: any) {
        try {
            field.nativeElement.value = field.nativeElement.value ? JSON.stringify(JSON.parse(field.nativeElement.value), null, 4) : field.nativeElement.value;
        }
        catch { }
    }

    autofillFields(record: any) {
        this.requestType = record?.type;
        this.requestInput.nativeElement.value = record?.url;
        this.bodyInput.nativeElement.value = record?.body;

        Environment.AuthorizationType = record.authType ?? AuthorizationType.None;
        Environment.Token = record.token;

        this.beutify(this.bodyInput);
    }

    exportHistory() {
        return this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(JSON.stringify(this.history)))
    }

    importHistory(e: any) {
        let file: File = e.target.files[0];

        if (file && file.type != 'application/json') {
            this.notificationService.error(`${this.Translations['CannotImport']} ${file.type}.`);
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {

            let json = event.target.result;

            localStorage.setItem('history', json);
            this.history = JSON.parse(json);

            this.getHistory();
        });

        reader.readAsText(file, "UTF-8");
    }

    login() {
        this.notificationService.info(this.Translations['Not just yet!'], this.Translations['Very soon this feature will be available']);
    }

    changeLanguage() {
        this.dialog.open(LanguageComponent);
    }

    getHistory(count: number = 0) {
        let dateList: any[] = [];
        let distinctDates = Extensions.distinct(this.history, i => new Date(i.date).toDateString());

        count = distinctDates.length <= 3 ? 3 : count;

        distinctDates.reverse().slice(0, this.dates.length + count).forEach(date => {
            let label = new Date(date).toLocaleDateString(this.Translations['Local']);

            if (date.match(new Date().toDateString())) {
                label = this.Translations['Today'];
            }
            else if (date.match(moment().add(-1, 'days').toDate().toDateString())) {
                label = this.Translations['Yesterday'];
            }

            dateList.push({
                label: label,
                date: date,
                records: this.history.filter(i => date.match(new Date(i.date).toDateString()))
                    .sort((a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1)
            });
        });

        this.dates = dateList.sort((a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1);
        this.showingFullHistory = distinctDates.length == this.dates.length;
    }

    uploadFile(e: any) {
        let file: File = e.target.files[0];

        if (this.file == null) {
            this.notificationService.error(this.Translations['NoFileSelected']);
            return;
        }

        this.file.name = file.name;

        const formData = new FormData();
        formData.append('file', file);
        
        this.file.body = formData;
    }

    removeRecord(record: any) {
        this.history.splice(this.history.indexOf(record), 1);
        localStorage.setItem('history', JSON.stringify(this.history));
        this.getHistory();

        this.notificationService.notifyChange(this.Translations['Deleted']);
    }

    shareRecord(record: any) {
        let sharedComponent = `https://gilmarferrari.github.io/portfolio/projects/async?requestType=${record.type}&url=${record.url}&body=${record.body}&authType=${record.authType}`;
        sharedComponent = sharedComponent.replace(/\s/g, "").replace(/"/g, "'");
        this.clipboard.copy(sharedComponent);
        
        this.notificationService.notifyChange(this.Translations['Copied']);
    }

    get responseExplanation() {
        if (this.response.toString().includes('Method Not Allowed')) {
            return this.Translations[this.response.toString()];
        }
        else if (this.response.toString().includes('Unauthorized')) {
            return this.Translations[this.response.toString()];
        }
        else if (this.response.toString().includes('Forbidden')) {
            return this.Translations[this.response.toString()];
        }
        else if (this.response.toString().includes('Not Found')) {
            return this.Translations[this.response.toString()];
        }

        return '';
    }

    get tokenExpiration() {
        if (Environment.AuthorizationType == AuthorizationType.None || !Environment.Token?.split('.')[1]) {
            return { prefix: 'NoToken' };
        }

        const jwtToken = JSON.parse(atob(Environment.Token.split('.')[1]));
        const expires = new Date(jwtToken?.exp * 1000);

        return {
            prefix: expires <= moment().toDate() ? 'ExpiredAt' : 'ExpiresAt',
            expires: expires
        };
    }

    get Environment() {
        return Environment;
    }

    get Status() {
        return Status;
    }

    get BodyType() {
        return BodyType;
    }

    get AuthType() {
        return AuthorizationType;
    }

    get Translations() {
        return Translations[Environment.Language];
    }

    get Math() {
        return Math;
    }
}

export enum RequestType {
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
    POST = 'POST',
    DELETE = 'DELETE'
}

export enum AuthorizationType {
    None = 'None',
    Bearer = 'Bearer'
}

export enum Status {
    Success = 'Success',
    Error = 'Error',
    Pending = 'Pending'
}

export enum BodyType {
    JSON = 'Json',
    File = 'File'
}
