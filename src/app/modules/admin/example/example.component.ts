import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Bets } from 'app/shared/interfaces/bets.interface';
import { Observable } from 'rxjs';
import { ExampleService } from './example.service';

@Component({
    selector: 'example',
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ExampleComponent implements OnInit {
    bets$: Observable<Bets[]>;

    constructor(private exampleService: ExampleService) {}

    ngOnInit(): void {
        this.getBets();
        this.bets$ = this.exampleService.bets$;
    }

    getBets(): void {
        this.exampleService.getBets();
    }
}
