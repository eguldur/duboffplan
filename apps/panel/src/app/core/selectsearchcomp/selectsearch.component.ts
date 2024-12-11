import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { CommonModule } from '@angular/common';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'select-search-custom',
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ labelName }}</mat-label>
      <mat-select [formControl]="bankCtrl" placeholder="Seçiniz" #singleSelect>
        <mat-option>
          <ngx-mat-select-search
            [placeholderLabel]="'Ara...'"
            [noEntriesFoundLabel]="'İçerik Bulunamdı'"
            [formControl]="bankFilterCtrl"
          ></ngx-mat-select-search>
        </mat-option>

        <mat-option *ngFor="let bank of filteredBanks | async" [value]="bank.id">
          {{ bank.title }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [``],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    FuseVerticalNavigationComponent,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class SelectSearchComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() selectData: any[] = [];
  @Input() bankCtrl: FormControl = new FormControl();
  @Input() labelName = '';

  /** list of banks */
  public banks: any[] = this.selectData;

  /** control for the selected bank */
  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl<string> = new FormControl<string>('');

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.banks = this.selectData;
    // load the initial bank list
    if (this.banks && this.banks.length > 0) {
      this.filteredBanks.next(this.banks.slice());
    }

    // listen for search field value changes
    this.bankFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterBanks();
    });
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnChanges() {
    this.banks = this.selectData;
    if (!this.banks || !this.banks.length) {
      this.filteredBanks.next([]);
      return;
    }
    this.filteredBanks.next(this.banks.slice());
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.banks) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.banks.slice());
      return;
    } else {
      search = search.toLocaleUpperCase('TR');
    }
    // filter the banks
    this.filteredBanks.next(this.banks.filter((bank) => bank.title.toLocaleUpperCase('TR').indexOf(search) > -1));
  }
}
