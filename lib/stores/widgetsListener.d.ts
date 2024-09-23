type Subscriber = () => void;
type Unsubscriber = () => void;
type TimerCleaner = () => void;
export declare const widgetsListener: {
    subscribe(subscriber: Subscriber): Unsubscriber;
    update(): TimerCleaner;
};
export {};
