import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    map,
    Observable,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { Bets } from 'app/shared/interfaces/bets.interface';

@Injectable({
    providedIn: 'root',
})
export class BetsService {
    private url = 'https://sportsbetsscript-production.up.railway.app/api/bets';
    // private url = 'http://localhost:3000/api/bets';
    // Private
    private _bet: BehaviorSubject<Bets | null> = new BehaviorSubject(null);
    private _bets: BehaviorSubject<Bets[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for courses
     */
    get bets$(): Observable<Bets[]> {
        return this._bets.asObservable();
    }

    /**
     * Getter for bets
     */
    get bet$(): Observable<Bets> {
        return this._bet.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get courses
     */
    getBets(): Observable<Bets[]> {
        return this._httpClient.get<Bets[]>(this.url).pipe(
            tap((response: any) => {
                this._bets.next(response);
            })
        );
    }

    /**
     * Get bets by id
     */
    getBetById(id: string): Observable<Bets> {
        return this._httpClient.get<Bets>(this.url, { params: { id } }).pipe(
            map((bet) => {
                // Update the bet
                this._bet.next(bet);

                // Return the bet
                return bet;
            }),
            switchMap((bets) => {
                if (!bets) {
                    return throwError(
                        'Could not found bets with id of ' + id + '!'
                    );
                }

                return of(bets);
            })
        );
    }

    /**
     * Update bets
     * @param bets
     * @returns {Observable<Bets>}
     */

    updateBet(betId: string, oddResult: string | boolean): Observable<Bets> {
        return this._httpClient
            .put<Bets>(`${this.url}/${betId}`, { oddResult })
            .pipe(
                map((response) => {
                    return response;
                }),
                tap((response) => {
                    const bets = this._bets.value;
                    const index = bets.findIndex((bet) => bet._id === betId);
                    bets[index] = response;
                    this._bets.next(bets);
                })
            );
    }
}
