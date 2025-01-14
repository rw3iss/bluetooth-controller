import { Fn } from 'lib/Types';

export default interface IEventEmitter {

    listeners: Array<Fn>;

    subscribe(callback: Fn): void;

    emit(event: string, data: any): void;

}