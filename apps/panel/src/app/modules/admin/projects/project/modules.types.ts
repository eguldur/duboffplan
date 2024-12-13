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
    projectUnits_dld?: any;
    developer?: any;
    mcompany?: any;
    location_sale?: any;
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
