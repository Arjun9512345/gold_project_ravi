export class EncriptDecript {
  encrypt(value: any): any {
    return btoa(value);
  }

  decrypt(value: any): any {
    return atob(value);
  }
}
