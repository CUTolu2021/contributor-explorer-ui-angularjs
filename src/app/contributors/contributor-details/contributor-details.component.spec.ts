import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorDetailsComponent } from './contributor-details.component';

describe('ContributorDetailsComponent', () => {
  let component: ContributorDetailsComponent;
  let fixture: ComponentFixture<ContributorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
