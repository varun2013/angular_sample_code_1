import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftListingComponent } from './draft-listing.component';

describe('DraftListingComponent', () => {
  let component: DraftListingComponent;
  let fixture: ComponentFixture<DraftListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
