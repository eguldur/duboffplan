export interface BaseItem {
  id: string;
  title: string;
  isActive?: boolean;
  siraNo?: number;
  type?: string;
  updateIds?: string[];
  avatar?: string;
  phone?: {
    phone: string;
    phoneType: {
      id: string;
      title: string;
    };
  }[];
  socialMediaAccounts?: {
    platform: {
      id: string;
      title: string;
    };
    username: string;
  }[];
  unvan?: {
    id: string;
    title: string;
  };
  developer?: {
    id: string;
    title: string;
  }[];
}

export interface ItemPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
