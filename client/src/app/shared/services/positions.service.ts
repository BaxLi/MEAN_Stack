import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Message, Position } from "../interfaces";

@Injectable({ providedIn: 'root'})

export class PositionsService {
  constructor(private http: HttpClient) {
  }

  fetch(categoryId: string):Observable<Position[]>{
    return this.http.get<Position[]>(`api/position/${categoryId}`)
  }

  createPosition(pos:Position):Observable<Position>{
    return this.http.post<Position>(`api/position`, pos)
  }

  updatePosition(pos:Position):Observable<Position>{
    return this.http.patch<Position>(`api/position/${pos._id}`, pos)
  }

  deletePosition(pos:Position):Observable<Message>{
     return this.http.delete<Message>(`api/position/${pos._id}`)
  }
}
