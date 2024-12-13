import { MatPaginatorIntl } from '@angular/material/paginator';

const dutchRangeLabel =  (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 / ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} / ${length}`;
}


export function getDutchPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Sayfada Görünecek Kayıt Sayısı:';
  paginatorIntl.nextPageLabel = 'Sonraki Sayfa';
  paginatorIntl.previousPageLabel = 'Önceki Sayfa';
  paginatorIntl.lastPageLabel = 'Son Sayfa';
  paginatorIntl.firstPageLabel = 'İlk Sayfa';
  paginatorIntl.getRangeLabel = dutchRangeLabel;

  return paginatorIntl;
}
