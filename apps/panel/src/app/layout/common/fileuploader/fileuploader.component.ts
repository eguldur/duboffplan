import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, InjectionToken, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent, ImageCropperComponent, OutputFormat } from 'ngx-image-cropper';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector       : 'fileuploader-ngx',
    templateUrl    : './fileuploader.component.html',
    encapsulation  : ViewEncapsulation.None,
    exportAs       : 'fileuploader-ngx',
    changeDetection: ChangeDetectionStrategy.Default,
    standalone     : true,
    imports     : [
      CommonModule,
      MatButtonModule,
      MatDividerModule,
      MatIconModule,
      MatMenuModule,
      ImageCropperComponent,
      MatDialogModule
  ],
})
export class FileUploaderComponent implements OnInit, OnDestroy
{
    composeForm: FormGroup;

    croppedImage: any = '';
    isDragged = false;
    imgResultBeforeCompression = '';
    imgResultAfterCompression = '';
    format: OutputFormat = 'png';
    orientation = 1;
    cropperOptions = {
        maintainAspectRatio: true,
        containWithinAspectRatio: false,
        resizeToWidth: 0,
        resizeToHeight: 0,
        aspectRatio: 1,
        dialogTitle: 'Resim Yükle',
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private imageCompress: NgxImageCompressService,
        private _changeDetectorRef: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public data: any,
    )
    {
        this.cropperOptions = data.cropperOptions;
      }
    

    ngOnInit(): void
    {

    }
    compressFile(): void {
        this.imageCompress.uploadFile().then(
          ({image, orientation}) => {
            this.orientation = orientation;
            this.imgResultBeforeCompression = image;
            this.imageCompress
              .compressFile(image, orientation, 100, 100, 0, 0)
              .then(
                (compressedImage) => {
                  const mimeType = compressedImage.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
                  if(mimeType === 'image/png'){
                      this.format = 'png';
                  }
                  this.imgResultAfterCompression = compressedImage;
                  this._changeDetectorRef.markForCheck();
                }
              );
          }
        );
      }
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    async imageCropped(event: ImageCroppedEvent) {      
          this._changeDetectorRef.markForCheck();  
          this.croppedImage =  await this.blobToBase64(event.blob);
    }
    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
}
