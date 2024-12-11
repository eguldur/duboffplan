export interface BaseItem
{
    id: string;
    title: string;
    type: string;
    subtitle?: string;
    icon?: string;
    isActive?: boolean;
    siraNo?: number;
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
