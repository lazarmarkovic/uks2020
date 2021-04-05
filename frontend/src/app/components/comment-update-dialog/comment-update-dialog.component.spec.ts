import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentUpdateDialogComponent } from './comment-update-dialog.component';

describe('CommentUpdateDialogComponent', () => {
  let component: CommentUpdateDialogComponent;
  let fixture: ComponentFixture<CommentUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
