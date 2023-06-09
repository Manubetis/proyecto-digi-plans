import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Evento } from '../interfaces/evento';
import { environment } from '../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class EventoService {

    private URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    obtenerEventos() {
        return this.http.get(this.URL + '/obtener-eventos');
    }

    obtenerEventosPorId(id: string) {
        return this.http.get(this.URL + '/obtener-eventos/' + id)
    }

    obtenerEventosInscritos(idEvento: string) {
        return this.http.get(this.URL + '/eventosInscritos/' + idEvento);
    }

    crearEventos(evento: Evento) {
        return this.http.post<any>(this.URL + '/crear-evento', evento);
    }

    actualizarEvento(id: string, data: Object) {
        return this.http.put(this.URL + '/actualizar-eventos/' + id, data)
    }

    eliminarEvento(id: string) {
        return this.http.delete(this.URL + '/obtener-eventos/' + id);
    }
}