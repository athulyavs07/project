import { Subject } from "rxjs";

const subject = new Subject();

export const loaderService = {
  sendMessage: (message: any) => subject.next({ message }),
  clearMessages: () => subject.next(false),
  onMessage: () => subject.asObservable(),
};
