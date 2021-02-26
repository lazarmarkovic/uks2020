import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelUpdateDialogComponent } from './label-update-dialog.component';

describe('LabelUpdateDialogComponent', () => {
  let component: LabelUpdateDialogComponent;
  let fixture: ComponentFixture<LabelUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
