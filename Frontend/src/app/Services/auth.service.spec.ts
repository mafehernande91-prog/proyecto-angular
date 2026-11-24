import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('registers a user, saves a session, and logs out', async () => {
    await service.register('Sam Player', 'SAM@example.com', 'voleibol123');

    expect(service.currentUser()).toEqual({ name: 'Sam Player', email: 'sam@example.com' });
    expect(localStorage.getItem('voley.session.v1')).toContain('sam@example.com');

    const savedUsers = localStorage.getItem('voley.users.v1') ?? '';
    expect(savedUsers).not.toContain('voleibol123');
    expect(savedUsers).toContain('passwordHash');

    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('voley.session.v1')).toBeNull();

    await service.login('SAM@example.com', 'voleibol123');
    expect(service.currentUser()).toEqual({ name: 'Sam Player', email: 'sam@example.com' });
  });

  it('rejects duplicate registrations and invalid credentials', async () => {
    await service.register('Sam Player', 'sam@example.com', 'voleibol123');

    await expect(service.register('Another Player', 'SAM@example.com', 'voleibol456'))
      .rejects.toThrow('Ya existe una cuenta');
    await expect(service.login('sam@example.com', 'incorrecta123'))
      .rejects.toThrow('Correo o contraseña incorrectos');
    expect(service.currentUser()).toEqual({ name: 'Sam Player', email: 'sam@example.com' });
  });
});
