import { FormControl } from '@angular/forms';

export interface Cliente {
  fecha: string;
  hora: string;
  cliente: string;
  celular: string;
  tipo: string;
  descripcion: string;
  alberca: number;
  mesaRegalos: boolean;
  colorMantel: string[];
  cantidadPersonas: number;
  brincolin: boolean;
  precio: number;
  anticipo: number;
  metodo: string;
  saldo: number;
  estado: string;
}

export interface ClienteForm {
  fecha: FormControl<string>;
  hora: FormControl<string>;
  cliente: FormControl<string>;
  celular: FormControl<string>;
  tipo: FormControl<string>;
  descripcion: FormControl<string>;
  alberca: FormControl<number>;
  mesaRegalos: FormControl<boolean>;
  colorMantel: FormControl<string[]>;
  cantidadPersonas: FormControl<number>;
  brincolin: FormControl<boolean>;
  precio: FormControl<number>;
  anticipo: FormControl<number>;
  metodo: FormControl<string>;
  saldo: FormControl<number>;
}