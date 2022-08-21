const subscribers = new Set();
const invoke = (subscriber) => subscriber();
const callSubscriber = () => subscribers.forEach(invoke);
let timer;
const clearTimer = () => clearTimeout(timer);
export const widgetsListener = {
    subscribe(subscriber) {
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
    },
    update() {
        clearTimer();
        timer = setTimeout(callSubscriber, 800);
        return clearTimer;
    },
};
//# sourceMappingURL=widgetsListener.js.map