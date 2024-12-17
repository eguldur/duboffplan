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
    files?: any;
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
export interface Contact {
    avatar: string;
    fullName: string;
    email: string;
    phone: any;
    socialMediaAccounts: any;
    unvan: any;
  }

export interface File {
    name: string;
    type: string;
    size: string;
    uploadDate: Date;
  }