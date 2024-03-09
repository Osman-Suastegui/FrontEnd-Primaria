import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Clasificacion} from "../modules/pages/monetary-register/Interfaces/Clasificacion";
import {Observable} from "rxjs";
import {School} from "../modules/pages/school-register/School";

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {

  url:string = "http://localhost:8080"
  constructor(private http:HttpClient) { }

  getClasificaciones():Observable<Clasificacion[]>{
    return this.http.get<Clasificacion[]>(`${this.url}/clasificaciones/getClasificaciones`)
  }
}
