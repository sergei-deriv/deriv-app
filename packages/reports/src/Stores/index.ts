import ProfitTableStore from './Modules/Profit/profit-store';
import StatementStore from './Modules/Statement/statement-store';
import type { TStores } from '@deriv/stores';

export type TRootStore = TStores & {
    modules: {
        profit_table: ProfitTableStore;
        statement: StatementStore;
    };
};
