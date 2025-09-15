import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { List, Item, ItemDetails } from '../models/list.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockLists: List[] = [
    {
      id: '1',
      name: 'Grocery Shopping',
      comment: 'Weekly grocery list',
      img: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
      items: [
        {
          id: '1-1',
          item: { id: 'item-1', name: 'Apples', img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg' },
          count: 6,
          color: '#4CAF50',
          status: 'to_buy'
        },
        {
          id: '1-2',
          item: { id: 'item-2', name: 'Bread', img: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg' },
          count: 2,
          color: '#FF9800',
          status: 'bought'
        },
        {
          id: '1-3',
          item: { id: 'item-3', name: 'Milk', img: 'https://images.pexels.com/photos/416354/pexels-photo-416354.jpeg' },
          count: 1,
          color: '#2196F3',
          status: 'to_buy'
        }
      ]
    },
    {
      id: '2',
      name: 'Office Supplies',
      comment: 'Supplies needed for the home office',
      img: 'https://images.pexels.com/photos/159832/office-supplies-stationery-equipment-159832.jpeg',
      items: [
        {
          id: '2-1',
          item: { id: 'item-4', name: 'Notebooks', img: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg' },
          count: 3,
          color: '#9C27B0',
          status: 'to_buy'
        },
        {
          id: '2-2',
          item: { id: 'item-5', name: 'Pens', img: 'https://images.pexels.com/photos/159832/office-supplies-stationery-equipment-159832.jpeg' },
          count: 12,
          color: '#E91E63',
          status: 'bought'
        }
      ]
    },
    {
      id: '3',
      name: 'Home Renovation',
      comment: 'Materials for bathroom renovation',
      img: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg',
      items: [
        {
          id: '3-1',
          item: { id: 'item-6', name: 'Tiles', img: 'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg' },
          count: 50,
          color: '#607D8B',
          status: 'to_buy'
        },
        {
          id: '3-2',
          item: { id: 'item-7', name: 'Paint', img: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg' },
          count: 4,
          color: '#795548',
          status: 'to_buy'
        }
      ]
    }
  ];

  getLists(): Observable<List[]> {
    return of([...this.mockLists]).pipe(delay(500));
  }

  getListById(id: string): Observable<List | null> {
    const list = this.mockLists.find(l => l.id === id);
    return of(list ? { ...list } : null).pipe(delay(300));
  }

  createList(listData: Partial<List>): Observable<List> {
    const newList: List = {
      id: uuidv4(),
      name: listData.name || '',
      comment: listData.comment,
      img: listData.img,
      items: listData.items || []
    };
    this.mockLists.push(newList);
    return of({ ...newList }).pipe(delay(400));
  }

  updateList(id: string, listData: Partial<List>): Observable<List | null> {
    const index = this.mockLists.findIndex(l => l.id === id);
    if (index === -1) {
      return of(null).pipe(delay(300));
    }
    
    this.mockLists[index] = { ...this.mockLists[index], ...listData, id };
    return of({ ...this.mockLists[index] }).pipe(delay(400));
  }

  deleteList(id: string): Observable<boolean> {
    const index = this.mockLists.findIndex(l => l.id === id);
    if (index === -1) {
      return of(false).pipe(delay(300));
    }
    
    this.mockLists.splice(index, 1);
    return of(true).pipe(delay(400));
  }

  createItem(listId: string, itemData: Partial<Item>): Observable<Item | null> {
    const listIndex = this.mockLists.findIndex(l => l.id === listId);
    if (listIndex === -1) {
      return of(null).pipe(delay(300));
    }

    const newItem: Item = {
      id: uuidv4(),
      item: itemData.item!,
      count: itemData.count || 1,
      color: itemData.color,
      status: itemData.status || 'to_buy'
    };

    this.mockLists[listIndex].items.push(newItem);
    return of({ ...newItem }).pipe(delay(400));
  }

  getItemById(itemId: string): Observable<Item | null> {
    for (const list of this.mockLists) {
      const item = list.items.find(i => i.id === itemId);
      if (item) {
        return of({ ...item }).pipe(delay(300));
      }
    }
    return of(null).pipe(delay(300));
  }

  updateItem(itemId: string, itemData: Partial<Item>): Observable<Item | null> {
    for (const list of this.mockLists) {
      const itemIndex = list.items.findIndex(i => i.id === itemId);
      if (itemIndex !== -1) {
        list.items[itemIndex] = { ...list.items[itemIndex], ...itemData, id: itemId };
        return of({ ...list.items[itemIndex] }).pipe(delay(400));
      }
    }
    return of(null).pipe(delay(300));
  }

  deleteItem(itemId: string): Observable<boolean> {
    for (const list of this.mockLists) {
      const itemIndex = list.items.findIndex(i => i.id === itemId);
      if (itemIndex !== -1) {
        list.items.splice(itemIndex, 1);
        return of(true).pipe(delay(400));
      }
    }
    return of(false).pipe(delay(300));
  }
}