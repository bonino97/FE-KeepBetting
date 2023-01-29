import { Route } from '@angular/router';
import { BetsComponent } from './bets.component';
import { BetsDetailsComponent } from './details/details.component';
import { BetsListComponent } from './list/list.component';
import { BetResolver, BetsResolver } from './bets.resolvers';

export const betsRoutes: Route[] = [
    {
        path: '',
        component: BetsComponent,
        resolve: {
            categories: BetsResolver,
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: BetsListComponent,
                resolve: {
                    bets: BetsResolver,
                },
            },
            {
                path: ':id',
                component: BetsDetailsComponent,
                resolve: {
                    bets: BetResolver,
                },
            },
        ],
    },
];
