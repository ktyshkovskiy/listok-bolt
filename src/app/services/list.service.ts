import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item, List } from '../models/list.model';
import { Item as ApiItem, List as ApiList, ListApiService, ListFields } from "../generated/api";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private listService = inject(ListApiService);

  getLists(): Observable<List[]> {
    return this.listService.getLists().pipe(
      map((apiLists: ApiList[]) => apiLists.map(value => this.mapApiListToList(value)))
    );
  }

  getListById(id: string): Observable<List> {
    return this.listService.getList(id).pipe(
      map(value => this.mapApiListToList(value))
    );
  }

  createList(list: Partial<List>): Observable<List> {
    const apiList = this.mapListToListFields(list as List);
    return this.listService.createList(apiList).pipe(
      map(value => this.mapApiListToList(value))
    );
  }

  updateList(id: string, list: Partial<List>): Observable<List> {
    const apiList = this.mapListToListFields(list as List);
    return this.listService.updateList(id, apiList).pipe(
      map(value => this.mapApiListToList(value))
    );
  }

  deleteList(id: string): Observable<any> {
    return this.listService.deleteList(id);
  }

  private mapApiListToList(apiList: ApiList): List {
    let items = this.mapApiItemsToItems(apiList.items);
    return {
      id: apiList.id,
      name: apiList.name,
      comment: apiList.comment,
      img: apiList.img,
      items: items
    };
  }

  private mapApiItemsToItems(items: ApiItem[]): Item[] {
    return items.map(value => this.mapApiItemToItem(value));
  }

  private mapApiItemToItem(item: ApiItem): Item {
    return {
      id: item.id,
      item: item.product,
      color: item.groupColor,
      count: item.count,
      status: item.status
    }
  }

  private mapListToListFields(list: List): ListFields {
    return {
      name: list.name,
      comment: list.comment,
      img: list.img
    };
  }
}
