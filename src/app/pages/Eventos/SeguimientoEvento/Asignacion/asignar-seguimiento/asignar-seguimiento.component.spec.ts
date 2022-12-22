import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSeguimientoComponent } from './asignar-seguimiento.component';

describe('AsignarSeguimientoComponent', () => {
  let component: AsignarSeguimientoComponent;
  let fixture: ComponentFixture<AsignarSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarSeguimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
