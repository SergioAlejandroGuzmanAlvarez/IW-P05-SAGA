import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[];
  constructor() { 
    this.clientes=[
      {
        fecha: '2023-04-20',
        hora: '14:00',
        cliente: 'Daniel López',
        celular: '3113113112',
        tipo: 'Cumpleaños',
        descripcion: 'Cumpleaños de 15 años',
        alberca: 80,
        mesaRegalos: true,
        colorMantel: ['rosa', 'azul'],
        cantidadPersonas: 100,
        brincolin: true,
        precio: 1000,
        anticipo: 500,
        metodo: 'Efectivo',
        saldo: 500,
        estado: 'Apartado',
      }
    ]
  }//constructor
  getclientes() {
    return this.clientes;
  }

  getcliente(fecha: string) {
    return this.clientes.find((cliente) => cliente.fecha === fecha);
  }

  addcliente(cliente: Cliente) {
    this.clientes.push(cliente);
    return this.clientes;
  }

  updatecliente(cliente: Cliente) {
    const index = this.clientes.findIndex(
      (cliente) => cliente.fecha === cliente.fecha
    );
    this.clientes[index] = cliente;
    return this.clientes;
  }

  deletecliente(fecha: string) {
    const index = this.clientes.findIndex((cliente) => cliente.fecha === fecha);
    this.clientes.splice(index, 1);
    return this.clientes;
  }
}
