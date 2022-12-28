import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudEquipoComponent } from './solicitud-equipo.component';

describe('SolicitudEquipoComponent', () => {
  let component: SolicitudEquipoComponent;
  let fixture: ComponentFixture<SolicitudEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudEquipoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
