import { Abonnement, JoinedAbonnement, AlleAbonnementer } from '../src/abonnement';

let stringAbonnement: Abonnement<String>;
let numberAbonnement: Abonnement<number>;
let stringAbonnent: jasmine.Spy;
let numberAbonnent: jasmine.Spy;
let stringAbonnentId: number;
let numberAbonnentId: number;
const initiellVerdi: string = 'initiell verdi';
const nyVerdi: string = 'random oppdatering av verdi';
const lastCall = (spy: jasmine.Spy) => spy.calls.mostRecent().args.shift();

describe('Abonnement ', () => {

    beforeEach(() => stringAbonnement = new Abonnement<String>(initiellVerdi));
    beforeEach(() => numberAbonnement = new Abonnement<number>());
    beforeEach(() => stringAbonnent = jasmine.createSpy('stringSpy'));
    beforeEach(() => numberAbonnent = jasmine.createSpy('numberSpy'));
    beforeEach(() => stringAbonnentId = stringAbonnement.abonner(stringAbonnent));
    beforeEach(() => numberAbonnentId = numberAbonnement.abonner(numberAbonnent));

    describe('setter opp abonnement', () => {
        it('abonnent er lagt til liste over abonnenter', () => {
            expect(stringAbonnement.__test.abonnenter.length).toEqual(1);
            expect(numberAbonnement.__test.abonnenter.length).toEqual(1);
        });

        it('listen over abonnenter vokser', () => {
            stringAbonnement.abonner(() => { });
            stringAbonnement.abonner(() => { });
            stringAbonnement.abonner(() => { });
            stringAbonnement.abonner(() => { });
            expect(stringAbonnement.__test.abonnenter.length).toEqual(5);
        });

        it('abonnement kalles umiddelbart hvis initiell verdi er angitt', () => {
            expect(stringAbonnent).toHaveBeenCalledTimes(1);
            expect(stringAbonnent).toHaveBeenCalledWith(initiellVerdi);
            expect(numberAbonnent).not.toHaveBeenCalled();
        });
    });

    describe('abonennt kalles ved oppdatering', () => {
        beforeEach(() => stringAbonnement.varsle(nyVerdi));
        beforeEach(() => numberAbonnement.varsle(22));

        it('abonnent blir kallet', () => {
            expect(stringAbonnent).toHaveBeenCalledTimes(2);
            expect(numberAbonnent).toHaveBeenCalledTimes(1);
        });

        it('abonnent oppdateres med ny verdi', () => {
            expect(lastCall(stringAbonnent)).toEqual(nyVerdi);
            expect(lastCall(numberAbonnent)).toEqual(22);
        });
    });

    describe('abonnement skal ikke kalles initielt hvis angitt ', () => {
        let annenSpion: jasmine.Spy;
        beforeEach(() => annenSpion = jasmine.createSpy('annenSpion'));
        beforeEach(() => stringAbonnement.abonner(annenSpion, false));
        it('er ikke kalt verdi', () => expect(annenSpion).not.toHaveBeenCalled());
        describe('men så', () => {
            beforeEach(() => stringAbonnement.varsle(nyVerdi));
            it('er ikke kalt verdi', () => expect(annenSpion).toHaveBeenCalledTimes(1));
        });
    });

    describe('abonnement holder på aktuell verdi ', () => {
        beforeEach(() => stringAbonnement.varsle(nyVerdi));

        it('forventet verdi', () => {
            expect(stringAbonnement.verdi).toEqual(nyVerdi);
            expect(numberAbonnement.verdi).toEqual(undefined);
        });
    });

    describe('abonnent kalles med oppdatering + utgått verdi', () => {
        beforeEach(() => numberAbonnement.varsle(0));
        beforeEach(() => numberAbonnement.varsle(22));
        it('abonnent oppdatert med ny og gammel verdi', () => {
            expect(numberAbonnent.calls.mostRecent().args).toEqual([22, 0]);
        });
    });

    describe('abonnent skal kunne melde seg av abonnementet', () => {

        beforeEach(() => stringAbonnement.avslutt(stringAbonnentId));
        beforeEach(() => numberAbonnement.avslutt(numberAbonnentId));

        beforeEach(() => stringAbonnement.varsle(nyVerdi));
        beforeEach(() => numberAbonnement.varsle(22));

        it('abonnent er fjernet fra liste over abonnenter', () => {
            expect(stringAbonnement.__test.abonnenter.length).toEqual(0);
            expect(numberAbonnement.__test.abonnenter.length).toEqual(0);
        });

        it('abonnent blir ikke kallt selvom abonnementstilbyder oppdaterer', () => {
            expect(stringAbonnent).toHaveBeenCalledTimes(1);
            expect(stringAbonnent).toHaveBeenCalledWith(initiellVerdi);

            expect(numberAbonnent).not.toHaveBeenCalled();
        });
    });
});

describe('JoinedAbonnement', () => {
    let stringAbonnement: Abonnement<string>;
    let numberAbonnement: Abonnement<number>;
    let joinedAbonnement: Abonnement<any>;
    let joinedAbonnent: jasmine.Spy;

    beforeEach(() => stringAbonnement = new Abonnement<string>(initiellVerdi));
    beforeEach(() => numberAbonnement = new Abonnement<number>());
    beforeEach(() => joinedAbonnent = jasmine.createSpy('joinedSpy'));
    beforeEach(() => joinedAbonnement = new JoinedAbonnement([stringAbonnement, numberAbonnement]));
    beforeEach(() => joinedAbonnement.abonner(joinedAbonnent));

    it('blir kallt initielt', () => expect(joinedAbonnent).toHaveBeenCalled());
    it('blir kallt initielt', () => expect(lastCall(joinedAbonnent)).toEqual([initiellVerdi, undefined]));

    describe('kalles nå en av verdiene endrer seg', () => {
        beforeEach(() => numberAbonnement.varsle(2));
        it('oppdatert', () => expect(joinedAbonnent).toHaveBeenCalledTimes(2));
        it('oppdatert', () => expect(lastCall(joinedAbonnent)).toEqual([initiellVerdi, 2]));
    });

    describe('kalles nå en av verdiene endrer seg selvom den er undefined', () => {
        beforeEach(() => stringAbonnement.varsle(undefined));
        it('oppdatert', () => expect(joinedAbonnent).toHaveBeenCalledTimes(2));
        it('oppdatert', () => expect(lastCall(joinedAbonnent)).toEqual([undefined, undefined]));

        it('begge oppdatert', () => {
            stringAbonnement.varsle('EN');
            numberAbonnement.varsle(2);
            expect(joinedAbonnent).toHaveBeenCalledTimes(4);
            expect(lastCall(joinedAbonnent)).toEqual(['EN', 2]);
        });
    });

    describe('AlleAbonnenter', () => {
        let stringAbonnement: Abonnement<string>;
        let numberAbonnement: Abonnement<number>;
        let alleAbonnenter: Abonnement<any>;
        let alleSpy: jasmine.Spy;

        beforeEach(() => stringAbonnement = new Abonnement<string>(undefined));
        beforeEach(() => numberAbonnement = new Abonnement<number>(undefined));

        beforeEach(() => alleSpy = jasmine.createSpy('joinedSpy'));
        beforeEach(() => alleAbonnenter = new AlleAbonnementer([stringAbonnement, numberAbonnement]));
        beforeEach(() => alleAbonnenter.abonner(alleSpy));

        it('blir ikke  kallt initielt', () => expect(alleSpy).not.toHaveBeenCalled());

        describe('kalles ikke om kun  en av verdiene er definert', () => {
            beforeEach(() => numberAbonnement.varsle(2));
            it('oppdatert', () => expect(alleSpy).not.toHaveBeenCalled());
        });

        describe('kalles kun om alle verdier er definert', () => {
            beforeEach(() => stringAbonnement.varsle(undefined));
            beforeEach(() => numberAbonnement.varsle(2));
            it('oppdatert', () => expect(alleSpy).not.toHaveBeenCalled());
            it('begge oppdatert', () => {
                stringAbonnement.varsle('EN');
                expect(alleSpy).toHaveBeenCalledTimes(1);
                expect(lastCall(alleSpy)).toEqual(['EN', 2]);
            });
        });

        describe('kalles ikke om en verdi går tilbake til undef', () => {
            beforeEach(() => stringAbonnement.varsle('EN'));
            beforeEach(() => numberAbonnement.varsle(2));
            it('oppdatert', () => expect(alleSpy).toHaveBeenCalledTimes(1));
            it('begge oppdatert', () => {
                stringAbonnement.varsle(undefined);
                expect(alleSpy).toHaveBeenCalledTimes(1);
                expect(lastCall(alleSpy)).toEqual(['EN', 2]);
            });
        });
    });
});
