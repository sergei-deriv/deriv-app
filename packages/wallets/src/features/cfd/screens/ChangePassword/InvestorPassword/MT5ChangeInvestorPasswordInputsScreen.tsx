import React from 'react';
import { Formik } from 'formik';
import { useTradingPlatformInvestorPasswordChange } from '@deriv/api';
import { WalletButton, WalletPasswordField, WalletsActionScreen, WalletText } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useDevice from '../../../../../hooks/useDevice';
import { validPassword } from '../../../../../utils/passwordUtils';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

type TProps = {
    sendEmail?: VoidFunction;
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordInputsScreen: React.FC<TProps> = ({ sendEmail, setNextScreen }) => {
    const { isMobile } = useDevice();
    const { getModalState } = useModal();
    const mt5AccountId = getModalState('accountId') || '';

    const {
        error: changeInvestorPasswordError,
        mutateAsync: changeInvestorPassword,
        status: changeInvestorPasswordStatus,
    } = useTradingPlatformInvestorPasswordChange();

    const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };

    const onChangeButtonClickHandler = async (values: TFormInitialValues) => {
        await changeInvestorPassword({
            account_id: mt5AccountId,
            new_password: values.newPassword,
            old_password: values.currentPassword,
            platform: 'mt5',
        });
        setNextScreen?.();
    };

    return (
        <div className='wallets-change-password__content'>
            <WalletsActionScreen
                description={
                    <>
                        <WalletText size='sm'>
                            Use this password to grant viewing access to another user. While they may view your trading
                            account, they will not be able to trade or take any other actions.
                        </WalletText>
                        <WalletText size='sm'>
                            If this is the first time you try to create a password, or you have forgotten your password,
                            please reset it.
                        </WalletText>
                        {changeInvestorPasswordError && (
                            <WalletText align='center' color='error' size='sm'>
                                {changeInvestorPasswordError?.error?.message}
                            </WalletText>
                        )}
                    </>
                }
                descriptionSize='sm'
                renderButtons={() => (
                    <Formik initialValues={initialValues} onSubmit={onChangeButtonClickHandler}>
                        {({ handleChange, handleSubmit, values }) => (
                            <form className='wallets-change-password__investor-password' onSubmit={handleSubmit}>
                                <div className='wallets-change-password__investor-password-fields'>
                                    <WalletPasswordField
                                        autoComplete='current-password'
                                        label='Current investor password'
                                        name='currentPassword'
                                        onChange={handleChange}
                                        password={values.currentPassword}
                                    />
                                    <WalletPasswordField
                                        autoComplete='new-password'
                                        label='New investor password'
                                        name='newPassword'
                                        onChange={handleChange}
                                        password={values.newPassword}
                                    />
                                    <input autoComplete='username' hidden name='username' type='text' />
                                </div>
                                <div className='wallets-change-password__investor-password-buttons'>
                                    <WalletButton
                                        disabled={
                                            !validPassword(values.currentPassword) || !validPassword(values.newPassword)
                                        }
                                        isLoading={changeInvestorPasswordStatus === 'loading'}
                                        size={isMobile ? 'lg' : 'md'}
                                        text='Change investor password'
                                        type='submit'
                                    />
                                    <WalletButton
                                        onClick={sendEmail}
                                        size={isMobile ? 'lg' : 'md'}
                                        text='Create or reset investor password'
                                        variant='ghost'
                                    />
                                </div>
                            </form>
                        )}
                    </Formik>
                )}
            />
        </div>
    );
};

export default MT5ChangeInvestorPasswordInputsScreen;
