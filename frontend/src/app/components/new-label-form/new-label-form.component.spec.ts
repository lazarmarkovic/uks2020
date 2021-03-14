import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLabelFormComponent } from './new-label-form.component';

describe('NewLabelFormComponent', () => {
  let component: NewLabelFormComponent;
  let fixture: ComponentFixture<NewLabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLabelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
