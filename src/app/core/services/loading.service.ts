import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  readonly isLoading = signal<boolean>(false);
  private activeRequests: number = 0;

  constructor() { }

  show(): void {
    if(this.activeRequests === 0){
      this.isLoading.set(true);
    }
    this.activeRequests++;
  }

  hide(): void {
    this.activeRequests--;
    if(this.activeRequests <= 0) {
    this.activeRequests = 0;
      this.isLoading.set(false);
    }
  }
}