export interface BaseItem
{
    id: string;
    title: string;
    isActive?: boolean;
    siraNo?: number;
    type?: string;
    updateIds?: string[];
    basekat?: any;
    location?: any;
    phone?: any;
    socialMediaAccounts?: any;
    logo?: any;
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
