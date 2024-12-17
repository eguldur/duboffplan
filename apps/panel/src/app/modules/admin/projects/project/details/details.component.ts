import { Component, ViewEncapsulation, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ModulesService } from '../modules.service';
import { config } from 'frontend.config';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
    selector     : 'project-details',
    standalone   : true,
    templateUrl  : './details.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatListModule,
        MatCardModule,
        RouterLink,
        GoogleMap,
        MapMarker
    ]
})
export class ProjectDetailsComponent implements OnInit, OnDestroy
{
    project: any = {};
    url: string = config.apiUrl;
    private _unsubscribeAll: Subject<any> = new Subject<any>()


    markerPosition: google.maps.LatLngLiteral;
    markerPosition_sale: google.maps.LatLngLiteral;
    markerOptions: google.maps.MarkerOptions = {draggable: false};
    center: google.maps.LatLngLiteral = { lat: 25.1008631334436, lng: 55.16967033686541 };
    center_sale: google.maps.LatLngLiteral = { lat: 25.1008631334436, lng: 55.16967033686541 };
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
        this._modulesService.item$.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
            console.log(data);
            this.project = data;
            this.markerPosition = { lat: data.location.coordinates[1], lng: data.location.coordinates[0] };
            this.center = { lat: data.location.coordinates[1], lng: data.location.coordinates[0] };

            this.markerPosition_sale = { lat: data.location_sale.coordinates[1], lng: data.location_sale.coordinates[0] };
            this.center_sale = { lat: data.location_sale.coordinates[1], lng: data.location_sale.coordinates[0] };
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
}
