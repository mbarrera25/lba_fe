import firebase from 'firebase/compat/app'

export class UserModel {
  dateCreated:firebase.firestore.Timestamp = firebase.firestore.Timestamp.fromDate( new Date())
  constructor(
    public nombre: string,
    public email: string,
    public role: ROLE,
    public uid:  string,
    public ciudad: string
  ) {
    this.nombre = nombre || '';
    this.email = email || '';
    this.role = role || 'admin';
    this.uid = uid || '';
    this.ciudad = ciudad || '';
  }
}
export interface iUser extends UserModel {}

export namespace User {
  export interface loggedIn {
    readonly email: string,
    readonly password: string
  }

}

export type ROLE = "admin"

export interface iImagen{
  name: string,
  img: string
}