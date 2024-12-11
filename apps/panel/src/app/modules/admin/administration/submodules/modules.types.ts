export interface BaseItem
{
    id: string;
    title: string;
    link?: string;
    basemodule?: {
      id?: string;
      title?: string;
    };
    isActive?: boolean;
    siraNo?: number;
    type?: string;
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
