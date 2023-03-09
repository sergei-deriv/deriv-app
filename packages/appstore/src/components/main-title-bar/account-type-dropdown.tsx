import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Dropdown } from '@deriv/components';
import { getAccountTypes } from 'Constants/platform-config';
import { useStores } from 'Stores';
import './account-type-dropdown.scss';

const AccountTypeDropdown = () => {
    const { traders_hub, client } = useStores();
    const { selected_account_type, selectAccountType } = traders_hub;
    const { setPrevAccountType, preferred_language } = client;

    const translated_account_types = React.useMemo(
        () => getAccountTypes(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [preferred_language]
    );

    return (
        <div className={classNames('account-type-dropdown--parent')}>
            <Dropdown
                classNameIcon={`account-type-dropdown__icon--${selected_account_type}`}
                value={selected_account_type}
                classNameDisplay={classNames(
                    'account-type-dropdown',
                    `account-type-dropdown--${selected_account_type}`
                )}
                list={translated_account_types}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    await selectAccountType(e.target.value);
                    await setPrevAccountType(e.target.value);
                }}
            />
        </div>
    );
};

export default observer(AccountTypeDropdown);
