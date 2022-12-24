import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarSeguimientoComponent } from './buscar-seguimiento.component';

describe('BuscarSeguimientoComponent', () => {
  let component: BuscarSeguimientoComponent;
  let fixture: ComponentFixture<BuscarSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarSeguimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
