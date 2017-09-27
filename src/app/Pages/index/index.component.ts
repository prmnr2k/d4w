import { Component, OnInit } from '@angular/core';
import { HttpService} from '../../services/http.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    moduleId:module.id,
    selector: "index",
    templateUrl: "./index.component.html"
})

export class IndexComponent implements OnInit{
    bsConfig:Partial<BsDatepickerConfig>;
    ngOnInit() {
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        
    }
}