import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { TWalletAccount } from 'Types';
import { observer, useStore } from '@deriv/stores';
import './wallet.scss';

type TWallet = {
    wallet_account: TWalletAccount;
};

const Wallet = observer(({ wallet_account }: TWallet) => {
    const {
        client: { loginid },
    } = useStore();

    const is_demo = wallet_account.is_virtual;
    const active = wallet_account.loginid === loginid;

    return (
        <div
            className={classNames('wallet', {
                wallet__demo: is_demo,
            })}
        >
            <WalletHeader wallet_account={wallet_account} />
            <CSSTransition appear in={active} timeout={240} classNames='wallet__content-transition' unmountOnExit>
                <WalletContent
                    is_demo={!!is_demo}
                    is_eu={wallet_account.landing_company_name === 'malta'}
                    wallet_account={wallet_account}
                />
            </CSSTransition>
        </div>
    );
});

export default Wallet;
