import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  salt: string;
  passwordHash: string;
}

const USERS_KEY = 'voley.users.v1';
const SESSION_KEY = 'voley.session.v1';
const PASSWORD_ITERATIONS = 120_000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly currentUserSignal = signal<AuthUser | null>(this.restoreSession());
  readonly currentUser = this.currentUserSignal.asReadonly();

  async register(name: string, email: string, password: string): Promise<void> {
    const users = this.readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('Ya existe una cuenta con ese correo.');
    }

    const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
    const user: StoredUser = {
      name: name.trim(),
      email: normalizedEmail,
      salt: this.toBase64(salt),
      passwordHash: await this.hashPassword(password, salt),
    };

    this.storage().setItem(USERS_KEY, JSON.stringify([...users, user]));
    this.setSession(user);
  }

  async login(email: string, password: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.readUsers().find((savedUser) => savedUser.email === normalizedEmail);

    if (!user || !(await this.passwordMatches(password, user))) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    this.setSession(user);
  }

  logout(): void {
    this.storage().removeItem(SESSION_KEY);
    this.currentUserSignal.set(null);
  }

  private setSession(user: AuthUser): void {
    const session = { name: user.name, email: user.email };
    this.storage().setItem(SESSION_KEY, JSON.stringify(session));
    this.currentUserSignal.set(session);
  }

  private restoreSession(): AuthUser | null {
    if (!this.isBrowser) {
      return null;
    }

    const value = this.storage().getItem(SESSION_KEY);
    if (!value) {
      return null;
    }

    try {
      const session: unknown = JSON.parse(value);
      if (this.isAuthUser(session)) {
        return session;
      }
    } catch (error) {
      console.error('No se pudo leer la sesión guardada.', error);
    }

    this.storage().removeItem(SESSION_KEY);
    return null;
  }

  private readUsers(): StoredUser[] {
    const value = this.storage().getItem(USERS_KEY);
    if (!value) {
      return [];
    }

    let users: unknown;
    try {
      users = JSON.parse(value);
    } catch {
      throw new Error('Los datos de usuario guardados están dañados. Borra los datos del sitio e inténtalo de nuevo.');
    }

    if (!Array.isArray(users) || !users.every((user) => this.isStoredUser(user))) {
      throw new Error('El formato de los usuarios guardados no es válido.');
    }

    return users;
  }

  private async passwordMatches(password: string, user: StoredUser): Promise<boolean> {
    const salt = Uint8Array.from(atob(user.salt), (character) => character.charCodeAt(0));
    const candidate = await this.hashPassword(password, salt);
    return this.matchesInConstantTime(candidate, user.passwordHash);
  }

  private async hashPassword(password: string, salt: Uint8Array): Promise<string> {
    const saltBuffer = new ArrayBuffer(salt.byteLength);
    new Uint8Array(saltBuffer).set(salt);
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    const hash = await globalThis.crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: saltBuffer, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
      key,
      256,
    );
    return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  private matchesInConstantTime(value: string, expected: string): boolean {
    if (value.length !== expected.length) {
      return false;
    }

    let difference = 0;
    for (let index = 0; index < value.length; index += 1) {
      difference |= value.charCodeAt(index) ^ expected.charCodeAt(index);
    }
    return difference === 0;
  }

  private toBase64(bytes: Uint8Array): string {
    return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
  }

  private isAuthUser(value: unknown): value is AuthUser {
    if (!value || typeof value !== 'object') {
      return false;
    }

    return (
      'name' in value &&
      typeof value.name === 'string' &&
      'email' in value &&
      typeof value.email === 'string'
    );
  }

  private isStoredUser(value: unknown): value is StoredUser {
    if (!this.isAuthUser(value)) {
      return false;
    }

    return (
      'salt' in value &&
      typeof value.salt === 'string' &&
      'passwordHash' in value &&
      typeof value.passwordHash === 'string'
    );
  }

  private storage(): Storage {
    if (!this.isBrowser) {
      throw new Error('El inicio de sesión local solo está disponible en el navegador.');
    }

    return globalThis.localStorage;
  }
}
