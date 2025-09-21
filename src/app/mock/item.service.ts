import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { ALL_ITEMS, ALL_LISTS, id as genId } from "./mock-data";
import { HttpHeaders } from "@angular/common/http";
import { Configuration, Item, ItemApiServiceInterface, ItemFields, ItemStatus } from "../generated/api";

@Injectable({
  providedIn: 'root'
})
export class ItemApiService implements ItemApiServiceInterface {

  defaultHeaders: HttpHeaders = new HttpHeaders();
  configuration: Configuration = new Configuration();

  getItem(id: string): Observable<Item> {
    let item = ALL_ITEMS.find(item => item.id === id);
    if (item) {
      return of(item);
    } else {
      return throwError(() => ({
        status: 404,
        message: 'Item not found'
      }));
    }
  }

  getItems(): Observable<Array<Item>> {
    return of(ALL_ITEMS);
  }

  getListsItems(listId: string): Observable<Array<Item>> {
    let items = ALL_LISTS.find(value => value.id === listId)?.items;
    if (items) {
      return of(items);
    } else {
      return throwError(() => ({
        status: 404,
        message: 'List not found'
      }))
    }
  }

  addItemToList(listId: string, itemFields: ItemFields): Observable<Item> {
    const list = ALL_LISTS.find(l => l.id === listId);
    if (!list) {
      return throwError(() => ({
        status: 404,
        message: 'List not found'
      }))
    }

    const newItem: Item = {
      id: genId(),
      product: itemFields.product!,
      count: itemFields.count || 1,
      groupColor: itemFields.groupColor,
      status: itemFields.status || ItemStatus.ToBuy
    };

    list.items.push(newItem);
    ALL_ITEMS.push(newItem);

    return of({...newItem}).pipe(delay(400));
  }

  updateItem(id: string, itemData: ItemFields): Observable<Item> {
    for (const list of ALL_LISTS) {
      const itemIndex = list.items.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        const updatedItem = {...list.items[itemIndex], ...itemData, id: id};

        let indexInData = ALL_ITEMS.findIndex(i => i.id === id);
        if (indexInData !== -1) {
          ALL_ITEMS[indexInData] = updatedItem;
        }

        list.items[itemIndex] = updatedItem;
        return of({...updatedItem}).pipe(delay(400));
      }
    }

    return throwError(() => ({
      status: 404,
      message: 'Item not found'
    }));
  }

  deleteItem(id: string): Observable<Item> {
    for (const list of ALL_LISTS) {
      const itemIndex = list.items.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        let deletedItem = list.items[itemIndex];
        list.items.splice(itemIndex, 1);

        let indexInData = ALL_ITEMS.findIndex(i => i.id === id);
        if (indexInData !== -1) {
          ALL_ITEMS.splice(indexInData, 1);
        }

        return of({...deletedItem}).pipe(delay(400));
      }
    }
    return throwError(() => ({
      status: 404,
      message: 'Item not found'
    }));
  }
}
