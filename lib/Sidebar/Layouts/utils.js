import { saveValue, getSavedValue } from 'san-webkit/lib/utils/localStorage';
import { queryShortLayout } from './../../../lib/api/layouts';
import { getSavedRecentLayoutIds, removeRecentLayoutId } from './../../../lib/Layouts/utils';
export var Tab;
(function (Tab) {
    Tab["MyLibrary"] = "My Library";
    Tab["Explore"] = "Explore";
})(Tab || (Tab = {}));
export const TABS = [Tab.MyLibrary, Tab.Explore];
const TICKER = 'TICKER';
export const TICKER_LAYOUTS = TICKER + ' layouts';
export const normalizeCategory = (title, ticker) => title.replace(TICKER, ticker);
export const newMyLibaryGraph = () => ({
    'Recently viewed': [],
    'My layouts': [],
});
export const newExploreGraph = () => ({
    'Featured by Santiment': [],
    [TICKER_LAYOUTS]: [],
});
const emptyLayoutsFilter = (layouts) => layouts.filter(Boolean);
export function queryRecentLayouts() {
    const ids = getSavedRecentLayoutIds();
    const query = (id) => queryShortLayout(id).catch(() => {
        removeRecentLayoutId(id);
        return null;
    });
    return ids.length ? Promise.all(ids.map(query)).then(emptyLayoutsFilter) : Promise.resolve([]);
}
const HAS_OPENED_MY_LIBRARY = 'HAS_OPENED_MY_LIBRARY';
export const checkHasOpenedMyLibrary = () => !!getSavedValue(HAS_OPENED_MY_LIBRARY);
export const saveHasOpenedMyLibrary = () => saveValue(HAS_OPENED_MY_LIBRARY, '+');
//# sourceMappingURL=utils.js.map