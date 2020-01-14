import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUser } from '../models/user.model';
import { createRequestOption } from '../util/request-util';
import { Config } from '../models/config';
// import { SERVER_API_URL } from '../app.constants';

@Injectable({ providedIn: 'root' })
export class UserService {
  public config: Config = new Config();

  public resourceUrl = this.config.url + 'api/users';

  constructor(private http: HttpClient) { }

  create(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(this.resourceUrl, user, { observe: 'response' });
  }

  update(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(this.resourceUrl, user, { observe: 'response' });
  }

  find(login: string): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrl}/${login}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${login}`, { observe: 'response' });
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.config.url + 'api/users/authorities');
  }
}
