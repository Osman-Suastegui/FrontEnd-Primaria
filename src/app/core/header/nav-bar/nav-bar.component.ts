import {Component, OnInit} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {School} from "../../../modules/pages/school-register/School";
import {SchoolService} from "../../../modules/pages/school-register/school.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, FormsModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{
  selectedValueRegister:string = "Registrar"
  escuelas:School[] = []
  AllEscuelas:School[] = [];
  idEscuelas: number[] = [];
  selectedId: number = 1 // Declaración de la propiedad selectedId
  Rol: string = "Rol"
  CantidadEscuelas: number = 0


  constructor(private route:Router,private schoolServ:SchoolService,private routeActivated:ActivatedRoute) {
  }



  ngOnInit(): void {

    this.getEscuelas()
    this.getAllEscuelas()

    this.Rol = this.obtenerRol();

    this.obtenerCantidadEscuelas();


  }
  hasIdEscuela():boolean{
    const params = this.routeActivated.snapshot.queryParams
    console.log("params",params)
    return params.hasOwnProperty('idEscuela') && params['idEscuela'] !== ''
  }
  onSelectedRegister(event:any){
      this.selectedValueRegister = event.target.value as string
    this.selectedValueRegister = this.selectedValueRegister.toLowerCase()
    if(!this.hasIdEscuela() && this.selectedValueRegister !== 'escuelas'){
      alert("Elige una escuela")
      return
    }
    const idEscuela = this.routeActivated.snapshot.queryParams['idEscuela']
    const queryParams = {idEscuela}
    this.route.navigate(["/" + this.selectedValueRegister],{queryParams})

  }

  mostrarAsignarEscuela(): boolean {
    if (this.Rol === 'Director' && this.CantidadEscuelas < 2) {
      return true;
    } else if (
      this.Rol === 'Asistente' ||
      this.Rol === 'Tesorero' ||
      this.Rol === 'Presidente'
    ) {
      return this.CantidadEscuelas < 1;
    } else if (this.Rol === 'Supervisor') {
      return true; // Mostrar siempre para Supervisor
    }
    return false; // Ocultar por defecto para otros roles no mencionados
  }


  obtenerRol(){
    return JSON.parse(localStorage.getItem("usuarioPrimaria") as string).rolUsuario
  }


  obtenerCantidadEscuelas(){
    const username:string = JSON.parse(localStorage.getItem("usuarioPrimaria") as string).idUsuario
    //getAsignacionEscuela
    this.schoolServ.getAsignacionEscuela(username).subscribe({
      next:(response) => {
        console.log("response",response)
        this.CantidadEscuelas = response

      },
      error: (err) => console.log(err.message)
    })
  }


  salir(){
    localStorage.removeItem("usuarioPrimaria")
    this.route.navigate(["/login"])
  }

  getEscuelas(){
    const username:string = JSON.parse(localStorage.getItem("usuarioPrimaria") as string).usuario

    this.schoolServ.getEscuelas(username).subscribe({
      next:(schools) => this.escuelas = schools,
      error: (err) => console.log(err.message)
    })
    console.log("escuelas",this.escuelas);
  }


  getAllEscuelas() {
    this.schoolServ.getAllEscuelas().subscribe({
      next: (schools) => {
        this.AllEscuelas = schools;
        console.log("AllEscuelas", this.AllEscuelas);
        // Obtener los IDs y asignarlos al arreglo idEscuelas
        this.idEscuelas = this.AllEscuelas.map((escuela) => parseInt(escuela.id, 10)); // O parseInt(escuela.id)
        console.log("idEscuelas", this.idEscuelas);
      },
      error: (err) => console.log(err.message)
    });
  }

  asignarEscuela(escuelaID: number){
    const id_usuario:string = JSON.parse(localStorage.getItem("usuarioPrimaria") as string).idUsuario

    console.log ("id_usuario",id_usuario)
    console.log("escuelaID",escuelaID)

    this.schoolServ.asignarEscuela(id_usuario, escuelaID.toString()).subscribe({
      next: (response) => {
        console.log("Asignación exitosa", response);
        alert("Escuela asignada correctamente");
        this.getEscuelas();
      },
      error: (err) => console.log(err.message)
    });
  }




  onSelectEscuela($event: any) {
    const idEscuela:string =  $event.target.value
    const queryParams = { idEscuela };

    this.route.navigate([], { queryParams });
  }

  goHome(){
    this.route.navigate(["/home"])
  }

  irConsultas() {
    // this.route.navigate(["/report"])
    const idEscuela = this.routeActivated.snapshot.queryParams['idEscuela']
    if(!idEscuela){
      alert("Elige una escuela")
      return
    }
    this.route.navigate(["/report"],{queryParams:{idEscuela}})

  }
}
