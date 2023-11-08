import React, { MouseEventHandler, useCallback } from 'react';
import { useQuery } from '@deriv/api';
import { WalletButton, WalletText } from '../../../../../../components';
import './FiatOnRampDisclaimer.scss';

type TFiatOnRampDisclaimer = {
    handleDisclaimer: MouseEventHandler<HTMLButtonElement>;
};

const FiatOnRampDisclaimer: React.FC<TFiatOnRampDisclaimer> = ({ handleDisclaimer }) => {
    const { data: provider } = useQuery('service_token', {
        payload: { referrer: window.location.href, service: 'banxa' },
    });

    const redirectToBanxa = useCallback(() => {
        const banxaUrl = provider?.service_token?.banxa?.url ?? '';
        if (banxaUrl) {
            const link = document.createElement('a');
            link.href = banxaUrl;
            link.target = '_blank';
            link.click();
        }
    }, [provider?.service_token?.banxa?.url]);

    return (
        <div className='wallets-fiat-onramp-disclaimer'>
            <WalletText color='prominent' size='md' weight='bold'>
                Disclaimer
            </WalletText>
            <WalletText size='sm'>
                By clicking <strong>Continue</strong>, you&apos;ll be redirected to Banxa, a third-party payment service
                provider. Please note that Deriv is not responsible for the content or services provided by Banxa. If
                you encounter any issues related to Banxa services, you should contact Banxa directly.
            </WalletText>
            <div className='wallets-fiat-onramp-disclaimer__buttons'>
                <WalletButton color='white' onClick={handleDisclaimer} size='md' text={'Back'} variant='outlined' />
                <WalletButton onClick={() => redirectToBanxa()} size='md' text={'Continue'} />
            </div>
        </div>
    );
};

export default FiatOnRampDisclaimer;
