import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { of, Observable, throwError, pipe } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';
import  LocalES  from '@angular/common/locales/es';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router){}
  
  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService. tap 1');
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        })
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.apellido = cliente.apellido.toUpperCase();
          //let datePipe = new DatePipe('en-US');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd/MMMM/yyyy', 'es');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService. tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
    );
  }

  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar',e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente) : Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    )
  }

  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  subirFoto(archivo: File, id): Observable<Cliente>{

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    return this.http.post(`${this.urlEndPoint}/upload/`, formData).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
