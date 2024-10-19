import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) {  }


  getUsers():Observable<any>{
    return this.http.get(BASIC_URL + "api/admin/users",{
      headers:this.createAuthoriztionHeader()
    })
  }

  postTask(taskDto: any):Observable<any>{
    return this.http.post(BASIC_URL + "api/admin/task", taskDto,{
      headers:this.createAuthoriztionHeader()
    })
  }

  private createAuthoriztionHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization','Bearer ' + StorageService.getToken()
    )
  }

}
