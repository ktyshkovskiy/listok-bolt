import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Configuration, List, ListApiServiceInterface, ListFields } from "../generated/api";
import { HttpHeaders } from "@angular/common/http";
import { ALL_ITEMS, ALL_LISTS, id as genId } from "./mock-data";

@Injectable({
  providedIn: 'root'
})
export class ListApiService implements ListApiServiceInterface {

  defaultHeaders: HttpHeaders = new HttpHeaders();
  configuration: Configuration = new Configuration();

  createList(listData: ListFields): Observable<List> {
    const newList: List = {
      id: genId(),
      name: listData.name || '',
      comment: listData.comment,
      img: listData.img,
      items: []
    };
    ALL_LISTS.push(newList);
    return of({...newList}).pipe(delay(400));
  }

  getList(listId: string): Observable<List> {
    const list = ALL_LISTS.find(l => l.id === listId);
    if (list) {
      return of({...list}).pipe(delay(400));
    } else {
      return throwError(() => ({
        status: 404,
        message: 'Not Found'
      }));
    }
  }

  getLists(): Observable<Array<List>> {
    return of([...ALL_LISTS]).pipe(delay(500));
  }

  updateList(listId: string, list: ListFields): Observable<List> {
    const index = ALL_LISTS.findIndex(l => l.id === listId);
    if (index === -1) {
      return throwError(() => ({
        status: 404,
        message: 'Not Found'
      }));
    }

    const updatedList = {...ALL_LISTS[index], ...list, id: listId};
    ALL_LISTS[index] = updatedList;
    return of({...updatedList}).pipe(delay(400));
  }

  deleteList(listId: string): Observable<List> {
    const index = ALL_LISTS.findIndex(l => l.id === listId);
    if (index === -1) {
      return throwError(() => ({
        status: 404,
        message: 'Not Found'
      }));
    }

    const deletedList = ALL_LISTS[index];
    let itemIds = deletedList.items.map(item => ALL_ITEMS.indexOf(item));
    itemIds.forEach(itemIndex => ALL_ITEMS.splice(itemIndex, 1));

    ALL_LISTS.splice(index, 1);
    return of(deletedList).pipe(delay(400));
  }
}
