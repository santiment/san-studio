export function debounced(clb) {
    let timer;
    return (...args) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => clb(...args), 100);
    };
}
//# sourceMappingURL=utils.js.map