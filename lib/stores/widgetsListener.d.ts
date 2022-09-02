declare type Subscriber = () => void;
declare type Unsubscriber = () => void;
declare type TimerCleaner = () => void;
export declare const widgetsListener: {
    subscribe(subscriber: Subscriber): Unsubscriber;
    update(): TimerCleaner;
};
export {};
