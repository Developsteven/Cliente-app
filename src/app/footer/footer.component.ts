import { Component } from "@angular/core";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class footerComponent {
    public autor: any = {nombre: 'Steven', apellido: 'Perez'};
}