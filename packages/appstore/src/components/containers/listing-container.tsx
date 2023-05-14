import React, { HTMLAttributes, ReactNode } from 'react';
import CurrencySwitcherCard from 'Components/currency-switcher-card';
import GridContainer from 'Components/containers/grid-container';
import TitleCardLoader from 'Components/pre-loader/title-card-loader';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import WalletTransferBlock from 'Components/wallet-content/wallet-transfer-block';
import './listing-container.scss';

type ListingContainerProps = {
    title: ReactNode;
    description: ReactNode;
    is_deriv_platform?: boolean;
    wallet_account?: TCoreStores['client']['accounts'][0];
    className?: string;
};

const ListingContainer = ({
    title,
    description,
    is_deriv_platform = false,
    wallet_account,
    children,
    className,
}: ListingContainerProps & Omit<HTMLAttributes<HTMLDivElement>, 'title'>) => {
    const { client } = useStore();
    const { is_landing_company_loaded } = client;

    const Options = () => {
        if (is_landing_company_loaded) {
            return (
                <div className='listing-container__title'>
                    {title}
                    {description}
                </div>
            );
        } else if (!is_deriv_platform) {
            return (
                <div className='listing-container__title'>
                    {title}
                    {description}
                </div>
            );
        }
        return <TitleCardLoader />;
    };

    const Switcher = () => {
        if (!is_deriv_platform) return null;
        if (wallet_account) return <WalletTransferBlock wallet_account={wallet_account} />;
        return <CurrencySwitcherCard />;
    };

    return (
        <div className={classNames('listing-container', className)}>
            <div className='listing-container__top-container'>
                <Options />
                <Switcher />
            </div>
            <GridContainer>{children}</GridContainer>
        </div>
    );
};

export default observer(ListingContainer);
