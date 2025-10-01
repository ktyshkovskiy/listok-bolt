import { Item } from "../generated/api/model/item";
import { List } from "../generated/api/model/list";
import { ItemStatus } from "../generated/api/model/itemStatus";

export const ITEM_APPLES: Item = {
  id: '1-1',
  product: {id: 'item-1', name: 'Apples', img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg'},
  count: 6,
  groupColor: '#4CAF50',
  status: ItemStatus.ToBuy
};

export const ITEM_BANANAS: Item = {
  id: '1-4',
  product: {id: 'item-8', name: 'Bananananas', img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg'},
  count: 6,
  groupColor: '#4CAF50',
  status: ItemStatus.ToBuy
};

export const ITEM_BREAD: Item = {
  id: '1-2',
  product: {id: 'item-2', name: 'Bread', img: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg'},
  count: 2,
  groupColor: '#FF9800',
  status: ItemStatus.Bought
};

export const ITEM_MILK: Item = {
  id: '1-3',
  product: {id: 'item-3', name: 'Milk', img: 'https://images.pexels.com/photos/416354/pexels-photo-416354.jpeg'},
  count: 1,
  groupColor: '#2196F3',
  status: ItemStatus.ToBuy
};

export const ITEM_NOTEBOOKS: Item = {
  id: '2-1',
  product: {id: 'item-4', name: 'Notebooks', img: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg'},
  count: 3,
  groupColor: '#9C27B0',
  status: ItemStatus.ToBuy
};

export const ITEM_PENS: Item = {
  id: '2-2',
  product: {id: 'item-5', name: 'Pens', img: 'https://images.pexels.com/photos/159832/office-supplies-stationery-equipment-159832.jpeg'},
  count: 12,
  groupColor: '#E91E63',
  status: ItemStatus.Bought
};

export const ITEM_TILES: Item = {
  id: '3-1',
  product: {id: 'item-6', name: 'Tiles', img: 'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg'},
  count: 50,
  groupColor: '#607D8B',
  status: ItemStatus.ToBuy
};

export const ITEM_PAINT: Item = {
  id: '3-2',
  product: {id: 'item-7', name: 'Paint', img: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'},
  count: 4,
  groupColor: '#795548',
  status: ItemStatus.ToBuy
};

export const LIST_GROCERY_SHOPPING: List = {
  id: '1',
  name: 'Grocery Shopping',
  comment: 'Weekly grocery list',
  img: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
  items: [ITEM_APPLES, ITEM_BREAD, ITEM_MILK, ITEM_BANANAS]
};

export const LIST_OFFICE_SUPPLIES: List = {
  id: '2',
  name: 'Office Supplies',
  comment: 'Supplies needed for the home office',
  img: 'https://aa-business.co.uk/wp-content/uploads/2019/10/Stationery-Supplies-min-700x553.jpg',
  items: [ITEM_NOTEBOOKS, ITEM_PENS]
};

export const LIST_HOME_RENOVATION: List = {
  id: '3',
  name: 'Home Renovation',
  comment: 'Materials for bathroom renovation',
  img: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg',
  items: [ ITEM_TILES, ITEM_PAINT ]
};

export const ALL_ITEMS: Item[] = [ITEM_APPLES, ITEM_BANANAS, ITEM_BREAD, ITEM_MILK, ITEM_NOTEBOOKS, ITEM_PENS, ITEM_TILES, ITEM_PAINT];
export const ALL_LISTS: List[] = [ LIST_GROCERY_SHOPPING, LIST_OFFICE_SUPPLIES, LIST_HOME_RENOVATION];

export const id = function() {
  return Math.random()
    .toString(36)
    .substring(2, 6);
};
