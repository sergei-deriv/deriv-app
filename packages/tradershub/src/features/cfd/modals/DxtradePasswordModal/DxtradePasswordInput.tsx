import React from 'react';
import { ActionScreen } from '@/components';
import { useCFDContext } from '@/providers';
import { useAccountStatus } from '@deriv/api-v2';
import useDxtradeAccountHandler from '../../../../hooks/useDxtradeAccountHandler';
import { QueryStatus } from '../../constants';
import { CreatePassword, EnterPassword } from '../../screens';
import DxtradeSuccessModal from './DxtradeSuccessModal';

type TDxtradePasswordInputProps = {
    password: string;
    setPassword: (password: string) => void;
};

const DxtradePasswordInput = ({ password, setPassword }: TDxtradePasswordInputProps) => {
    const { data: accountStatus } = useAccountStatus();
    const { cfdState } = useCFDContext();

    const { platform } = cfdState;

    const isDxtradePasswordNotSet = accountStatus?.is_dxtrade_password_not_set;
    const { createDxtradeAccountError, createOtherCFDAccountSuccess } = useDxtradeAccountHandler();

    if (!platform || (status === QueryStatus.ERROR && createDxtradeAccountError?.error?.code !== 'PasswordError')) {
        return (
            <ActionScreen
                description={createDxtradeAccountError?.error.message}
                title={createDxtradeAccountError?.error?.code}
            />
        );
    }

    if (createOtherCFDAccountSuccess) return <DxtradeSuccessModal />;

    if (isDxtradePasswordNotSet) {
        return <CreatePassword onPasswordChange={e => setPassword(e.target.value)} password={password} />;
    }

    return <EnterPassword onPasswordChange={e => setPassword(e.target.value)} password={password} />;
};

export default DxtradePasswordInput;
