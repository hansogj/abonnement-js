import 'array.defined/lib/polyfill';
interface IndexedObject {
    [key: string]: any;
}
export declare class Abonnement<T> {
    protected abonnenter: Function[];
    private aktuellVerdi;
    private ren;
    constructor(init?: T);
    abonner<T>(abonnent: (nyVerdi: T, gmlVerdi?: T) => void, callOnInit?: boolean): number;
    varsle(nyVerdi: T): T;
    readonly verdi: T;
    avslutt(id: number): void;
    readonly __test: IndexedObject;
}
export declare class AlleAbonnementer<T> extends Abonnement<T> {
    private list;
    private avsluttListe;
    constructor(list: Abonnement<any>[]);
    avslutt(id: number): void;
}
export declare class JoinedAbonnement<T> extends Abonnement<T> {
    private list;
    private avsluttListe;
    constructor(list: Abonnement<any>[]);
    avslutt(id: number): void;
}
export {};
