import { Injectable } from '@angular/core'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'

@Injectable()
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    /* save to file */
    XLSX.writeFile(wb, excelFileName + '_' + new Date().getTime() + '.xlsx')
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    })
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION)
  }

  public capitalize(str: string): string {
    return str.charAt(0).toLocaleUpperCase('TR') + str.slice(1).toLocaleLowerCase('TR')
  }

  public capitalizeFirstLetter(str: string): string {
    const strarray = str.split(' ')

    let newstr = ''

    for (const todo of strarray) {
      newstr = newstr + ' ' + this.capitalize(todo)
    }

    return newstr.trim()
  }
}
