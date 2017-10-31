import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ LoadingComponent ],
    exports: [ LoadingComponent ]
})

export class LoadingModule {}