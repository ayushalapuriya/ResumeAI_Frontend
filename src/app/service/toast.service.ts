import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'loading' | 'info';

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  state = signal<ToastState>({ visible: false, message: '', type: 'success' });

  private timer: any;

  show(message: string, type: ToastType = 'success', duration = 2800) {
    clearTimeout(this.timer);
    this.state.set({ visible: true, message, type });
    if (type !== 'loading') {
      this.timer = setTimeout(() => this.hide(), duration);
    }
  }

  hide() {
    clearTimeout(this.timer);
    this.state.set({ ...this.state(), visible: false });
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string)   { this.show(message, 'error');   }
  loading(message: string) { this.show(message, 'loading', 0); }
  info(message: string)    { this.show(message, 'info');    }
}
