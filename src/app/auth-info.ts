export class AuthInfo {


  constructor(public uid: string, public displayName?: string) {
    uid = null;
    displayName = null;

  }

  isLoggedIn() {
    return !!this.uid;
  }

}
