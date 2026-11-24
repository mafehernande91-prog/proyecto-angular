import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EntrenamientosService } from './entrenamientos';

describe('EntrenamientosService', () => {
  let service: EntrenamientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(EntrenamientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
