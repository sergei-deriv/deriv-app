import React from 'react';
import { useHistory } from 'react-router';
import { FormikErrors } from 'formik';
import { SentEmailModal } from '@deriv/account';
import { MobileDialog, Modal, WalletAppCard, WalletSuccessDialog } from '@deriv/components';
import {
    CFD_PLATFORMS,
    getAuthenticationStatusInfo,
    getErrorMessages,
    Jurisdiction,
    routes,
    validLength,
    validPassword,
    WS,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { useActiveWalletAccount, useFeatureFlags, useWalletMigration } from '@deriv/hooks';
import CFDPasswordForm from './cfd-password-form/cfd-password-form';
import PasswordModalHeader from './modal-elements/password-modal-header';
import PasswordModalMessage from './modal-elements/password-modal-message';
import SuccessDialog from '../../Components/success-dialog.jsx';
import SuccessModalIcons from './modal-elements/success-modal-icons';
import { ACCOUNT_CATEGORY, PASSWORD_ERRORS, getWalletCFDInfo } from '../../Constants/cfd-password-modal-constants';
import { getWalletSuccessText } from '../../Constants/wallet-success-text';
import { useInvalidateQuery } from '@deriv/api';
import { TCFDPasswordFormValues, TOnSubmitPassword } from '../props.types';
import '../../sass/cfd.scss';

type TCFDPasswordModalProps = {
    error_type?: string;
    form_error?: string;
    platform: string;
};

const CFDPasswordModal = observer(({ form_error, platform }: TCFDPasswordModalProps) => {
    const { client, traders_hub, ui, common } = useStore();

    const {
        account_status,
        email,
        is_dxtrade_allowed,
        is_logged_in,
        landing_companies,
        mt5_login_list,
        updateAccountStatus,
        dxtrade_accounts_list,
    } = client;
    const { show_eu_related_content } = traders_hub;
    const { is_mobile, is_dark_mode_on } = ui;

    const {
        account_title,
        account_type,
        disableCFDPasswordModal,
        error_message,
        error_type,
        getAccountStatus,
        has_cfd_error,
        is_cfd_password_modal_enabled,
        is_cfd_success_dialog_enabled,
        jurisdiction_selected_shortcode,
        new_account_response,
        setCFDSuccessDialog,
        setError,
        submitCFDPassword,
        submitMt5Password,
        setAccountType,
        setJurisdictionSelectedShortcode,
    } = useCfdStore();

    const { setAppstorePlatform } = common;

    const history = useHistory();
    const { is_wallet_enabled } = useFeatureFlags();
    const { is_migrated } = useWalletMigration();
    const active_wallet = useActiveWalletAccount();
    const invalidate = useInvalidateQuery();

    const [is_password_modal_exited, setPasswordModalExited] = React.useState(true);
    const is_bvi = landing_companies?.mt_financial_company?.financial_stp?.shortcode === 'bvi';
    const has_mt5_account = Boolean(mt5_login_list?.length);
    const has_dxtrade_account = Boolean(dxtrade_accounts_list?.length);
    const should_set_trading_password =
        Array.isArray(account_status?.status) &&
        account_status.status.includes(
            platform === CFD_PLATFORMS.MT5 ? 'mt5_password_not_set' : 'dxtrade_password_not_set'
        );
    const is_password_error = error_type === PASSWORD_ERRORS.ERROR;
    const is_password_reset = error_type === PASSWORD_ERRORS.RESET;
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);
    const theme = is_dark_mode_on ? 'dark' : 'light';

    const getBalance = (market_type: string) => {
        if (platform === CFD_PLATFORMS.MT5 && has_mt5_account) {
            return mt5_login_list.find(item => item.market_type === market_type)?.display_balance;
        }
        if (platform === CFD_PLATFORMS.DXTRADE && has_dxtrade_account) {
            return dxtrade_accounts_list.find(item => item.account_type === account_type.category)?.display_balance;
        }
    };

    const { poi_verified_for_bvi_labuan_vanuatu, poi_verified_for_maltainvest, poa_verified, manual_status } =
        getAuthenticationStatusInfo(account_status);

    const [is_selected_mt5_verified, setIsSelectedMT5Verified] = React.useState(false);

    const getVerificationStatus = () => {
        switch (jurisdiction_selected_shortcode) {
            case Jurisdiction.SVG:
                setIsSelectedMT5Verified(true);
                break;
            case Jurisdiction.BVI:
            case Jurisdiction.VANUATU:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu);
                break;
            case Jurisdiction.LABUAN:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu && poa_verified);
                break;
            case Jurisdiction.MALTA_INVEST:
                setIsSelectedMT5Verified(poi_verified_for_maltainvest && poa_verified);
                break;
            default:
        }
    };

    React.useEffect(() => {
        if (is_logged_in) {
            updateAccountStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        getVerificationStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jurisdiction_selected_shortcode, account_status]);

    const validatePassword = (values: TCFDPasswordFormValues) => {
        const errors: FormikErrors<TCFDPasswordFormValues> = {};
        if (
            !validLength(values.password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        }
        if (values.password?.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }
        return errors;
    };

    const closeDialogs = () => {
        setCFDSuccessDialog(false);
        setError(false);
    };

    const closeModal = () => {
        invalidate('mt5_login_list');
        closeDialogs();
        disableCFDPasswordModal();
    };

    const closeOpenSuccess = () => {
        disableCFDPasswordModal();
        closeDialogs();
        if (account_type.category === ACCOUNT_CATEGORY.REAL) {
            sessionStorage.setItem('cfd_transfer_to_login_id', new_account_response.login || '');
            history.push(routes.cashier_acc_transfer);
        }
        invalidate('mt5_login_list');
    };

    const handleForgotPassword = () => {
        closeModal();
        let redirect_to = platform === CFD_PLATFORMS.MT5 ? 1 : 2;

        // if account type is real convert redirect_to from 1 or 2 to 10 or 20
        // and if account type is demo convert redirect_to from 1 or 2 to 11 or 21
        if (account_type.category === ACCOUNT_CATEGORY.REAL) {
            redirect_to = Number(`${redirect_to}0`);
        } else if (account_type.category === ACCOUNT_CATEGORY.DEMO) {
            redirect_to = Number(`${redirect_to}1`);
        }

        const password_reset_code =
            platform === CFD_PLATFORMS.MT5
                ? 'trading_platform_mt5_password_reset'
                : 'trading_platform_dxtrade_password_reset';
        WS.verifyEmail(email, password_reset_code, {
            url_parameters: {
                redirect_to,
            },
        });
        setIsSentEmailModalOpen(true);
    };

    const submitPassword: TOnSubmitPassword = (values, actions) => {
        if (platform === CFD_PLATFORMS.MT5) {
            submitMt5Password(
                {
                    ...values,
                },
                actions
            );
        } else {
            (values as TCFDPasswordFormValues & { platform: string }).platform = platform;
            submitCFDPassword(values, actions);
        }
    };

    const balance = (
        <Localize
            i18n_default_text='{{display_balance}} {{currency}}'
            values={{ display_balance: getBalance(account_type.type), currency: active_wallet?.currency }}
        />
    );

    const card_label = active_wallet?.is_virtual ? (
        <Localize i18n_default_text='Demo' />
    ) : (
        <Localize i18n_default_text='Real' />
    );

    const should_show_password =
        is_cfd_password_modal_enabled &&
        !is_cfd_success_dialog_enabled &&
        (!has_cfd_error || is_password_error || is_password_reset);

    const should_show_success =
        !has_cfd_error && is_cfd_success_dialog_enabled && is_cfd_password_modal_enabled && is_password_modal_exited;

    const should_show_success_for_wallets =
        !has_cfd_error &&
        is_cfd_success_dialog_enabled &&
        is_cfd_password_modal_enabled &&
        is_password_modal_exited &&
        balance;

    const should_show_sent_email_modal = is_sent_email_modal_open && is_password_modal_exited;

    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';

    const should_show_password_modal = React.useMemo(() => {
        if (should_show_password) {
            return should_set_trading_password ? true : !is_mobile;
        }
        return false;
    }, [is_mobile, should_set_trading_password, should_show_password]);

    const should_show_password_dialog = React.useMemo(() => {
        if (should_show_password) {
            if (!should_set_trading_password) return is_mobile;
        }
        return false;
    }, [is_mobile, should_set_trading_password, should_show_password]);

    const success_modal_submit_label = React.useMemo(() => {
        if (account_type.category === ACCOUNT_CATEGORY.REAL) {
            if (platform === CFD_PLATFORMS.MT5) {
                return is_selected_mt5_verified ? localize('Transfer now') : localize('OK');
            }
            return localize('Transfer now');
        }
        return localize('Continue');
    }, [platform, account_type, is_selected_mt5_verified]);

    const cfd_password_form = (
        <CFDPasswordForm
            is_bvi={is_bvi}
            account_title={account_title}
            account_type={account_type}
            closeModal={closeModal}
            error_type={error_type}
            error_message={error_message}
            has_mt5_account={has_mt5_account}
            form_error={form_error}
            jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
            should_set_trading_password={should_set_trading_password}
            is_real_financial_stp={is_real_financial_stp}
            validatePassword={validatePassword}
            onForgotPassword={handleForgotPassword}
            submitPassword={submitPassword}
            platform={platform}
            is_dxtrade_allowed={is_dxtrade_allowed}
            onCancel={closeModal}
            show_eu_related_content={show_eu_related_content}
        />
    );

    const password_modal = (
        <Modal
            className='cfd-password-modal'
            has_close_icon
            is_open={should_show_password_modal}
            toggleModal={closeModal}
            should_header_stick_body
            renderTitle={() => (
                <PasswordModalHeader
                    should_set_trading_password={should_set_trading_password}
                    is_password_reset_error={is_password_reset}
                    platform={platform}
                />
            )}
            onUnmount={() => getAccountStatus(platform)}
            onExited={() => setPasswordModalExited(true)}
            onEntered={() => setPasswordModalExited(false)}
            width={is_mobile ? '32.8rem' : 'auto'}
        >
            {cfd_password_form}
        </Modal>
    );

    const password_dialog = (
        <MobileDialog
            has_full_height
            portal_element_id='modal_root'
            visible={should_show_password_dialog}
            onClose={closeModal}
            wrapper_classname='cfd-password-modal'
        >
            <PasswordModalHeader
                should_set_trading_password={should_set_trading_password}
                is_password_reset_error={is_password_reset}
                platform={platform}
            />

            {cfd_password_form}
        </MobileDialog>
    );

    const walletCFDInfo = getWalletCFDInfo(
        account_type.type,
        account_type.category === ACCOUNT_CATEGORY.DEMO,
        platform,
        jurisdiction_selected_shortcode
    );

    const wallet_details = {
        balance,
        account_title: walletCFDInfo.card_title,
        gradient_card_class: active_wallet?.gradients.card[theme],
        icon: active_wallet?.icons[theme],
        is_demo: active_wallet?.is_virtual,
        currency_title: (
            <Localize
                i18n_default_text='{{currency}} Wallet'
                values={{
                    currency: active_wallet?.currency,
                }}
            />
        ),
        app_icon: walletCFDInfo.icon,
        label: card_label,
    };

    const wallet_success_text = getWalletSuccessText(
        Boolean(active_wallet?.is_virtual),
        walletCFDInfo.title,
        walletCFDInfo.description_title,
        account_type.type as 'all' | 'synthetic' | 'financial',
        is_selected_mt5_verified,
        manual_status,
        jurisdiction_selected_shortcode,
        platform,
        active_wallet?.currency
    );

    // console.log(
    //     'We are here, platform = ',
    //     platform,
    //     ', account_type?.type = ',
    //     account_type?.type,
    //     ', account_type?.category = ',
    //     account_type?.category,
    //     ', jurisdiction_selected_shortcode = ',
    //     jurisdiction_selected_shortcode,
    //     ', is_selected_mt5_verified = ',
    //     is_selected_mt5_verified,
    //     // ', account_status = ',
    //     // account_status
    //     ', dxtrade_accounts_list = ',
    //     dxtrade_accounts_list,
    //     ', mt5_login_list = ',
    //     mt5_login_list
    // );

    // const updateData = () => {
    //     setAppstorePlatform(CFD_PLATFORMS.MT5);
    //     setAccountType({ category: 'real', type: 'all' });
    //     setJurisdictionSelectedShortcode(Jurisdiction.MALTA_INVEST);
    // };

    // return (
    //     <WalletSuccessDialog
    //         description={wallet_success_text.description}
    //         has_cancel={Boolean(wallet_success_text.text_cancel)}
    //         is_open={should_show_success_for_wallets}
    //         onSubmit={closeModal}
    //         text_submit={wallet_success_text.text_submit}
    //         text_cancel={wallet_success_text?.text_cancel}
    //         onCancel={closeModal}
    //         title={wallet_success_text.title}
    //         toggleModal={updateData}
    //         wallet_card={<WalletAppCard wallet={wallet_details} />}
    //     />
    // );

    return (
        <React.Fragment>
            {password_modal}
            {password_dialog}
            {/* TODO: Remove this once development is completed */}
            {is_wallet_enabled && is_migrated ? (
                <WalletSuccessDialog
                    description={wallet_success_text.description}
                    has_cancel={Boolean(wallet_success_text.text_cancel)}
                    is_open={should_show_success_for_wallets}
                    onSubmit={closeModal}
                    text_submit={wallet_success_text.text_submit}
                    text_cancel={wallet_success_text?.text_cancel}
                    onCancel={closeModal}
                    title={wallet_success_text.title}
                    toggleModal={closeModal}
                    wallet_card={<WalletAppCard wallet={wallet_details} />}
                />
            ) : (
                <SuccessDialog
                    is_open={should_show_success}
                    toggleModal={closeModal}
                    onCancel={closeModal}
                    onSubmit={
                        platform === CFD_PLATFORMS.MT5 && !is_selected_mt5_verified ? closeModal : closeOpenSuccess
                    }
                    classNameMessage='cfd-password-modal__message'
                    message={
                        <PasswordModalMessage
                            category={account_type.category}
                            is_selected_mt5_verified={is_selected_mt5_verified}
                            jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                            manual_status={manual_status}
                            platform={platform}
                            show_eu_related_content={show_eu_related_content}
                            type={account_type.type}
                            is_wallet_enabled={is_wallet_enabled}
                            wallet_account_title={walletCFDInfo.description_title}
                        />
                    }
                    icon={
                        <SuccessModalIcons
                            platform={platform}
                            type={account_type.type}
                            show_eu_related_content={show_eu_related_content}
                        />
                    }
                    icon_size='xlarge'
                    text_submit={success_modal_submit_label}
                    has_cancel={
                        platform === CFD_PLATFORMS.MT5
                            ? is_selected_mt5_verified && account_type.category === ACCOUNT_CATEGORY.REAL
                            : account_type.category === ACCOUNT_CATEGORY.REAL
                    }
                    has_close_icon={false}
                    width={is_mobile ? '32.8rem' : 'auto'}
                    is_medium_button={is_mobile}
                />
            )}
            <SentEmailModal
                is_open={should_show_sent_email_modal}
                identifier_title='trading_password'
                onClose={() => setIsSentEmailModalOpen(false)}
                onClickSendEmail={handleForgotPassword}
            />
        </React.Fragment>
    );
});

export default CFDPasswordModal;
