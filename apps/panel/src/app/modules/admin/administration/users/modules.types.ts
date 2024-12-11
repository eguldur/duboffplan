export interface BaseItem
{
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isActive?: boolean;
  isEmailActive?: boolean;
  password: string;
  role?: {
    id: string;
    title: string;
  };
  updateIds?: string[];
}

export interface ItemPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
