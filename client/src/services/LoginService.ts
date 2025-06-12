import Cookies from "js-cookie";

export enum EventType {
  Login = "login",
  Logout = "logout",
}

export class LoginService {
  private static listeners: Map<EventType, Function[]> = new Map();

  static addEventListener(type: EventType, listener: Function): void {
    if (!LoginService.listeners.has(type)) {
      LoginService.listeners.set(type, []);
    }

    const listenerArray = LoginService.listeners.get(type);

    if (listenerArray?.indexOf(listener) === -1) {
      listenerArray?.push(listener);
    }
  }

  static removeEventListener(type: EventType, listener: Function): void {
    const listenerArray = LoginService.listeners.get(type);

    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener);

      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  static dispatchEvent(type: EventType): void {
    const listenerArray = LoginService.listeners.get(type);

    if (listenerArray !== undefined) {
      listenerArray.forEach((element) => {
        element();
      });
    }
  }

  static login(authToken: string) {
    Cookies.set("auth", authToken);
    LoginService.dispatchEvent(EventType.Login);
  }

  static logout() {
    Cookies.remove("auth");
    LoginService.dispatchEvent(EventType.Logout);
  }
}
