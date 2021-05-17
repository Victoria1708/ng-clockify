import {Component, OnInit} from '@angular/core';
import {interval, merge, Observable, of, Subject, timer} from 'rxjs';
import {buffer, exhaustMap, filter, map, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  public timerStarted: boolean;
  public time$: Observable<string>;
  private waitClicks$: Subject<void>;
  private stop$: Subject<string>;
  private pause$: Observable<any>;
  private seconds: number;

  constructor() {
    this.seconds = 0;
    this.waitClicks$ = new Subject<void>();
    this.stop$ = new Subject<string>();
  }

  ngOnInit(): void {
    this.pause$ = this.waitClicks$.pipe(
      buffer(this.waitClicks$.pipe(exhaustMap(() => timer(300)))),
      filter(clicks => clicks.length > 1)
    );

    this.pause$.subscribe(() => {
      this.timerStarted = false;
    });
  }

  stop(): void {
    this.stop$.next();
    this.seconds = 0;
    this.timerStarted = false;
  }

  reset(): void {
    this.stop();
    this.start();
  }

  start(): void {
    const stop$ = merge(this.pause$, this.stop$);
    if (!this.timerStarted) {
      this.timerStarted = true;
      this.time$ = of(this.seconds).pipe(
        switchMap(seconds => interval(1000).pipe(map((v) => {
          this.seconds = seconds + (v + 1);
          return seconds + (v + 1);
        }), takeUntil(stop$))),
        map(seconds => this.getTime(seconds))
      );
    }
  }

  wait(): void {
    this.waitClicks$.next();
  }

  private getTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }
}
