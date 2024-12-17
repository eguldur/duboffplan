import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { config } from 'frontend.config';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface PhoneType {
  id: string;
  title: string;
}

interface Phone {
  phoneType: PhoneType;
  phone: string;
}

interface Platform {
  id: string;
  title: string;
}

interface SocialMedia {
  platform: Platform;
  username: string;
}

interface Title {
  id: string;
  title: string;
}

interface Contact {
  fullName: string;
  email: string;
  phone: Phone[];
  socialMediaAccounts: SocialMedia[];
  unvan: Title;
  avatar: string;
}

@Component({
  selector: 'app-contactinfo',
  templateUrl: './contactinfo.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
})
export class ContactInfoComponent {
  @Input() contact!: Contact;
  url: string = config.apiUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { contact: Contact }
  ) {
    this.contact = data.contact;
  }

  getSocialMediaLink(social: SocialMedia): string {
    // Bu metod platform türüne göre doğru sosyal medya linkini oluşturur
    const platform = social.platform.title.toLowerCase();
    switch (platform) {
      case 'linkedin':
        return `https://linkedin.com/in/${social.username}`;
      case 'twitter':
        return `https://twitter.com/${social.username}`;
      case 'github':
        return `https://github.com/${social.username}`;
      // Diğer platformlar için case'ler eklenebilir
      default:
        return '#';
    }
  }
}


