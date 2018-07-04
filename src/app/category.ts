import { ICash } from './cash';

export interface ICategory {
  key: number;
  title: string;
  createdate: number;
  rating: number;
  cash: ICash[];
  sumYear: number;
  sumMonth: number;
}
