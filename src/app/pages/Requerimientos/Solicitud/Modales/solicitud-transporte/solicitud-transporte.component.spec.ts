import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTransporteComponent } from './solicitud-transporte.component';

describe('SolicitudTransporteComponent', () => {
  let component: SolicitudTransporteComponent;
  let fixture: ComponentFixture<SolicitudTransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudTransporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
