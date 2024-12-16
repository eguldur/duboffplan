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
        RouterModule,
        GoogleMapsModule
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

    private _unsubscribeAll: Subject<any> = new Subject<any>()
    /**
     * Constructor
     */
    constructor(
        private _modulesService: ModulesService,
        private _changeDetectorRef: ChangeDetectorRef
    )
    {
    }

    ngOnInit(): void {
       this._modulesService.item$.pipe(takeUntil(this._unsubscribeAll)).subscribe((item) => {
        this.item = item;
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
        console.log(this.item);
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
          return 'photo_camera';
        case 'facebook':
          return 'facebook';
        case 'twitter':
        case 'x':
        case 'twitter - x':
          return 'twitter';
        case 'linkedin':
          return 'linkedin';
        case 'youtube':
          return 'youtube_activity';
        case 'tiktok':
          return 'music_video';
        case 'whatsapp':
          return 'whatsapp';
        case 'telegram':
          return 'send';
        default:
          return 'public';
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
    
}
