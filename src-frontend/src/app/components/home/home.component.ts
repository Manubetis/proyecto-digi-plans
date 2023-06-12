import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/service/eventoService.service';
import { Evento } from 'src/app/interfaces/evento';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/userService.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario!: any;

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {

  }

  eventos: Evento[] = [];
  listaEventosFiltrada: Evento[] = [];
  listaEventosInscritos: Evento[] = [];
  listaEventosInscritosFiltrada: Evento[] = [];

  eventosPorPagina = 6;
  paginaActual = 1;

  mostrarDiv = false;
  mostrarDivInscritos = false;
  mostrarContenido = false;
  mostrarContenidoInscrito = false;

  ngOnInit(): void {
    this.obtenerEventos();
    if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
      this.router.navigate(['/home']);
    }

    this.usuario = this.authService.getUsuario();
    this.mostrarDiv = false;
    this.mostrarDivInscritos =false;
  }

  mostrarModalInscribirse(eventoId: string) {
    Swal.fire({
      title: '¿Seguro que quieres inscribirte?',
      showCancelButton: true,
      confirmButtonText: 'Inscribirse',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          usuarioId: this.usuario._id,
          eventoId: eventoId
        };

        // Verificar si el usuario ya está inscrito al evento
        const yaInscrito = this.listaEventosInscritos.filter((evento: any) => evento.evento === eventoId);
        if (yaInscrito.length > 0) {
          Swal.fire('Ya estás inscrito a este evento', '', 'error');
        } else {
          // Realizar la inscripción
          this.userService.inscribirUsuario(data).subscribe({
            complete: () => {
              console.log('Usuario inscrito al evento');
              Swal.fire('Inscrito!', '', 'success');
            },
            error: (err) => {
              Swal.fire('Ya estás inscrito a este evento', '', 'error');
            }
          });
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  mostrarModalDesincribirse(eventoId: string) {
    Swal.fire({
      title: '¿Seguro que quieres desinscribirte?',
      showCancelButton: true,
      confirmButtonText: 'Desinscribirse',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          usuarioId: this.usuario._id,
          eventoId: eventoId
        };

        // Verificar si el usuario ya está inscrito al evento
        const yaInscrito = this.listaEventosInscritos.filter((evento: any) => evento.evento === eventoId);
        if (yaInscrito.length > 0) {
          Swal.fire('Ya estás desinscrito a este evento', '', 'error');
        } else {
          // Realizar la inscripción
          this.userService.desinscribirUsuario(data).subscribe({
            complete: () => {
              console.log('Usuario desinscrito al evento');
              Swal.fire('Desinscrito!', '', 'success');
              this.obtenerEventosInscritos();
            },
            error: (err) => {
              Swal.fire('Ya estás desinscrito a este evento', '', 'error');
            }
          });
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }


  obtenerEventosInscritos() {
    this.eventoService.obtenerEventosInscritos(this.usuario._id).subscribe(
      (res: any) => {
        console.log(res);
        this.listaEventosInscritos = [];
        this.listaEventosInscritosFiltrada = [];

        const eventosInscritos = res.eventosInscritos;
        const eventosValidos = eventosInscritos.filter((evento: any) => evento !== null);

        if (eventosValidos.length >= 0) {
          eventosValidos.forEach((evento: any) => {
            const eventoId = evento._id;
            this.obtenerEventoPorId(eventoId);
            this.mostrarDiv = false
            this.mostrarDivInscritos = true;
          });
        } else {
          console.log('No se encontraron eventos inscritos válidos.');
        }

        this.listaEventosFiltrada = [];
      },
      (err) => {
        console.log('Ocurrió un error:' + err);
      }
    )
  };

  obtenerEventos() {
    this.eventoService.obtenerEventos().subscribe({
      next: (res: any) => {
        console.log(res);
        this.eventos = res;
        this.listaEventosFiltrada = res;
        this.listaEventosInscritos = [];
        this.listaEventosInscritosFiltrada = [];
        this.mostrarDiv = true;
        this.mostrarDivInscritos = false;
      },
      complete: () => {
        console.log('Obtención de eventos realizada');
      },
      error: (err) => {
        console.log('Ocurrió un error:' + err);
      }
    });
  }

  obtenerEventoPorId(id: string) {
    this.eventoService.obtenerEventosPorId(id).subscribe({
      next: (res: any) => {
        this.listaEventosInscritos.push(res);
        this.listaEventosInscritosFiltrada.push(res);
      },
      complete: () => {
        console.log('Obtención de eventos realizada');
      },
      error: (err) => {
        console.log('Ocurrió un error:' + err);
      }
    });
  }

  filtrarEventoPorCategoria(categoria: string) {
    this.listaEventosInscritos = [];
    this.mostrarContenido = true;
    this.mostrarContenidoInscrito = false;
    this.listaEventosFiltrada = this.eventos.filter(evento => evento.categoria === categoria);
  }

  filtrarEventoInscritoPorCategoria(categoria: string) {
    this.listaEventosFiltrada = [];
    this.mostrarContenido = false;
    this.mostrarContenidoInscrito = true;
    this.listaEventosInscritosFiltrada = this.listaEventosInscritos.filter(evento => evento.categoria === categoria);
  }

  get totalPaginas(): number {
    return Math.ceil(this.listaEventosFiltrada.length / this.eventosPorPagina);
  }

  get totalPaginasInscritos(): number {
    return Math.ceil(this.listaEventosInscritosFiltrada.length / this.eventosPorPagina);
  }

  get eventosPaginaActualInscritos(): any[] {
    const indiceInicial = (this.paginaActual - 1) * this.eventosPorPagina;
    const indiceFinal = indiceInicial + this.eventosPorPagina;
    return this.listaEventosInscritosFiltrada.slice(indiceInicial, indiceFinal);
  }

  get eventosPaginaActual(): any[] {
    const indiceInicial = (this.paginaActual - 1) * this.eventosPorPagina;
    const indiceFinal = indiceInicial + this.eventosPorPagina;
    return this.listaEventosFiltrada.slice(indiceInicial, indiceFinal);
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  get paginasTotales(): number[] {
    return Array(this.totalPaginas).fill(0).map((_, index) => index + 1);
  }

  get paginasTotalesInscritos(): number[] {
    return Array(this.totalPaginasInscritos).fill(0).map((_, index) => index + 1);
  }

  irAPaginaInscritos(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginasInscritos) {
      this.paginaActual = pagina;
    }
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

}

