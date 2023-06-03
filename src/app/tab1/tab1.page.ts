import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IonDatetime, IonicModule, IonItem } from '@ionic/angular';
import { Cliente, ClienteForm } from '../models/cliente.model';
import { Title } from '@angular/platform-browser';
import { ClienteService } from '../services/cliente.service';

type FormGroupControls<T> = {
  [P in keyof T]: FormControl;
};

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class Tab1Page {
  @ViewChild('efectivo') efectivo!: IonItem;
  @ViewChild('tarjeta') tarjeta!: IonItem;
  @ViewChild('fecha') fecha!: IonDatetime;
  private precios = {
    sobremanteles: 200,
    mesaRegalos: 500,
    brincolin: 1000,
    alberca: 5000,
  };
  eventoForm: FormGroup<FormGroupControls<ClienteForm>>;
  fechasOcupadas: string[] = [];
  mensajes_validacion: any;

  constructor(
    private eventoService: ClienteService,
    private title: Title
  ) {
    this.title.setTitle('Nuevo evento');
    this.eventoForm = new FormGroup<FormGroupControls<ClienteForm>>({
      fecha: new FormControl('', {
        validators: [Validators.required, this.validarFecha()],
      }),
      hora: new FormControl('', {
        validators: [Validators.required],
      }),
      cliente: new FormControl('', {
        validators: [Validators.required],
      }),
      celular: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]{10}$/),
        ],
      }),
      tipo: new FormControl('', {
        validators: [Validators.required],
      }),
      descripcion: new FormControl('', {
        validators: [Validators.required],
      }),
      alberca: new FormControl(0),
      mesaRegalos: new FormControl(false),
      colorMantel: new FormControl<string[]>([], {
        validators: [Validators.required],
      }),
      cantidadPersonas: new FormControl(0, {
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(1000),
        ],
      }),
      brincolin: new FormControl(false),
      precio: new FormControl(1000, {
        validators: [Validators.required],
      }),
      anticipo: new FormControl(0, {
        validators: [
          Validators.required,
          Validators.min(100),
          Validators.max(1000),
        ],
      }),
      metodo: new FormControl('Efectivo', {
        validators: [Validators.required],
      }),
      saldo: new FormControl(1000, {
        validators: [Validators.required],
      }),
    });

    this.eventoForm.controls.anticipo.valueChanges.subscribe((value) => {
      this.eventoForm.controls.saldo.patchValue(
        this.eventoForm.controls.precio.value - value
      );
      this.actualizarValidacionesAnticipo();
    });

    this.eventoForm.controls.precio.valueChanges.subscribe((value) => {
      this.eventoForm.controls.saldo.patchValue(
        value - this.eventoForm.controls.anticipo.value
      );
      this.actualizarValidacionesAnticipo();
    });

    this.eventoService.getclientes().forEach((evento) =>
      this.fechasOcupadas.push(evento.fecha)
    );

    this.eventoForm.controls.colorMantel.valueChanges.subscribe(() => {
      this.eventoForm.controls.precio.patchValue(this.calcularPrecio());
    });

    this.eventoForm.controls.mesaRegalos.valueChanges.subscribe(() => {
      this.eventoForm.controls.precio.patchValue(this.calcularPrecio());
    });

    this.eventoForm.controls.brincolin.valueChanges.subscribe(() => {
      this.eventoForm.controls.precio.patchValue(this.calcularPrecio());
    });

    this.eventoForm.controls.alberca.valueChanges.subscribe(() => {
      this.eventoForm.controls.precio.patchValue(this.calcularPrecio());
    });

    this.mensajes_validacion = {
      fecha: [
        { tipo: 'required', mensaje: 'La fecha ya está ocupada' },
        { tipo: 'fechaOcupada', mensaje: 'La fecha ya está ocupada' },
      ],
      hora: [{ tipo: 'required', mensaje: 'La hora es obligatoria' }],
      cliente: [
        { tipo: 'required', mensaje: 'El nombre del cliente es obligatorio' },
      ],
      celular: [
        { tipo: 'required', mensaje: 'El celular es obligatorio' },
        { tipo: 'minlength', mensaje: 'El celular debe tener 10 dígitos' },
        { tipo: 'maxlength', mensaje: 'El celular debe tener 10 dígitos' },
        { tipo: 'pattern', mensaje: 'El celular debe tener solo dígitos' },
      ],
      tipo: [{ tipo: 'required', mensaje: 'El tipo de evento es obligatorio' }],
      descripcion: [
        { tipo: 'required', mensaje: 'La descripción es obligatoria' },
      ],
      colorSobremantel: [
        {
          tipo: 'required',
          mensaje: 'El color del sobremantel es obligatorio',
        },
      ],
      personas: [
        { tipo: 'required', mensaje: 'El número de personas es obligatorio' },
        { tipo: 'min', mensaje: 'El número de personas debe ser mayor a 0' },
        { tipo: 'max', mensaje: 'La capacidad maxima es de 1000 personas' },
      ],
      anticipo: [
        { tipo: 'required', mensaje: 'El anticipo es obligatorio' },
        {
          tipo: 'min',
          mensaje: 'El anticipo debe ser por lo menos el 10%',
        },
        {
          tipo: 'max',
          mensaje: 'El anticipo no puede ser superior al total a pagar',
        },
      ],
      metodo: [{ tipo: 'required', mensaje: 'Se requiere un método de pago' }],
      saldo: [{ tipo: 'required', mensaje: 'El saldo es obligatorio' }],
    };
  }

  ionViewDidEnter() {
    if (this.fecha.value) return;
    const fecha = new Date();
    const formato = fecha
      .toLocaleDateString('es-MX', {
        timeZone: 'America/Mazatlan',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-')
      .split('-')
      .reverse()
      .join('-');
      this.fecha.value = `${formato}T${
        fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours()
      }:${
        fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes()
      }:${
        fecha.getSeconds() < 10 ? '0' + fecha.getSeconds() : fecha.getSeconds()
      }`;
  
      this.eventoForm.controls.fecha.setValue(this.fecha.value);
      this.eventoForm.controls.hora.setValue(this.fecha.value);
    }


  fechaDesocupada() {
    const fechas = this.fechasOcupadas;
    return (fecha: string) =>
      !fechas.includes(new Date(fecha).toISOString().slice(0, 10));
  }

  elegirMetodo(metodo: string) {
    if (metodo === 'Efectivo') {
      if (this.efectivo.color === 'primary') {
        this.efectivo.color = undefined;
        this.eventoForm.controls.metodo.patchValue('');
        return;
      }
      this.efectivo.color = 'primary';
      this.tarjeta.color = undefined;
      this.eventoForm.controls.metodo.patchValue('Efectivo');
    } else {
      if (this.tarjeta.color === 'primary') {
        this.tarjeta.color = undefined;
        this.eventoForm.controls.metodo.patchValue('');
        return;
      }
      this.efectivo.color = undefined;
      this.tarjeta.color = 'primary';
      this.eventoForm.controls.metodo.patchValue('Transferencia');
    }
  }

  setFechaHora(event: any) {
    if (event instanceof Date) {
      this.eventoForm.controls.fecha.patchValue(
        event.toISOString().slice(0, 10)
      );
      this.eventoForm.controls.hora.patchValue(
        event.toLocaleTimeString().slice(0, 5)
      );
    } else {
      const fecha = new Date(event.detail.value);
      this.eventoForm.controls.fecha.patchValue(
        fecha.toISOString().slice(0, 10)
      );
      this.eventoForm.controls.hora.patchValue(
        fecha.toLocaleTimeString().slice(0, 5)
      );
    }
  }

  confirmar() {
    this.eventoService.addcliente({
      ...this.eventoForm.getRawValue(),
      estado: 'Confirmado',
    });
    this.fechasOcupadas.push(
      new Date(this.eventoForm.controls.fecha.value).toISOString().slice(0, 10)
    );
    this.eventoForm.reset();
  }

  apartar() {
    this.eventoService.addcliente({
      ...this.eventoForm.getRawValue(),
      estado: 'Apartado',
    });
    this.fechasOcupadas.push(
      new Date(this.eventoForm.controls.fecha.value).toISOString().slice(0, 10)
    );
    this.eventoForm.reset();
  }

  private calcularPrecio(): number {
    let precio = 1000;
    precio +=
      this.precios.sobremanteles *
      this.eventoForm.controls.colorMantel.value.length;
    precio += this.eventoForm.controls.mesaRegalos.value
      ? this.precios.mesaRegalos
      : 0;
    precio += this.eventoForm.controls.brincolin.value
      ? this.precios.brincolin
      : 0;
    precio +=
      (this.precios.alberca * this.eventoForm.controls.alberca.value) / 100;
    return precio;
  }

  private actualizarValidacionesAnticipo() {
    this.eventoForm.controls.anticipo.setValidators([
      Validators.required,
      Validators.min(this.calcularPrecio() * 0.1),
      Validators.max(this.calcularPrecio()),
    ]);
    this.eventoForm.controls.anticipo.updateValueAndValidity({
      emitEvent: false,
    });
  }

  public getFechasOcupadas() {
    return this.fechasOcupadas;
  }

  private validarFecha(): ValidatorFn {
    const fechas = this.getFechasOcupadas();
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const fecha = new Date(control.value);
      if (fechas.includes(fecha.toISOString().slice(0, 10))) {
        return { fechaOcupada: true };
      }
      return null;
    };
  }
}