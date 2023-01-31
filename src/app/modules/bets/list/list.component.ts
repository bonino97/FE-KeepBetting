import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
    BehaviorSubject,
    combineLatest,
    Subject,
    takeUntil,
    tap,
    catchError,
} from 'rxjs';
import { BetsService } from '../bets.service';
import { Bets } from '../../../shared/interfaces/bets.interface';

@Component({
    selector: 'bets-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetsListComponent implements OnInit, OnDestroy {
    results = ['true', 'false', 'away'];
    bets: Bets[];
    filteredBets: Bets[];
    filters: {
        oddResult$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        oddResult$: new BehaviorSubject('all'),
        query$: new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false),
    };

    badPronostics: Bets[] = [];
    goodPronostics: Bets[] = [];
    paymentAverage: number;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _betsService: BetsService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the bets
        this._betsService.bets$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((bets: Bets[]) => {
                this.bets = this.filteredBets = bets;

                this.badPronostics = this.bets.filter(
                    (bet) => bet?.oddResult === 'false'
                );

                this.goodPronostics = this.bets.filter(
                    (bet) => bet?.oddResult === 'true'
                );

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Filter the bets
        combineLatest([
            this.filters.oddResult$,
            this.filters.query$,
            this.filters.hideCompleted$,
        ]).subscribe(([oddResult, query, hideCompleted]) => {
            // Reset the filtered bets
            this.filteredBets = this.bets;

            // Filter by homeTeam
            if (oddResult !== 'all') {
                this.filteredBets = this.filteredBets.filter(
                    (bet) => bet?.oddResult === oddResult
                );
            }

            // Filter by search query
            if (query !== '') {
                this.filteredBets = this.filteredBets.filter(
                    (bet) =>
                        bet?.league
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                        bet?.awayTeam
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                        bet?.homeTeam
                            .toLowerCase()
                            .includes(query.toLowerCase())
                );
            }

            if (hideCompleted) {
                this.filteredBets = this.filteredBets.filter(
                    (bet) => !bet?.oddResult
                );
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void {
        this.filters.query$.next(query);
    }

    /**
     * Filter by homeTeam
     *
     * @param change
     */
    filterByResult(change: MatSelectChange): void {
        this.filters.oddResult$.next(change.value);
    }

    /**
     * Show/hide completed bets
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void {
        this.filters.hideCompleted$.next(change.checked);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    updateBet(bet: Bets, oddResult: string | boolean): void {
        this._betsService
            .updateBet(bet?._id, oddResult)
            .pipe(
                tap((res) => {
                    const bet = res;
                    const index = this.bets.findIndex(
                        (bet) => bet?._id === res?._id
                    );
                    this.bets[index] = bet;
                    this.filteredBets[index] = bet;
                    // Is not changing the value dinamically
                    this._changeDetectorRef.markForCheck();
                }),
                catchError((err) => {
                    return err;
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe();
    }
}
