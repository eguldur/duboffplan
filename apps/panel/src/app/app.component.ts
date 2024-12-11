import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title, Meta  } from '@angular/platform-browser';
import { config } from 'frontend.config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {
    private projectTitle = config.projectTitle
    private projectDescription = config.projectDescription
    /**
     * Constructor
     */
    constructor(private titleService: Title, private metaService: Meta)
    {
        this.titleService.setTitle(this.projectTitle);
        this.metaService.updateTag(
            {
             name: 'description', 
             content: this.projectDescription
            }
          );
        
    }
}
