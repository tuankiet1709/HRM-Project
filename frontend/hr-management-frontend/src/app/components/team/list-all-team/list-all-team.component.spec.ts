import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllTeamComponent } from './list-all-team.component';

describe('ListAllTeamComponent', () => {
  let component: ListAllTeamComponent;
  let fixture: ComponentFixture<ListAllTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAllTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
