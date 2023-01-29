import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Bets } from 'app/shared/interfaces/bets.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { BetsService } from './bets.service';

@Injectable({
    providedIn: 'root',
})
export class BetsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _betsService: BetsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Bets[]> {
        return this._betsService.getBets();
    }
}

@Injectable({
    providedIn: 'root',
})
export class BetResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _router: Router, private _betsService: BetsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Bets> {
        return this._betsService.getBetById(route.paramMap.get('id')).pipe(
            // Error here means the requested task is not available
            catchError((error) => {
                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                this._router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            })
        );
    }
}
