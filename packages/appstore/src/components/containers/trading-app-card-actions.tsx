import { Button, AsDisabledWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import TradeButton from 'Components/trade-button/trade-button';
import React from 'react';
import { observer, useStore } from '@deriv/stores';
import MultiActionButtonGroup from 'Components/multi-action-button-group';
import { useWalletMigration } from '@deriv/hooks';

export type Actions = {
    action_type: 'get' | 'none' | 'trade' | 'dxtrade' | 'multi-action'; // multi-action can be tranfer_trade or top_up_trade
    clickable_icon?: boolean;
    link_to?: string;
    has_divider?: boolean;
    onAction?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    is_external?: boolean;
    new_tab?: boolean;
    is_buttons_disabled?: boolean;
    is_account_being_created?: boolean;
    is_real?: boolean;
};

const TradingAppCardActions = observer(
    ({
        action_type,
        link_to,
        onAction,
        is_external,
        new_tab,
        is_account_being_created,
        is_buttons_disabled,
        is_real,
    }: Actions) => {
        const { traders_hub } = useStore();
        const { setWalletsMigrationInProgressPopup } = traders_hub;
        const { status: wallet_migration_status } = useWalletMigration();

        switch (action_type) {
            case 'get':
                return (
                    <AsDisabledWrapper
                        is_active={wallet_migration_status === 'in_progress'}
                        onAction={() => setWalletsMigrationInProgressPopup(true)}
                    >
                        <Button disabled={is_account_being_created} primary_light onClick={onAction}>
                            {localize('Get')}
                        </Button>
                    </AsDisabledWrapper>
                );
            case 'trade':
                return (
                    <TradeButton link_to={link_to} onAction={onAction} is_external={is_external} new_tab={new_tab} />
                );
            case 'dxtrade':
                return <TradeButton link_to={link_to} />;
            case 'multi-action':
                return (
                    <MultiActionButtonGroup
                        link_to={link_to}
                        onAction={onAction}
                        is_buttons_disabled={is_buttons_disabled}
                        is_real={is_real}
                    />
                );
            case 'none':
            default:
                return null;
        }
    }
);

export default TradingAppCardActions;
