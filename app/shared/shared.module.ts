import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from "ngx-bootstrap";
import { ModalModule } from 'ngx-bootstrap/modal';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorComponent } from './paginator/paginator.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/froala_editor.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
// import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/fullscreen.min';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/quick_insert.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/plugins/font_family.min.js';

@NgModule({
  declarations: [PaginatorComponent],
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot()
  ],
  exports:[
    TabsModule,
    BsDropdownModule,
    ModalModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorComponent,
    FroalaEditorModule,
    FroalaViewModule
  ]
})
export class SharedModule {

}
