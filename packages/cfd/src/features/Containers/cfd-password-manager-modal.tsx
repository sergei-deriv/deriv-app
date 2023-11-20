import React from 'react';
import {
    Icon,
    Modal,
    Tabs,
    Button,
    DesktopWrapper,
    Div100vhContainer,
    MobileWrapper,
    MultiStep,
    PageOverlay,
    ThemedScrollbars,
    UILoader,
    Text,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { VerifyEmailResponse } from '@deriv/api-types';
import { isMobile, validLength, validPassword, getErrorMessages, getCFDPlatformLabel } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTradingPlatformInvestorPasswordChange, useTradingPlatformPasswordChange, useVerifyEmail } from '@deriv/api';
import { FormikErrors } from 'formik';
import TradingPasswordManager from '../../Containers/trading-password-manager';
import InvestorPasswordManager from '../../Containers/investor-password-manager';
import {
    TCountdownComponent,
    TCFDPasswordReset,
    TCFDPasswordManagerTabContentWrapper,
    TCFDPasswordManagerTabContent,
    TCFDPasswordManagerModal,
    TFormValues,
    TPasswordManagerModalFormValues,
} from '../../Containers/props.types';
import { CFD_PLATFORMS, QUERY_STATUS, PASSWORD_TYPE } from '../../Helpers/cfd-config';

// Temporary type because of build failing. Confirm with Accounts team
type TSendVerifyEmail = () => Promise<VerifyEmailResponse>;

type TStatus = typeof QUERY_STATUS[keyof typeof QUERY_STATUS];

const CountdownComponent = ({ count_from = 60, onTimeout }: TCountdownComponent) => {
    const [count, setCount] = React.useState<number>(count_from);

    React.useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;

        if (count !== 0) {
            interval = setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        } else {
            onTimeout();
        }

        return () => {
            clearTimeout(interval);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);
    return <span className='countdown'>{count}</span>;
};

const CFDPasswordReset = ({
    sendVerifyEmail,
    account_type,
    account_group,
    server,
    password_type,
}: TCFDPasswordReset) => {
    const [is_resend_verification_requested, setIsResendVerificationRequested] = React.useState<boolean>(false);
    const [is_resend_verification_sent, setIsResendVerificationSent] = React.useState<boolean>(false);

    React.useEffect(() => {
        localStorage.setItem('cfd_reset_password_intent', [server, account_group, account_type].join('.'));
        localStorage.setItem('cfd_reset_password_type', password_type);
        sendVerifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickVerification = () => {
        setIsResendVerificationRequested(true);
    };

    const resendVerification = () => {
        sendVerifyEmail();
        setIsResendVerificationSent(true);
    };

    return (
        <div className='cfd-verification-email-sent'>
            <Icon icon='IcEmailSent' size={128} />
            <h2 className='cfd-verification-email-sent__title'>
                <Localize i18n_default_text="We've sent you an email" />
            </h2>
            <Text as='p' size='xs' align='center'>
                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
            </Text>
            {!is_resend_verification_requested && (
                <Button className='cfd-verification-email-sent__resend-button' primary onClick={onClickVerification}>
                    <Localize i18n_default_text="Didn't receive the email?" />
                </Button>
            )}
            {is_resend_verification_requested && (
                <>
                    <Text
                        as='p'
                        size='xs'
                        align='center'
                        weight='bold'
                        className='cfd-verification-email-sent__title--sub'
                    >
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </Text>
                    <Text as='p' size='xs' align='center'>
                        <Localize i18n_default_text="Check your spam or junk folder. If it's not there, try resending the email." />
                    </Text>
                    <Button
                        className='cfd-verification-email-sent__resend-button'
                        large
                        primary
                        disabled={is_resend_verification_sent}
                        onClick={resendVerification}
                    >
                        {!is_resend_verification_sent && <Localize i18n_default_text='Resend email' />}
                        {is_resend_verification_sent && (
                            <Localize
                                i18n_default_text='Resend in <0 /> seconds'
                                components={[
                                    <CountdownComponent
                                        key={0}
                                        onTimeout={() => setIsResendVerificationSent(false)}
                                        count_from={60}
                                    />,
                                ]}
                            />
                        )}
                    </Button>
                </>
            )}
        </div>
    );
};

const CFDPasswordManagerTabContentWrapper = ({ multi_step_ref, steps }: TCFDPasswordManagerTabContentWrapper) => (
    <MultiStep ref={multi_step_ref} steps={steps} className='cfd-password-manager' lbl_previous={localize('Back')} />
);

const CFDPasswordManagerTabContent = ({
    toggleModal,
    selected_login,
    email,
    setPasswordType,
    multi_step_ref,
    platform,
    onChangeActiveTabIndex,
    account_group,
}: TCFDPasswordManagerTabContent) => {
    const {
        mutateAsync: changePassword,
        status: change_password_status,
        error: change_password_error,
    } = useTradingPlatformPasswordChange();
    const {
        mutateAsync: changeInvestorPassword,
        status: change_investor_password_status,
        error: change_investor_password_error,
    } = useTradingPlatformInvestorPasswordChange();
    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [error_message_investor, setErrorMessageInvestor] = React.useState<string>('');
    const [is_submit_success_investor, setIsSubmitSuccessInvestor] = React.useState<boolean>(false);

    // view height - margin top and bottom of modal - modal title - modal content margin top and bottom - table title
    const container_height = 'calc(100vh - 84px - 5.6rem - 8.8rem - 4rem)';
    const validatePassword = (values: TFormValues) => {
        const errors: FormikErrors<TFormValues> = {};

        if (
            !validLength(values.new_password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.new_password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validPassword(values.new_password)) {
            errors.new_password = getErrorMessages().password();
        } else if (values.new_password.toLowerCase() === email.toLowerCase()) {
            errors.new_password = localize('Your password cannot be the same as your email address.');
        }

        if (!values.old_password && values.old_password !== undefined) {
            errors.old_password = localize('This field is required');
        }

        return errors;
    };
    const showError = (error_message: string) => {
        setErrorMessageInvestor(error_message);
    };

    const hideError = () => {
        setErrorMessageInvestor('');
        setIsSubmitSuccessInvestor(true);
    };

    const handlePasswordErrorMessages = React.useCallback((status: TStatus, error: Error) => {
        if (status === QUERY_STATUS.ERROR && error) {
            showError((error as unknown as Error)?.message);
        }
        if (status === QUERY_STATUS.SUCCESS) {
            hideError();
        }
    }, []);

    React.useEffect(() => {
        handlePasswordErrorMessages(change_password_status, change_password_error as unknown as Error);
    }, [change_password_error, change_password_status, handlePasswordErrorMessages]);

    React.useEffect(() => {
        handlePasswordErrorMessages(
            change_investor_password_status,
            change_investor_password_error as unknown as Error
        );
    }, [change_investor_password_error, change_investor_password_status, handlePasswordErrorMessages]);

    const onSubmit = React.useCallback(
        async (values: TPasswordManagerModalFormValues) => {
            if (!selected_login) {
                return;
            }

            if (values.password_type === PASSWORD_TYPE.INVESTOR) {
                await changeInvestorPassword({
                    account_id: selected_login,
                    old_password: values.old_password,
                    new_password: values.new_password,
                    platform: CFD_PLATFORMS.MT5,
                });
            } else {
                await changePassword({
                    old_password: values.old_password,
                    new_password: values.new_password,
                    platform: CFD_PLATFORMS.MT5,
                });
            }
        },
        [changeInvestorPassword, changePassword, selected_login]
    );

    const updateAccountTabIndex = (index: number) => {
        setActiveTabIndex(index);
        onChangeActiveTabIndex(index);
        setErrorMessageInvestor('');
        setIsSubmitSuccessInvestor(false);
    };

    const trading_password_manager = (
        <React.Fragment>
            <DesktopWrapper>
                <ThemedScrollbars height={container_height} is_bypassed={isMobile()} autohide={false}>
                    <TradingPasswordManager
                        toggleModal={toggleModal}
                        platform={platform}
                        email={email}
                        account_group={account_group}
                    />
                </ThemedScrollbars>
            </DesktopWrapper>
            <MobileWrapper>
                <Div100vhContainer className='cfd-password-manager__scroll-wrapper' height_offset='120px'>
                    <TradingPasswordManager
                        toggleModal={toggleModal}
                        platform={platform}
                        email={email}
                        account_group={account_group}
                    />
                </Div100vhContainer>
            </MobileWrapper>
        </React.Fragment>
    );

    if (platform === CFD_PLATFORMS.DXTRADE) return trading_password_manager;

    return (
        <Tabs active_index={active_tab_index} onTabItemClick={updateAccountTabIndex} top>
            <div
                label={localize('{{platform}} password', {
                    platform: getCFDPlatformLabel(platform),
                })}
            >
                {trading_password_manager}
            </div>
            <div label={localize('Investor password')}>
                <DesktopWrapper>
                    <ThemedScrollbars height={container_height}>
                        <InvestorPasswordManager
                            is_submit_success_investor={is_submit_success_investor}
                            toggleModal={toggleModal}
                            error_message_investor={error_message_investor}
                            validatePassword={validatePassword}
                            onSubmit={onSubmit}
                            setPasswordType={setPasswordType}
                            multi_step_ref={multi_step_ref}
                        />
                    </ThemedScrollbars>
                </DesktopWrapper>
                <MobileWrapper>
                    <Div100vhContainer className='cfd-password-manager__scroll-wrapper' height_offset='120px'>
                        <InvestorPasswordManager
                            is_submit_success_investor={is_submit_success_investor}
                            toggleModal={toggleModal}
                            error_message_investor={error_message_investor}
                            validatePassword={validatePassword}
                            onSubmit={onSubmit}
                            setPasswordType={setPasswordType}
                            multi_step_ref={multi_step_ref}
                        />
                    </Div100vhContainer>
                </MobileWrapper>
            </div>
        </Tabs>
    );
};

const CFDPasswordManagerModal = observer(
    ({
        is_visible,
        platform,
        selected_login,
        toggleModal,
        selected_account_type,
        selected_account_group,
        selected_server,
    }: TCFDPasswordManagerModal) => {
        const { client, ui } = useStore();

        const { email } = client;
        const { enableApp, disableApp } = ui;

        const { mutate } = useVerifyEmail();

        const sendVerifyEmail = () => mutate({ verify_email: email, type: 'trading_platform_investor_password_reset' });

        const multi_step_ref: React.MutableRefObject<undefined> = React.useRef();
        const [index, setIndex] = React.useState<number>(0);

        const [password_type, setPasswordType] = React.useState('main');

        if (!selected_login) return null;

        const getTitle = () => {
            return localize('Manage {{platform}} password', {
                platform: getCFDPlatformLabel(platform),
            });
        };

        const getHeader = (i: number) => {
            if (i === 0) {
                return localize('Manage {{platform}} password', {
                    platform: getCFDPlatformLabel(platform),
                });
            }
            return localize('Manage password');
        };

        const onChangeActiveTabIndex = (i: number) => {
            setIndex(i);
        };

        const steps = [
            {
                component: (
                    <CFDPasswordManagerTabContent
                        email={email}
                        selected_login={selected_login}
                        toggleModal={toggleModal}
                        setPasswordType={setPasswordType}
                        multi_step_ref={multi_step_ref}
                        platform={platform}
                        onChangeActiveTabIndex={onChangeActiveTabIndex}
                        account_group={selected_account_group}
                    />
                ),
            },
            {
                component: (
                    <CFDPasswordReset
                        server={selected_server}
                        sendVerifyEmail={sendVerifyEmail as unknown as TSendVerifyEmail}
                        account_type={selected_account_type}
                        account_group={selected_account_group}
                        password_type={password_type}
                    />
                ),
            },
        ];

        return (
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='cfd-password-manager__modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_open={is_visible}
                        title={getTitle()}
                        toggleModal={toggleModal}
                        height='688px'
                        width='904px'
                        should_header_stick_body={false}
                    >
                        <CFDPasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <PageOverlay
                        is_open={is_visible}
                        portal_id='deriv_app'
                        header={getHeader(index)}
                        onClickClose={toggleModal}
                    >
                        <CFDPasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                    </PageOverlay>
                </MobileWrapper>
            </React.Suspense>
        );
    }
);

export default CFDPasswordManagerModal;
