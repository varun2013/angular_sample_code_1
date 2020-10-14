import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Output() action = new EventEmitter();
  modalRef: BsModalRef;
  name;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  onConfirm() {
    this.action.emit(true);
    this.bsModalRef.hide();
  }

  onCancel(){
    this.bsModalRef.hide();
  }

}
