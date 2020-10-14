import { Subject } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, Input, TemplateRef, OnDestroy, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';
import { RestService } from '../../../core/rest.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { NotificationService } from '../.././../core/notification.service';
import { CurrentuserService } from '../../../shared/currentuser.service';
import { CategoriesService } from '../../../shared/services/categories.service';
import { LabelsService } from '../../../shared/services/labels.service';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-compose-modal',
  templateUrl: './compose-modal.component.html',
  styleUrls: ['./compose-modal.component.scss']
})
export class ComposeModalComponent implements OnInit, OnDestroy {
  @Output() action = new EventEmitter();
  @ViewChild('childModal') childModal: ModalDirective;

  messageContent;
  type;
  modalRef: BsModalRef;
  showComposeHtml = true;
  showSenderList = false;
  staffList = [];
  staffName: '';
  recipientList = [];
  childrenList = [];
  recipientEmails = [];
  rooms = [];
  selectedRoom = '';
  childName = '';
  emailForm: FormGroup;
  submitted = false;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-margin'
  };

  testEmail: any = '';
  selectedRoomStaff = '';
  selectedContactType = [];
  NotificationEmailAddress = '';
  categories = [];
  labels = [];
  $categorysubscription: Subscription;
  $labelSubscription: Subscription;
  selectedCategories = [];
  selectedLabels = [];
  selectedStaffCount = 0;
  selectedChildrenCount = 0;
  centerType = '';
  selectedEducator: '';
  selectAllChildren = false;
  selectAllStaff =  false;

  public editorConfig = {
    simpleUpload: {
      uploadUrl: environment.baseUrlMsgCentre+'saveMedia',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoggedInUser")}`
      }
    }
  };

  public options: Object;


  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private restService: RestService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private currentuserService: CurrentuserService,
    private categoriesService: CategoriesService,
    private labelsService: LabelsService) { }

  ngOnInit() {
    this.getStaff();
    this.getChildren();
    this.initializeEmailForm();
    this.intializeDraft();
    this.getRoom();
    this.getCurrentUserInfo();
    this.getCategory();
    this.getLabels();
    // this.initializeFroala();    
    console.log(this.type);
    this.initializeEditorOptions();
  }

  initializeEditorOptions(){
    if(this.type == 'email'){
      this.options = {
        key: environment.froalaKey,
        attribution: false,
        apiKey: environment.froalaKey,
        charCounterCount: true,
        imageOutputSize: true,
        imageUploadParam: 'upload',
        imageUploadURL: environment.baseUrlMsgCentre+'saveMedia',
        imageUploadMethod: 'POST',
        imageMaxSize: 5 * 1024 * 1024,
        imageAllowedTypes: ['jpeg', 'jpg', 'png'],
        fileUploadParam: 'upload',
        fileUploadURL: environment.baseUrlMsgCentre+'saveMedia',
        fileUploadParams: {id: 'my_editor'},
        fileUploadMethod: 'POST',
        fileMaxSize: 20 * 1024 * 1024,
        fileAllowedTypes: ['*'],
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
          'file.beforeUpload': function (files) {
            console.log('beforeUpload')
          },
          'file.uploaded': function (response) {
            console.log('uploaded');
          },
          'file.inserted': function ($file, response) {
            console.log('inserted')
          },
          'file.error': function (error, response) {
            console.log(error);
            console.log(response);
          }
        }
      };
    } else if (this.type == 'sms') {
      this.options = {
        key: environment.froalaKey,
        attribution: false,
        apiKey: environment.froalaKey,
        charCounterMax: 160,
        pastePlain: true,
        imageUpload: false,
        toolbarButtons: ['undo', 'redo' , '|'],
        toolbarButtonsXS: ['undo', 'redo'],
        quickInsertEnabled: false
      }
    }
  }

  getCategory() {
    this.$categorysubscription = this.categoriesService.currentCategories.subscribe((data: any) =>{
      this.categories = data;
    })
  };

  getLabels() {
    this.$labelSubscription = this.labelsService.currentLabels.subscribe((data: any) => {
      this.labels = data;
    })
  }

  getCurrentUserInfo() {
    this.currentuserService.currentUser.subscribe((data) => {
      console.log(data)
      if(data && data.facility){ 
        if(data.facility.NotificationEmailAddress){
          this.NotificationEmailAddress = data.facility.NotificationEmailAddress;
        }

        if(data.facility.CenterType){
          console.log(data.facility.CenterType)
          this.centerType = data.facility.CenterType;
        }
      }
    })
  }

  initializeEmailForm = () => {
    this.emailForm = this.formBuilder.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  intializeDraft() {
    if (this.messageContent) {
      console.log(this.messageContent);
      this.emailForm.controls['subject'].setValue(this.messageContent.subject);
      this.emailForm.controls['message'].setValue(this.messageContent.message);
      this.recipientList = this.messageContent.recipients ? this.messageContent.recipients : [];
      console.log(this.recipientList);
      // debugger
    }
  }

  get f() { return this.emailForm.controls; }

  displayModal(senderList, composeModal) {
    this.submitted = true;
    if (this.emailForm.invalid) {
      return;
    }
    this.showSenderList = senderList;
    this.showComposeHtml = composeModal;
  }

  onSendEmail() {
    if (this.recipientList.length == 0) {
      if(this.type == 'email'){
        this.notificationService.info('Selected recipients do not have emails');
      }else if(this.type == 'sms'){
        this.notificationService.info('Selected recipients do not have mobile number');
      }
      return
    }
    const data = {
      subject: this.emailForm.controls['subject'].value,
      message: this.emailForm.controls['message'].value,
      recipients: this.recipientList,
      status: 'sent',
      NotificationEmailAddress: this.NotificationEmailAddress,
      categories: this.selectedCategories,
      labels: this.selectedLabels,
      messageType: this.type
    }
    if (this.messageContent) {
      data['_id'] = this.messageContent._id;
    }
    this.restService.post(environment.messageCentreOrigin, 'saveMessage', data).subscribe((data: any) => {
      // console.log(data)
      if (data) {
        this.action.emit(true);
        if(this.type == 'email'){
          this.notificationService.success("Email sent successfully");
        } else if(this.type == 'sms'){
          this.notificationService.success("Message sent successfully");
        }
        this.bsModalRef.hide();
      }
    })
  }

  onSaveDraft() {
    this.submitted = true;
    if (this.emailForm.invalid) {
      return;
    }
    const data = {
      subject: this.emailForm.controls['subject'].value,
      message: this.emailForm.controls['message'].value,
      recipients: this.recipientList,
      status: 'draft',
      categories: this.selectedCategories,
      labels: this.selectedLabels
    }
    if (this.messageContent) {
      data['_id'] = this.messageContent._id;
    }
    this.restService.post(environment.messageCentreOrigin, 'saveMessage', data).subscribe((data: any) => {
      if (data) {
        this.action.emit(true);
        this.notificationService.success("Draft saved successfully");
        this.bsModalRef.hide();
      }
    })
  }

  getStaff() {
    var body = {};
    if (this.staffName) {
      body = {
        'name': this.staffName
      }
    }
    if (this.selectedRoomStaff) {
      body['room'] = this.selectedRoomStaff;
    }
    this.restService.post(environment.mobileApiOrigin, 'getStaff', body).subscribe((data: any) => {
      this.staffList = data;
    })
  }

  getChildren = () => {
    const body = {};
    if (this.selectedRoom) {
      body['Room'] = this.selectedRoom;
    }
    if (this.childName) {
      body['childName'] = this.childName;
    }
    if(this.selectedEducator){
      body['educator'] = this.selectedEducator;
    }
    this.restService.post(environment.mobileApiOrigin, 'getcontacts', body).subscribe((data: any) => {
      this.childrenList = data;
    });
  }

  addRecipients(child, type) {
    if(child) {
      if (type === 'children') {
        if(child.contacts && child.contacts.length){
          _.map(child.contacts, (recipient) => {
            if (recipient.RecieveMessages) {
              if(recipient.Email || recipient.MobilePhone){
                if(this.type == 'email' && recipient.Email){
                  var recipientObject;
                  recipientObject = {
                    '_id': recipient._id,
                    'type': recipient.Type,
                    'email': recipient.Email,
                    'child': child._id
                  }
                  const index = _.findIndex(this.recipientList, recipientObject);
                  if (index === -1) {
                    if (this.selectedContactType.length && this.selectedContactType.indexOf(recipientObject.type) > -1 ) {
                      this.recipientList.push(recipientObject);
                    } else if (!this.selectedContactType.length) {
                      this.recipientList.push(recipientObject);
                    }
                  } else {
                    _.remove(this.recipientList, recipientObject);
                  }
                } else if(this.type == 'sms' && recipient.MobilePhone){
                  var recipientObject;
                  recipientObject = {
                    '_id': recipient._id,
                    'type': recipient.Type,
                    'mobilePhone': recipient.MobilePhone,
                    'child': child._id
                  };
                  const index = _.findIndex(this.recipientList, recipientObject);
                  if (index === -1) {
                    if (this.selectedContactType.length && this.selectedContactType.indexOf(recipientObject.type) > -1 ) {
                      this.recipientList.push(recipientObject);
                    } else if (!this.selectedContactType.length) {
                      this.recipientList.push(recipientObject);
                    }
                  } else {
                    _.remove(this.recipientList, recipientObject);
                  }
                }
                this.getselectedChildrenCount();
              }
            }
          });
        }
      } else if (type === 'staff') {
        if (child.Email || child.PhoneNumber) {
          if(this.type == 'email' && child.Email) {
            const recipientObject = {
              '_id': child._id,
              'type': type,
              'email': child.Email,
              'messageType': 'email'
            }
            const index = _.findIndex(this.recipientList, recipientObject);
            if (index === -1) {
              this.recipientList.push(recipientObject);
            } else {
              _.remove(this.recipientList, recipientObject);
            }
            this.getSelectedStaffCount();
          } else if(this.type == 'sms' && child.PhoneNumber) {
            const recipientObject = {
              '_id': child._id,
              'type': type,
              'mobilePhone': child.PhoneNumber,
              'messageType': 'sms'
            };
            const index = _.findIndex(this.recipientList, recipientObject);
            if (index === -1) {
              this.recipientList.push(recipientObject);
            } else {
              _.remove(this.recipientList, recipientObject);
            }
            this.getSelectedStaffCount();
          }
          
        }
      }
      console.log(this.recipientList)
    }
  }

  isChecked(child, type) {
    // console.log(child, type)
    if (type == 'children') {
      return (_.findIndex(this.recipientList, (recipient) => {
        return (recipient.child === child._id);
      }) > -1);
    } else if (type === 'staff') {
      return (_.findIndex(this.recipientList, (recipient) => {
        return (recipient._id === child._id);
      }) > -1);
    } else {
      return false;
    }
  }

  checkEmail = (child) => {
    if (!child) return;
    var email = child.contacts.parent ? child.contacts.parent.Email : child.contacts.Email;
    if (!email) {
      return true
    }
  }

  getRoom = () => {
    this.restService.post(environment.mobileApiOrigin, 'rooms', {}).subscribe((data: any) => {
      console.log(data);
      this.rooms = data.data.rooms_data;
    });
  }

  onRoomChange = () => {
    this.getChildren()
  }

  openModal(template: TemplateRef<any>) {
    this.submitted = true;
    if (this.emailForm.invalid) {
      return;
    }
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSendTestEmail() {
    if (!this.testEmail) {
      return;
    }
    const data = {
      subject: this.emailForm.controls['subject'].value,
      message: this.emailForm.controls['message'].value,
      email: this.testEmail,
      NotificationEmailAddress: this.NotificationEmailAddress,
    }

    this.restService.post(environment.messageCentreOrigin, 'sendTestEmailMessage', data).subscribe((data: any) => {
      if (data) {
        this.notificationService.success("Test email sent successfully");
        this.modalRef.hide()
      }
    });
  }

  onRoomChangeStaff() {
    this.getStaff();
  }

  onSelectContactType(val) {
    this.recipientList = [];
    if (this.selectedContactType.indexOf(val)>-1){
      _.remove(this.selectedContactType, function(contactType){
        return contactType === val;
      })
    } else{
      this.selectedContactType.push(val);
    }
    console.log(this.selectedContactType);
  }

  ngOnDestroy() {
    if (this.$categorysubscription) { this.$categorysubscription.unsubscribe(); };
    if (this.$labelSubscription) { this.$labelSubscription.unsubscribe(); };
  }

  onSelectCategory(category) {
    const index = _.findIndex(this.selectedCategories, (cat)=>{
      return cat == category
    });
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      _.remove(this.selectedCategories, (cat)=>{
        return cat == category;
      });
    }
  };

  onSelectLabels(label) {
    const index = _.findIndex(this.selectedLabels, (lab)=>{
      return lab == label;
    });
    if (index === -1) {
      this.selectedLabels.push(label);
    } else {
      _.remove(this.selectedLabels, (lab)=>{
        return lab == label;
      });
    }
  };

  onSelectAllChildren(val){
    if(val){
      _.remove(this.recipientList, function(recipient){
        return recipient.type != 'staff';
      })
      _.map(this.childrenList, (child)=>{
        this.addRecipients(child, 'children');
      })
    } else {
      _.remove(this.recipientList, function(recipient){
        return recipient.type != 'staff';
      })
    }
    this.getselectedChildrenCount();
  }

  onSelectAllStaff(val) {
    if (val) {
      _.remove(this.recipientList, function(recipient){
        return recipient.type == 'staff';
      });
      _.map(this.staffList,(staff)=>{
        this.addRecipients(staff,'staff')
      });
    } else {
      _.remove(this.recipientList, function(recipient){
        return recipient.type == 'staff';
      });
    }
    this.getSelectedStaffCount();
  }

  getSelectedStaffCount() {
    const staffs = _.filter(this.recipientList,(staff)=>{
      return staff.type == 'staff'
    });
    this.selectedStaffCount = staffs.length;
  }

  getselectedChildrenCount() {
    const children = _.filter(this.recipientList,(child)=>{
      return child.type != 'staff'
    });
    this.selectedChildrenCount = children.length;
  }

  getProfileImage(image){
    const  path2 = image.replace(/\\/g, "/");
    console.log(path2)
    return path2;
  }

  public onReady( editor ) {
    console.log(editor)
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

  onEducatorChange() {
    this.getChildren()
  }

  isLabelSelected(label) {
    const index = _.findIndex(this.selectedLabels, (lab)=>{
      return lab == label;
    });
    if (index > -1) {
      return true;
    } else{
      false
    }
  }

  isCategorySelected(category) {
    const index = _.findIndex(this.selectedCategories, (cat)=>{
      return cat == category;
    });
    if (index > -1) {
      return true;
    } else{
      false
    }
  }

  

}
