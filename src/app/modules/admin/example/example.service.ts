import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { Bets } from 'app/shared/interfaces/bets.interface';

@Injectable({ providedIn: 'root' })
export class ExampleService {
    // Create a complete Bets Subject with Observable
    betsSubject: BehaviorSubject<Bets[]> = new BehaviorSubject<Bets[]>([]);
    bets$ = this.betsSubject.asObservable();

    constructor(private http: HttpClient) {}

    getBets(): void {
        this.http
            .get('https://sportsbetsscript-production.up.railway.app/api/bets')
            .pipe(
                tap((bets: Bets[]) => {
                    this.betsSubject.next(bets);
                })
            )
            .subscribe();
    }
}
