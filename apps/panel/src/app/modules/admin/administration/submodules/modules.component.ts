import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { moduleConfig } from './module.config';

@Component({
    selector       :  moduleConfig.type + '-' + moduleConfig.type2,
    templateUrl    : './modules.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [RouterOutlet],
})
export class SubModulesComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
