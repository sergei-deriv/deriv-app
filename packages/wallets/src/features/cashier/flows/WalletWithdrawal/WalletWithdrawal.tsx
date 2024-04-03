import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig } from '@deriv/api-v2';
import { Loader, WalletsErrorScreen } from '../../../../components';
import {
    CashierLocked,
    WithdrawalCryptoModule,
    WithdrawalFiatModule,
    WithdrawalLocked,
    WithdrawalVerificationModule,
} from '../../modules';

const WalletWithdrawal = () => {
    const { error, isSuccess: isCurrencyConfigSuccess } = useCurrencyConfig();
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const loginidQueryParam = queryParams.get('loginid');
        const verificationQueryParam = queryParams.get('verification');

        // if loginid query param doesn't match active wallet's loginid on mount, initiate account switching
        if (loginidQueryParam && loginidQueryParam !== activeWallet?.loginid) {
            switchAccount(loginidQueryParam);
            return;
        }

        // given that loginid query param matches active wallet's loginid on mount, clear query params and proceed
        if (verificationQueryParam) {
            setVerificationCode(verificationQueryParam);

            const url = new URL(window.location.href);
            url.searchParams.delete('loginid');
            url.searchParams.delete('verification');
            window.history.replaceState({}, document.title, url.toString());
        }
    }, [activeWallet?.loginid, switchAccount]);

    const isCrypto = activeWallet?.currency_config?.is_crypto;

    if (verificationCode) {
        if (isCurrencyConfigSuccess && activeWallet?.currency) {
            return (
                <CashierLocked module='withdrawal'>
                    <WithdrawalLocked>
                        {isCrypto ? (
                            <WithdrawalCryptoModule
                                onClose={() => {
                                    setVerificationCode('');
                                }}
                                verificationCode={verificationCode}
                            />
                        ) : (
                            <WithdrawalFiatModule verificationCode={verificationCode} />
                        )}
                    </WithdrawalLocked>
                </CashierLocked>
            );
        } else if (!isCurrencyConfigSuccess) return <WalletsErrorScreen message={error?.error.message} />;
        return <Loader />;
    }

    return (
        <CashierLocked module='withdrawal'>
            <WithdrawalLocked>
                <WithdrawalVerificationModule />
            </WithdrawalLocked>
        </CashierLocked>
    );
};

export default WalletWithdrawal;
