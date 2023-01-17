import ModulesStore from './Modules';
import ProfitTableStore from './Modules/Profit/profit-store';
import StatementStore from './Modules/Statement/statement-store';
import type { TStores } from '@deriv/stores';

export type TRootStore = TStores & {
    modules: {
        profit_table: ProfitTableStore;
        statement: StatementStore;
    };
};

export default class RootStore {
    constructor(core_store: any) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = new ModulesStore(this);
        this.ui = core_store.ui;
        this.gtm = core_store.gtm;
        this.rudderstack = core_store.rudderstack;
        this.pushwoosh = core_store.pushwoosh;
        this.notifications = core_store.notifications;
        this.contract_replay = core_store.contract_replay;
        this.contract_trade = core_store.contract_trade;
        this.portfolio = core_store.portfolio;
        this.chart_barrier_store = core_store.chart_barrier_store;
        this.active_symbols = core_store.active_symbols;
    }
}
