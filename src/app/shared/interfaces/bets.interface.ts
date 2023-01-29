export interface Bets {
    _id?: string;
    date?: String;
    league?: String;
    homeTeam?: String;
    awayTeam?: String;
    winnerTeam?: String;
    drawProbability?: Boolean;
    drawProbabilityTeam?: String;
    homeBookmakerAverage?: Number;
    drawBookmakerAverage?: Number;
    awayBookmakerAverage?: Number;
    oddResult?: String;
    createdAt?: Date;
    updatedAt?: Date;
}
