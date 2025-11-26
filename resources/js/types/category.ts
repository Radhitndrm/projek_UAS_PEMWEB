export interface Category {
  id: number;
  name: string;
  description: string;
  [key: string]: any;
}

export interface CategoryLink {
  url: string | null;
  label: string;
  active: boolean;
}
