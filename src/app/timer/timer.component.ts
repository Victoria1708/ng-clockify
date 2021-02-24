import {Component} from '@angular/core';
import {timer, Subscription} from 'rxjs';
import * as moment from 'moment';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  public seconds: string;
  public pauseSeconds: string;
  public result: number;
  public timer$: Subscription;

  constructor() {
    this.seconds = '00:00:00';
    this.pauseSeconds = null;
    this.result = 0;
  }

  stop(): void {
    this.timer$.unsubscribe();
    this.seconds = '00:00:00';
  }

  reset(): void {
    this.timer$.unsubscribe();
    this.seconds = '00:00:00';
    this.timer$ = timer(0, 1000).subscribe((value: number) => {
      this.seconds = this.getTime(value);
    });
  }

  start(): void {
    this.timer$ = timer(0, 1000).subscribe((value: number) => {
      this.seconds = this.getTime(value);
    });
  }

  pause(): void {
      this.timer$.unsubscribe();
      this.pauseSeconds = this.seconds;
  }

  unpause(): void {
    this.timer$ = timer(0, 1000).pipe(
      map(item => item + this.getStringToNumber(this.pauseSeconds))
    ).subscribe((value: number) => {
      this.seconds = this.getTime(value);
    });
  }

  private getTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${this.getRightNumberFormat(hours)}:${this.getRightNumberFormat(minutes)}:${this.getRightNumberFormat(seconds)}`;
  }

  private getRightNumberFormat(timeItem: number): string {
    if (timeItem < 10) {
      return '0' + timeItem;
    } else {
      return timeItem.toString();
    }

  }

  private getStringToNumber(timeItem: string): number {
    const arr = timeItem.split(':');
    let secResult = 0;

    if (+arr[0] > 0) {
      secResult += +arr[0] * 3600;
    }

    if (+arr[1] > 0) {
      secResult += +arr[1] * 60;
    }

    if (+arr[2] > 0) {
      secResult += +arr[2];
    }
    return secResult;
  }
}
