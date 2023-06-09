import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { EventoService } from 'src/app/service/eventoService.service';
import { Evento } from 'src/app/interfaces/evento';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home-usuario-no-registrado',
  templateUrl: './home-usuario-no-registrado.component.html',
  styleUrls: ['./home-usuario-no-registrado.component.css']
})
export class HomeUsuarioNoRegistradoComponent implements OnInit {

  eventos: Evento[] = [];
  listaEventosFiltrada: Evento[] = [];

  eventosPorPagina = 6;
  paginaActual = 1;

  constructor(
    private eventoService: EventoService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.obtenerEventos();
    if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
      this.router.navigate(['/home']);
    }
  }

  mostrarModal() {
    Swal.fire({
      icon: 'error',
      title: 'Debes registrarte o iniciar sesión',
      showConfirmButton: false,
      timer: 1500
    })
  }

  getCategoriaImagen(categoria: string): string {
    let imagen = '';

    switch (categoria) {
      case 'Fiesta':
        imagen = 'url(assets/img/donations-keeps-me-going-g8237e311e_1280.jpg)';
        break;
      case 'Evento Deportivo':
        imagen = 'url(assets/img/eventoDeportivo.jpg)';
        break;
      case 'Ocio':
        imagen = 'url(assets/img/ocio.jpg)';
        break;
      case 'Comida':
        imagen = 'url(assets/img/comida.jpg)';
        break;
      case 'Cultura':
        imagen = 'url(assets/img/cultura.jpg)';
        break;
      case 'Viajes':
        imagen = 'url(assets/img/viajes.jpg)';
        break;
      case 'Celebraciones':
        imagen = 'url(assets/img/happy-birthday-g7d78466e6_1280.jpg)';
        break;
    }

    return imagen;
  }

  obtenerEventos() {
    this.eventoService.obtenerEventos().subscribe({
      next: (res: any) => {
        console.log(res);
        this.eventos = res;
        this.listaEventosFiltrada = res;
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
    this.listaEventosFiltrada = this.eventos.filter(evento => evento.categoria === categoria);
  }

  get totalPaginas(): number {
    return Math.ceil(this.listaEventosFiltrada.length / this.eventosPorPagina);
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

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }
}
