import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { moduleConfig } from '../module.config';
import { ModulesService } from '../modules.service';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { Contact, File } from '../modules.types';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { config } from 'frontend.config';
import { MatDialog } from '@angular/material/dialog';
import { ContactInfoComponent } from './dialogs/contactinfo/contactinfo.component';
import { ShowFileComponent } from './dialogs/showfile/showfile.component';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';

@Component({
    selector: moduleConfig.type + '-' + moduleConfig.type2 + '-details',
    standalone   : true,
    templateUrl  : './details.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        FormsModule,
        RouterModule,
        GoogleMapsModule,
        MatTabsModule,
        MatCardModule,
        MatListModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]   
})
export class DetailsComponent implements OnInit, OnDestroy
{
    item: any = {};
    markerPosition: google.maps.LatLngLiteral;
    markerOptions: google.maps.MarkerOptions = {draggable: false};
    center: google.maps.LatLngLiteral = { lat: 25.1008631334436, lng: 55.16967033686541 };
    zoom = 12;
    items: any[] = [];
    display: google.maps.LatLngLiteral;
    options: google.maps.MapOptions = {
      disableDefaultUI: true,
      mapTypeId: 'roadmap',
      mapTypeControlOptions: {
        style: 0,
        position: 7,
      },
    };
    contacts: Contact[] = [];
    isLoading: boolean = false;
    files: any[] = [];


    url: string = config.apiUrl;
    private _unsubscribeAll: Subject<any> = new Subject<any>()
    selectedFiles: any[] = [];
    /**
     * Constructor
     */
    constructor(
        private _modulesService: ModulesService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _toastr: ToastrService,
        private _fuseConfirmationService: FuseConfirmationService 
    )
    {
    }

    ngOnInit(): void {
       this._modulesService.item$.pipe(takeUntil(this._unsubscribeAll)).subscribe((item) => {
        this.item = item;

        if (item.files) {
          this.files = item.files;
        }
        if (this.item?.location?.coordinates) {
            const [lng, lat] = this.item.location.coordinates;
            this.center = {
              lat: lat,
              lng: lng
            };
            this.markerPosition = this.center; // Marker'ı center ile aynı konuma ayarla
          } else {
            // Varsayılan olarak Dubai'nin koordinatları
            this.center = {
              lat: 25.2048,
              lng: 55.2708
            };
            this.markerPosition = this.center;
          }
        this._changeDetectorRef.detectChanges();
       });
       this._modulesService._contacts.pipe(takeUntil(this._unsubscribeAll)).subscribe((contacts) => {
        this.contacts = contacts;
        this._changeDetectorRef.detectChanges();
       });
       this._modulesService._notes.pipe(takeUntil(this._unsubscribeAll)).subscribe((notes) => {
        this.notes = notes;
        this._changeDetectorRef.detectChanges();
       });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getSocialMediaLink(social: any): string {
      const username = social.username.replace('@', ''); // @ işaretini kaldır
      
      switch(social.platform.title.toLowerCase()) {
        case 'instagram':
          return `https://instagram.com/${username}`;
        case 'facebook':
          return `https://facebook.com/${username}`;
        case 'twitter':
        case 'x': 
        case 'twitter - x': // Twitter'ın yeni adı
          return `https://twitter.com/${username}`;
        case 'linkedin':
          return `https://linkedin.com/company/${username}`;
        case 'youtube':
          return `https://youtube.com/@${username}`;
        case 'tiktok':
          return `https://tiktok.com/@${username}`;
        case 'whatsapp':
          return `https://wa.me/${username}`;
        case 'telegram':
          return `https://t.me/${username}`;
        default:
          return social.username;
      }
    }
    
    getSocialMediaIcon(platform: string): string {
      switch(platform.toLowerCase()) {
        case 'instagram':
          return 'feather:instagram';
        case 'facebook':
          return 'feather:facebook';
        case 'twitter':
        case 'x':
        case 'twitter - x':
          return 'feather:twitter';
        case 'linkedin':
          return 'feather:linkedin';
        case 'youtube':
          return 'feather:youtube';
        case 'tiktok':
          return 'feather:tiktok';
        case 'whatsapp':
          return 'feather:phone';
        case 'telegram':
          return 'feather:mouse-pointer';
        default:
          return 'heroicons_solid:globe-alt';
      }
    }
    
    getSocialMediaColor(platform: string): string {
      switch(platform.toLowerCase()) {
        case 'instagram':
          return 'text-pink-600';
        case 'facebook':
          return 'text-blue-600';
        case 'twitter':
        case 'x':
        case 'twitter - x':
          return 'text-blue-400';
        case 'linkedin':
          return 'text-blue-700';
        case 'youtube':
          return 'text-red-600';
        case 'tiktok':
          return 'text-gray-800';
        case 'whatsapp':
          return 'text-green-500';
        case 'telegram':
          return 'text-blue-500';
        default:
          return 'text-gray-500';
      }
    }
    getFileIcon(type: string): string {
      switch (type.toLowerCase()) {
        case 'pdf': return 'picture_as_pdf';
        case 'doc':
        case 'docx': return 'description';
        default: return 'insert_drive_file';
      }
    }
  
    getFileIconColor(type: string): string {
      switch (type.toLowerCase()) {
        case 'pdf': return 'text-red-500';
        case 'doc':
        case 'docx': return 'text-blue-500';
        default: return 'text-gray-500';
      }
    }
  
    async onFileSelected(event: any): Promise<void> {
      this._changeDetectorRef.markForCheck();
      this.isLoading = true;
      let i = 0;
      for (const file of event.target.files) {
        await this._modulesService.bulkUpload(file).subscribe(
          (res) => {
            this.files.push({
              name: res.name,
              size: res.size,
              type: res.type,
              fileLink: res.fileLink,
              uploadDate: new Date(),
            });
            i++;

            const fileInput = {
              name: res.name,
              fileLink: res.fileLink,
              type: res.type,
              size: res.size,
              mimefirst: res.mimefirst,
              uploadDate: new Date(),
            };

            this._modulesService.addFileToDeveloper(this.item.id, fileInput).subscribe(
              (res) => {
              }, 
              (err) => {
              }
            );
  
            this._toastr.success(i + '/' + event.target.files.length + ' Dosya Yüklendi', 'Başarılı', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
            if (i === event.target.files.length) {
              this.isLoading = false;
            }
  
            this._changeDetectorRef.markForCheck();
          },
          (err) => {
            i++;
  
            this._toastr.error(i + '. Dosya Yüklenirken Bir Hata Oluştu', 'Hata', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
            if (i === event.target.files.length) {
              this.isLoading = false;
            }
            this._changeDetectorRef.markForCheck();
          },
        );
      }
    }
  
    showFile(file): void {
      const dialogRef = this._dialog.open(ShowFileComponent, {
        data: {
          file,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          return;
        }
        return;
      });
    }

    notes: any[] = [];
  
    newNote: string = '';

    addNote(): void {
      if (!this.newNote.trim() && this.selectedFiles.length === 0) return;

      const note = {
        content: this.newNote,
        files: this.selectedFiles,
        developer: this.item.id,
      };

      this._modulesService.createNote(note).subscribe((res) => {
        this.notes.unshift(res);
        this.newNote = '';
        this.selectedFiles = [];
        this._toastr.success('Not Eklendi', 'Başarılı', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
        this._changeDetectorRef.detectChanges();
      });
    }

    deleteNote(note: any): void {

      const dialogRef = this._fuseConfirmationService.open({ 
        title: 'Not Silme',
        message: 'Bu notu silmek istediğinizden emin misiniz?',
        actions: {
          confirm: {
            label: 'Sil',
            color: 'warn',
          },
          cancel: {
            label: 'Vazgeç',
          }
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          // Note silme işlemi
          this.notes = this.notes.filter(n => n.id !== note.id);
          this._modulesService.deleteNote(note.id).subscribe((res) => {
            this._toastr.success('Note Silindi', 'Başarılı', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
            this._changeDetectorRef.detectChanges();
          });
        }
      });
    }

   

    async onNoteFileSelected(event: any): Promise<void> {
      this._changeDetectorRef.markForCheck();
      this.isLoading = true;
      let i = 0;
      for (const file of event.target.files) {
        await this._modulesService.bulkUpload(file).subscribe(
          (res) => {
            this.selectedFiles.push({
              name: res.name,
              size: res.size,
              type: res.type,
              fileLink: res.fileLink,
              uploadDate: new Date(),
            });
            i++;

            
  
            this._toastr.success(i + '/' + event.target.files.length + ' Dosya Yüklendi', 'Başarılı', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
            if (i === event.target.files.length) {
              this.isLoading = false;
            }
  
            this._changeDetectorRef.markForCheck();
          },
          (err) => {
            i++;
  
            this._toastr.error(i + '. Dosya Yüklenirken Bir Hata Oluştu', 'Hata', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
            if (i === event.target.files.length) {
              this.isLoading = false;
            }
            this._changeDetectorRef.markForCheck();
          },
        );
      }
    }

    openContactInfoDialog(contact: Contact): void {
      this._dialog.open(ContactInfoComponent, { data: { contact } });
    }

    deleteFile(file: any): void {
     const dialogRef = this._fuseConfirmationService.open({ 
      title: 'Dosya Silme',
      message: 'Bu dosyayı silmek istediğinizden emin misiniz?',
      actions: {
          confirm: {
            label: 'Sil',
            color: 'warn',
          },
          cancel: {
            label: 'Vazgeç',
          }
        }
      
     });

     dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.files = this.files.filter(f => f.fileLink !== file.fileLink);
        this._modulesService.deleteFileFromDeveloper(this.item.id, file.fileLink).subscribe((res) => {
          this._toastr.success('Dosya Silindi', 'Başarılı', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
          this._changeDetectorRef.detectChanges();
        });
      }
     });
    }
}
