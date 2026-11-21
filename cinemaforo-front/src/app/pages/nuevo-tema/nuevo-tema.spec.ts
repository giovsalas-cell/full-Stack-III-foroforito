import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTema } from './nuevo-tema';

describe('NuevoTema', () => {
  let component: NuevoTema;
  let fixture: ComponentFixture<NuevoTema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoTema],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoTema);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
