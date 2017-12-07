import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core/';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  rForm: FormGroup;
  predictForm: FormGroup;
  post: any;
  alertMessage = 'This field is required.';
  submit_file: any;
  responseName: any;

  @ViewChild('selectedFile') selectedFileEl;

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private sanitizer: DomSanitizer) {
    this.rForm = fb.group({
      'subject_name': [null]
    });
    this.predictForm = fb.group({
       'file': ['']
    });
  }
  // Safe url
  transform(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  ngOnInit() {
  }

  addPost(post) {
    this.httpClient.post(`http://192.168.5.129:8000/face_process/api/v1/create_training_data/`, post)
      .subscribe(
        (res) => {
          console.log(res);
        },
        error => {
          console.log(error.status, 'Error');
        }
      );
  }

  // component
  onImageChangeFromFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.submit_file = this.transform(window.URL.createObjectURL(file));
      console.log(file);
    } else {
      this.submit_file = '';
    }
  }

  // Predict form file submit
  predictPost(post) {
    const formData = new FormData();
    formData.append('image', this.selectedFileEl.nativeElement.files[0]);
    this.httpClient.post(`http://192.168.5.129:8000/face_process/api/v1/predict_image_label/`, formData)
      .subscribe(
        (res) => {
          console.log(res);
          this.responseName = res['data'];
        },
        error => {
          console.log(error.status, 'Error');
        }
      );
  }

}
