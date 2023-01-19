import { ProposalOpenContract } from '@deriv/api-types';
import { getUnsupportedContracts } from '../constants';
import { getSymbolDisplayName, TActiveSymbols } from './active-symbols';
import { getMarketInformation } from './market-underlying';

// export type TPortfolioPos = {
//     account_id: number;
//     barrier_count: number;
//     bid_price: number;
//     buy_price: number;
//     cancellation?: {
//         ask_price?: number;
//         date_expiry: number;
//     };
//     commission: number;
//     contract_id: number;
//     contract_type: string;
//     currency: string;
//     current_spot: number;
//     current_spot_display_value: string;
//     current_spot_time: number;
//     date_expiry: number;
//     date_settlement: number;
//     date_start: number;
//     display_name: string;
//     entry_spot: number;
//     entry_spot_display_value: string;
//     entry_tick: number;
//     entry_tick_display_value: string;
//     entry_tick_time: number;
//     expiry_time: number;
//     id: string;
//     is_expired: boolean;
//     is_forward_starting?: boolean;
//     is_intraday: boolean;
//     is_path_dependent: boolean;
//     is_settleable: boolean;
//     is_sold: boolean;
//     is_valid_to_cancel: boolean;
//     is_valid_to_sell: boolean;
//     limit_order: LimitOrder;
//     longcode: string;
//     multiplier: number;
//     payout: number;
//     profit: number;
//     profit_percentage: number;
//     purchase_time: number;
//     shortcode: string;
//     status: string;
//     transaction_id?: number;
//     transaction_ids: TransactionIDs;
//     underlying: string;
// };

// type TransactionIDs = {
//     buy: number;
//     sell: number;
// };

// type LimitOrder = {
//     stop_out: Stopout;
//     stop_loss?: null | number;
//     take_profit?: null | number;
// };

// type Stopout = {
//     display_name: string;
//     order_amount: number;
//     order_date: number;
//     value: string;
// };

type TIsUnSupportedContract = {
    contract_type?: string;
    is_forward_starting?: 0 | 1;
};

const isUnSupportedContract = (portfolio_pos: TIsUnSupportedContract) =>
    !!getUnsupportedContracts()[portfolio_pos.contract_type as keyof typeof getUnsupportedContracts] || // check unsupported contract type
    !!portfolio_pos.is_forward_starting; // for forward start contracts

export const formatPortfolioPosition = (
    portfolio_pos: ProposalOpenContract,
    active_symbols: TActiveSymbols = [],
    indicative?: number
) => {
    const purchase = portfolio_pos.buy_price;
    const payout = portfolio_pos.payout;
    const display_name = getSymbolDisplayName(
        active_symbols,
        getMarketInformation(portfolio_pos.shortcode ?? '').underlying
    );
    // const transaction_id =
    //     portfolio_pos.transaction_id || (portfolio_pos.transaction_ids && portfolio_pos.transaction_ids.buy);
    const transaction_id = portfolio_pos.transaction_ids && portfolio_pos.transaction_ids.buy;

    return {
        contract_info: portfolio_pos,
        details: portfolio_pos.longcode?.replace(/\n/g, '<br />'),
        display_name,
        id: portfolio_pos.contract_id,
        indicative: (indicative && isNaN(indicative)) || !indicative ? 0 : indicative,
        payout,
        purchase,
        profit_loss: portfolio_pos.profit,
        reference: Number(transaction_id),
        type: portfolio_pos.contract_type,
        is_unsupported: isUnSupportedContract(portfolio_pos),
        contract_update: portfolio_pos.limit_order,
    };
};
