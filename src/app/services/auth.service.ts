import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dbPath = '/users';
  ref: AngularFireList<User> = null;
  constructor(
      private fireAuth: AngularFireAuth,
      private db: AngularFireDatabase)
  {
    this.ref = db.list(this.dbPath);
  }

  // auth
  registerUser(value){
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.createUserWithEmailAndPassword(value.email, value.password).then(
          res => resolve(res),
          err => reject(err)
      );
    });
  }

  loginUser(value){
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(value.email, value.password)
          .then(
              res => resolve(res),
              err => reject(err)
          );
    });
  }

  logoutUser(){
    return new Promise((resolve, reject) => {
      if (this.fireAuth.currentUser) {
        this.fireAuth.signOut().then(
            res => resolve(res),
            err => reject(err)
        );
      }
    });
  }

  userUid() {
    return this.fireAuth.user;
  }

  // database
  create(user: User): any{
    return this.ref.push(user);
  }
}
