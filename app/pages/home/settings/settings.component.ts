import { Component, OnInit } from '@angular/core';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RestService } from '../../../core/rest.service';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/notification.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CategoriesService } from '../../../shared/services/categories.service';
import { LabelsService } from '../../../shared/services/labels.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  headerData = '';
  footerData = "";
  labelForm: FormGroup;
  categoryForm: FormGroup;
  settingForm: FormGroup;

  labelFormSubmitted = false;
  categoryFormSubmitted = false;
  categoryData = [];
  labelData = [];
  selectedTab = 'label';

  settingId:'';

  public editorConfig = {
    simpleUpload: {
      uploadUrl: environment.baseUrlMsgCentre+'saveMedia',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoggedInUser")}`
      }
    }
  }

  headerOptions: Object;

  footerOptions: Object;

  constructor(private restService: RestService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private labelsService: LabelsService,
    private categoriesService: CategoriesService ) {
  }

  ngOnInit() {
    this.initializeLabelForm();
    this.initializeCategoryForm();
    this.fetchCategoryList();
    this.fetchLabelList();
    this.fetchSetting();
    this.initializeSettingsForm();
    this.initializeEditorOptions();
  }

  initializeEditorOptions(){
    this.headerOptions = {
      key: environment.froalaKey,
      attribution: false,
      fileUpload: false,
      apiKey: environment.froalaKey,
      charCounterCount: true,
      imageOutputSize: true,
      imageUploadParam: 'upload',
      imageUploadURL: environment.baseUrlMsgCentre+'saveMedia',
      imageUploadMethod: 'POST',
      imageMaxSize: 5 * 1024 * 1024,
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],
      requestHeaders: {
        Authorization: `Bearer ${localStorage.getItem("LoggedInUser")}`
      },
      events: {
        'image.beforeUpload': function (images) {
          console.log('stopped')
        },
        'image.uploaded': function (response) {
          console.log('uploaded');
          console.log(response)
        },
        'image.inserted': function ($img, response) {
          console.log('inserted', response);
        },
        'image.replaced': function ($img, response) {
          console.log('replaced', response);
        },
        'image.error': function (error, response) {
          console.log(error);
          console.log(response);
        },
        'blur':  () => {
          this.saveSettings();
        }
      }
    };

    this.footerOptions = {
      key: environment.froalaKey,
      attribution: false,
      fileUpload: false,
      apiKey: environment.froalaKey,
      charCounterCount: true,
      imageOutputSize: true,
      imageUploadParam: 'upload',
      imageUploadURL: environment.baseUrlMsgCentre+'saveMedia',
      imageUploadMethod: 'POST',
      imageMaxSize: 5 * 1024 * 1024,
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],
      requestHeaders: {
        Authorization: `Bearer ${localStorage.getItem("LoggedInUser")}`
      },
      events: {
        'image.beforeUpload': function (images) {
          console.log('stopped')
          // Return false if you want to stop the image upload.
        },
        'image.uploaded': function (response) {
          console.log('uploaded');
          console.log(response)
        },
        'image.inserted': function ($img, response) {
          console.log('inserted', response);
        },
        'image.replaced': function ($img, response) {
          console.log('replaced', response);
        },
        'image.error': function (error, response) {
          console.log(error);
          console.log(response);
        },
        'blur':  () => {
          this.saveSettings();
        }
      }
    };
  }

  initializeLabelForm = () => {
    this.labelForm = this.formBuilder.group({
      newLabel: ['', Validators.required]
    });
  }

  initializeCategoryForm = () => {
    this.categoryForm = this.formBuilder.group({
      newCategory: ['', Validators.required]
    });
  }

  initializeSettingsForm = () => {
    this.settingForm = this.formBuilder.group({
      headerData: [''],
      footerData: ['']
    });
  }

  get f() { return this.labelForm.controls; }
  get c() { return this.categoryForm.controls; }


  onCreateCategory() {
    this.categoryFormSubmitted = true;
    if (this.categoryForm.invalid) {
      return;
    } else {
      const categoryData = {
        name: this.categoryForm.controls['newCategory'].value
      }
      this.restService.post(environment.messageCentreOrigin, 'addCategory', categoryData).subscribe((data:any) =>{
        console.log(data);
        if (data) {
          this.notificationService.success('Category successfully added');
          this.categoryForm.controls['newCategory'].setValue('');
          this.categoryFormSubmitted = false;
          this.fetchCategoryList();
        }
      });
    }
  };

  onCreateLabel() {
    this.labelFormSubmitted = true;
    if (this.labelForm.invalid) {
      return;
    } else {
      const labelData = {
        name: this.labelForm.controls['newLabel'].value
      };
      this.restService.post(environment.messageCentreOrigin, 'addLabel', labelData).subscribe((data:any) =>{
        console.log(data);
        if (data) {
          this.notificationService.success('Label successfully added');
          this.labelForm.controls['newLabel'].setValue('');
          this.labelFormSubmitted = false;
          this.fetchLabelList();
        }
      });
    }
  };

  fetchLabelList() {
    this.restService.post(environment.messageCentreOrigin,'getLabelList',{}).subscribe((data:any)=>{
      console.log(data)
      if (data){
        this.labelData = data.data;
        this.labelsService.updateLabels(this.labelData);
      }
    })
  }

  fetchCategoryList() {
    this.restService.post(environment.messageCentreOrigin,'getCategoryList',{}).subscribe((data:any)=>{
      console.log(data)
      if (data){
        this.categoryData = data.data;
        this.categoriesService.updateCategories(this.categoryData);
      }
    })
  }

  onRemoveLabel(label){
    if(!label){
      return;
    }
    this.restService.delete(environment.messageCentreOrigin,`deleteLabel/${label}`,{}, 'label')
    .subscribe((data:any)=>{
      if(data){
        this.notificationService.success('Label deleted successfully');
        this.fetchLabelList();
      }
    });
  };

  onRemoveCategory(category){
    if (!category) {
      return;
    }
    this.restService.delete(environment.messageCentreOrigin,`deleteCategory/${category}`,{}, 'category')
    .subscribe((data: any) => {
      if (data) {
        this.notificationService.success('Category deleted successfully');
        this.fetchCategoryList();
      }
    });
  };

  fetchSetting() {
    this.restService.get(environment.messageCentreOrigin, 'getSetting').subscribe((data:any)=>{
      if(data.data){
        console.log(data);
        this.settingId = data.data._id;
        this.headerData = data.data.header;
        this.footerData = data.data.footer;
      }
    })
  }

  public saveSettings() {
    console.log(this.headerData);
    console.log(this.footerData);
    const settingData = {
      '_id': this.settingId,
      'header': this.headerData,
      'footer': this.footerData
    };
    this.restService.post(environment.messageCentreOrigin, 'addSetting', settingData).subscribe((data: any)=>{
      this.notificationService.success('Settings saved successfully');
      if (data) {
        this.fetchSetting();
      }
    });
  }




}
