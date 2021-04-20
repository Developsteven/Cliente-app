import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, map, startWith } from 'rxjs/operators';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl();

  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value=> typeof value === 'string'? value: value.nombre),
        flatMap(value => value ? this._filter(value): [])
      );
  }


  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }
}
