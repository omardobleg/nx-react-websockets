export interface BoredElement {
  activity: string;
  type: string;
  participants: number;
  price: number;
  link: string;
  key: string;
  accessibility: number;
  attempts?: number;
}

export interface WSData<T> {
  event: string;
  data: T | null;
}
