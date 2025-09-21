import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item, ItemStatus } from '../models/list.model';
import { Item as ApiItem, ItemApiService, ItemFields, ItemStatus as ApiItemStatusEnum } from "../generated/api";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemService = inject(ItemApiService);

  createItemInList(listId: string, item: Partial<Item>): Observable<Item> {
    const apiItem = this.mapItemToItemFields(item as Item);
    return this.itemService.addItemToList(listId, apiItem).pipe(
      map(value => this.mapApiItemToItem(value))
    );
  }

  getItemById(id: string): Observable<Item> {
    return this.itemService.getItem(id).pipe(
      map(value => this.mapApiItemToItem(value))
    );
  }

  updateItem(id: string, item: Partial<Item>): Observable<Item> {
    const apiItem = this.mapItemToItemFields(item as Item);
    // Note: Update endpoint not defined in OpenAPI spec, using create for now
    return this.itemService.updateItem(id, apiItem).pipe(
      map(value => this.mapApiItemToItem(value))
    );
  }

  deleteItem(id: string): Observable<Item> {
    return this.itemService.deleteItem(id).pipe(
      map(value => this.mapApiItemToItem(value))
    );
  }

  private mapApiItemToItem(apiItem: ApiItem): Item {
    return {
      id: apiItem.id,
      item: apiItem.product,
      count: apiItem.count,
      color: apiItem.groupColor,
      status: this.mapItemStatusFromApi(apiItem.status)
    };
  }

  private mapItemToItemFields(item: Item): ItemFields {
    return {
      product: item.item,
      count: item.count,
      groupColor: item.color,
      status: this.mapItemStatusToApi(item.status)
    };

  }

  private mapItemStatusToApi(status: ItemStatus): ApiItemStatusEnum {
    return status;
  }

  private mapItemStatusFromApi(status: ApiItemStatusEnum): ItemStatus {
    return status;
  }
}
