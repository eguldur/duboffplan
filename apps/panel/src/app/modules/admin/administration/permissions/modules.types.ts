export interface BaseItem
{
  id: string;
  title: string;
  permId?: number;
  basemodule?: {
    id?: string;
    title?: string;
  };
  submodule?: {
    id?: string;
    title?: string;
  };
  isActive: boolean;
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
