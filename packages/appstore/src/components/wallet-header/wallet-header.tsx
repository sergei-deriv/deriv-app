import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';
import WalletCurrencyCard from './wallet-currency-card';
import WalletHeaderButtons from './wallet-header-buttons';
import WalletHeaderTitle from './wallet-header-title';
import WalletHeaderBalance from './wallet-header-balance';
import { TWalletAccount } from 'Types';
import { getWalletHeaderButtons } from 'Constants/utils';
import { observer, useStore } from '@deriv/stores';
import { useActiveWallet } from '@deriv/hooks';
import './wallet-header.scss';

type TWalletHeader = {
    wallet_account: TWalletAccount;
};

const WalletHeader = observer(({ wallet_account }: TWalletHeader) => {
    const { client, traders_hub } = useStore();
    const { switchAccount } = client;
    const is_active = useActiveWallet()?.is_selected;
    const { multipliers_account_status } = traders_hub;

    const is_demo = wallet_account.is_virtual;

    const wallet_buttons = getWalletHeaderButtons(is_demo);

    const onArrowClickHandler = async () => {
        if (!wallet_account.is_selected) await switchAccount(wallet_account.loginid);
    };

    return (
        <div className={classNames('wallet-header', { 'wallet-header__demo': wallet_account.is_virtual })}>
            <div className='wallet-header__container'>
                <WalletCurrencyCard
                    currency={wallet_account.currency}
                    is_virtual={wallet_account.is_virtual}
                    icon={wallet_account.icon}
                    icon_type={wallet_account.icon_type}
                />
                <div className='wallet-header__description'>
                    <WalletHeaderTitle
                        is_virtual={wallet_account.is_virtual}
                        currency={wallet_account.currency}
                        landing_company_name={wallet_account.landing_company_name}
                    />
                    <WalletHeaderButtons
                        is_disabled={!!multipliers_account_status}
                        is_open={!!is_active}
                        buttons={wallet_buttons}
                    />
                </div>
                <div className='wallet-header__balance'>
                    <WalletHeaderBalance balance={wallet_account.balance} currency={wallet_account.currency} />
                    <Icon
                        data_testid='dt_arrow'
                        onClick={onArrowClickHandler}
                        icon='IcChevronDownBold'
                        className={classNames('wallet-header__balance-arrow-icon', {
                            'wallet-header__balance-arrow-icon-active': is_active,
                        })}
                    />
                </div>
            </div>
        </div>
    );
});

export default WalletHeader;
