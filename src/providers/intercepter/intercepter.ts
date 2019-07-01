import { HttpInterceptor, HttpEvent , HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { _throw } from 'rxjs/observable/throw';
import { mergeMap , catchError } from 'rxjs/operators';
import { AlertController } from 'ionic-angular';

@Injectable()
export class IntercepterProvider implements HttpInterceptor {

  constructor(private storage : Storage , private alertCtrl : AlertController) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    let tokenPromise = this.storage.get('token');

    return Observable.fromPromise(tokenPromise)
      .mergeMap( token => {
        let clonedReq = this.addToken( req, token);

        return next.handle(clonedReq).pipe(
          catchError(err => { //piping and interception errors
            let  msg = err.message;

            let alert = this.alertCtrl.create({
              title : err.name,
              message : msg,
              buttons : ['OK']
            });
            alert.present();
            return _throw(err);
          })
        )
      })
  }

  private addToken( request : HttpRequest<any>, token : any){
    if (token){
      let clone : HttpRequest<any>;
      clone = request.clone(
        {
          setHeaders : {
            Accept : 'application/json',
            'Content-Type' : 'application/json',
            'token' : token
          }
        }
      );
      return clone;
    }

    return request;
  }

}
