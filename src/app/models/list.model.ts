export interface ItemDetails {
  id: string;
  name: string;
  img?: string;
  comment?: string;
}

export interface Item {
  id: string;
  item: ItemDetails;
  count: number;
  color?: string;
  status: 'to_buy' | 'bought';
}

export interface List {
  id: string;
  name: string;
  comment?: string;
  img?: string;
  items: Item[];
}

export interface Problem {
  type?: string;
  title?: string;
  status?: string;
  detail?: string;
}

export interface CreateListRequest {
  name: string;
  comment?: string;
  img?: string;
  items?: Item[];
}

export interface CreateItemRequest {
  item: ItemDetails;
  count: number;
  color?: string;
  status: 'to_buy' | 'bought';
}