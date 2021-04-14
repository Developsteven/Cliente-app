import { Factura } from "../facturas/models/factura";
import { Region } from "./region";

export class Cliente {
  id: number;
  nombre: String;
  apellido: String;
  createAt: string;
  email: String;
  foto: String;

  region: Region;
  factura: Factura[] = [];
}
