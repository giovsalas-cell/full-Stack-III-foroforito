import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTemas } from './admin-temas';

describe('AdminTemas', () => {
  let component: AdminTemas;
  let fixture: ComponentFixture<AdminTemas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTemas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTemas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
