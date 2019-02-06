import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateCoworkingModel } from './../../core/models/createCoworking.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from 'app/core/base/base.component';
import { ShowHideTrigger } from 'app/shared/animations/showFade.animation';

import { saveAs} from 'file-saver';
import { MainService } from 'app/core/services/main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss'],
    animations:[
    ShowHideTrigger
  ]
})
export class BackupsComponent extends BaseComponent implements OnInit {

  RegistrationErr = false;
  RegErrMsg = '';

  file = null;
  fileName = '';
  isFileUploaded = false;

  ngOnInit() {
  }


  DeleteFile(){
        this.file = null;
        this.isFileUploaded = false;
  }


  onFileChange($event: any) : void {
    this.DeleteFile();
    this.isFileUploaded = false;
    if($event.target.files.length > 0) {
      this.fileName = $event.target.files[0].name;
      this.readThis($event.target);
    }
  }


  readThis(inputValue: any): void {
    this.ReadFile(
          inputValue.files,
          (res:string)=>{
              if(res){
                  this.file = JSON.parse(res);
              }
          }
    );
  }


  DownloadFile() {
    this.service.GetAllPrivateCoworking()
      .subscribe(
        (res) => {
          if(res){
              var jsonBlob = new Blob([JSON.stringify(res)], { type: 'application/javascript;charset=utf-8' });
              saveAs(jsonBlob,'D4W Users ('+new Date().toDateString()+' ' + new Date().getTime() +').json');
            }
        }
      )
  }

  isLoadingFile = false;
  UploadFile() {
    this.isLoadingFile = true;
    this.service.AddPrivateCoworking(this.file)
      .subscribe(
        (res) => {
           this.isFileUploaded = true;
        },
        (err) => {
          console.log(`err`, err);
        },
        () => {
          this.isLoadingFile = false;
        }
      )

  }

}
