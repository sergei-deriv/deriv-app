import { useMemo } from 'react';
import useAccountsList from './useAccountsList';

const currency_to_icon_mapper: Record<string, string> = {
    Demo: 'IcWalletDerivDemoLight',
    USD: 'IcWalletCurrencyUsd',
    EUR: 'IcWalletCurrencyEur',
    AUD: 'IcWalletCurrencyAud',
    GBP: 'IcWalletCurrencyGbp',
    BTC: 'IcWalletBitcoinLight',
    ETH: 'IcWalletEthereumLight',
    USDT: 'IcWalletTetherLight',
    eUSDT: 'IcWalletTetherLight',
    tUSDT: 'IcWalletTetherLight',
    UST: 'IcWalletTetherLight',
    LTC: 'IcWalletLiteCoinLight',
    USDC: 'IcWalletUsdCoinLight',
};

/** A custom hook that gets the list of all wallet accounts for the current user. */
const useWalletAccountsList = () => {
    const { data: account_list_data, ...rest } = useAccountsList();

    // Filter out non-wallet accounts.
    const filtered_accounts = useMemo(
        () => account_list_data?.filter(account => account.is_wallet),
        [account_list_data]
    );

    // Add additional information to each wallet account.
    const modified_accounts = useMemo(() => {
        return filtered_accounts?.map(wallet => {
            const wallet_currency_type = wallet.is_virtual ? 'Demo' : wallet.currency || '';
            const wallet_gradient_class_name = `${wallet_currency_type.toLowerCase()}-bg`;

            return {
                ...wallet,
                /** Returns the wallet's currency type. ex: `Demo`, `USD`, etc. */
                wallet_currency_type,
                /** Landing company shortcode the account belongs to. */
                landing_company_name: wallet.landing_company_name?.replace('maltainvest', 'malta'),
                /** Indicating whether the wallet is a maltainvest wallet. */
                is_malta_wallet: wallet.landing_company_name === 'malta',
                /** The gradient class name for the wallet header background. */
                gradient_header_class: `wallet-header__${wallet_gradient_class_name}`,
                /** The gradient class name for the wallet card background. */
                gradient_card_class: `wallet-card__${wallet_gradient_class_name}`,
                /** Local asset name for the wallet icon. ex: `IcWalletCurrencyUsd` for `USD`  */
                icon: currency_to_icon_mapper[wallet_currency_type],
            } as const;
        });
    }, [filtered_accounts]);

    // Sort wallet accounts alphabetically by fiat, crypto, then virtual.
    const sorted_accounts = useMemo(() => {
        if (!modified_accounts) return [];

        return [...modified_accounts].sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (a.currency_config?.is_crypto !== b.currency_config?.is_crypto) {
                return a.currency_config?.is_crypto ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [modified_accounts]);

    return {
        /** List of all wallet accounts for the current user. */
        data: sorted_accounts,
        ...rest,
    };
};

export default useWalletAccountsList;
