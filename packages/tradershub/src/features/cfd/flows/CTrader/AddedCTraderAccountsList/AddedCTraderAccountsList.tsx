import React, { FC, Fragment } from 'react';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components';
import { getStaticUrl } from '../../../../../helpers/urls';
import CTrader from '../../../../../public/images/cfd/ctrader.svg';
import { PlatformDetails } from '../../../constants';

const AddedCTraderAccountsList: FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();

    const leading = () => (
        <div
            className='cursor-pointer'
            onClick={() => {
                window.open(getStaticUrl('/deriv-ctrader'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/deriv-ctrader'));
                }
            }}
        >
            <CTrader />
        </div>
    );

    const trailing = () => (
        <div className='flex flex-col gap-y-200'>
            <Button
                // todo: open transfer modal
                variant='secondary'
            >
                Transfer
            </Button>
            <Button>Open</Button>
        </div>
    );

    return (
        <div>
            <TradingAccountCard leading={leading} trailing={trailing}>
                <div className='flex flex-col flex-grow'>
                    {cTraderAccounts
                        ?.filter(account => account.is_virtual === activeTrading?.is_virtual)
                        .map(account => (
                            <Fragment key={`added-ctrader-${account.login}`}>
                                <Text size='sm'>{PlatformDetails.ctrader.title}</Text>
                                <Text bold size='sm'>
                                    {account?.formatted_balance}
                                </Text>
                                <Text bold color='primary' size='sm'>
                                    {account.login}
                                </Text>
                            </Fragment>
                        ))}
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AddedCTraderAccountsList;