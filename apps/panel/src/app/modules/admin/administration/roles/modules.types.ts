export interface BaseItem
{
    id: string;
    title: string;
    isActive?: boolean;
    updateIds?: string[];
    permissions: number[];

}

export interface SubItem
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
    permissions?: [{
      id?: string;
      title?: string;
      permId?: number;
    }]

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
