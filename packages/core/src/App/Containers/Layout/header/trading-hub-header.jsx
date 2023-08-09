import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Popover, Text, Button, StaticUrl } from '@deriv/components';
import { routes, platforms, formatMoney } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { ToggleNotifications, MenuLinks } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { connect } from 'Stores/connect';
import { BinaryLink } from 'App/Components/Routes';
import DerivBrandLogo from 'Assets/SvgComponents/header/deriv-rebranding-logo.svg';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import CurrencySelectionModal from '../../CurrencySelectionModal';
import AccountInfo from 'App/Components/Layout/Header/account-info';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import {
    useActiveWallet,
    useFeatureFlags,
    useIsRealAccountNeededForCashier,
    useWalletsList,
    useWalletMigration,
} from '@deriv/hooks';

const Divider = () => {
    return <div className='trading-hub-header__divider' />;
};

export const TradersHubHomeButton = ({ is_dark_mode }) => {
    const history = useHistory();
    const { pathname } = history.location;

    return (
        <div
            className={classNames('trading-hub-header__tradershub', {
                'trading-hub-header__tradershub--active': pathname === routes.traders_hub,
            })}
            onClick={() => history.push(routes.traders_hub)}
        >
            <div className='trading-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode ? 15 : 17}
                />
            </div>
            <Text className='trading-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
};

const TradingHubOnboarding = ({
    is_dark_mode,
    is_landing_company_loaded,
    is_logged_in,
    is_switching,
    is_wallet_modal_visible,
    setIsOnboardingVisited,
    setIsWalletModalVisible,
    switchAccount,
    toggleIsWalletTourOpen,
}) => {
    const history = useHistory();

    const { data } = useWalletsList();
    const { is_wallet_enabled } = useFeatureFlags();
    const wallet_account = useActiveWallet();

    const first_loginid = data?.[0]?.loginid;

    const handleSwitchAndToggle = async () => {
        // if the modal is open, then close it and open the tour
        if (is_wallet_modal_visible) await setIsWalletModalVisible(false);
        // switch to the first account when the tour is opened
        if (wallet_account?.loginid !== first_loginid) {
            await switchAccount(first_loginid);
        }
        // open the tour
        if (!is_switching && is_logged_in && is_landing_company_loaded) {
            toggleIsWalletTourOpen(true);
        }
    };

    return (
        <div className='trading-hub-header__tradinghub--onboarding'>
            <div className='trading-hub-header__tradinghub--onboarding--logo'>
                <Popover
                    classNameBubble='account-settings-toggle__tooltip'
                    alignment='bottom'
                    message={<Localize i18n_default_text='View onboarding' />}
                    should_disable_pointer_events
                    zIndex={9999}
                >
                    <Icon
                        icon={is_dark_mode ? 'IcAppstoreTradingHubOnboardingDark' : 'IcAppstoreTradingHubOnboarding'}
                        size={20}
                        onClick={() => {
                            if (data?.length > 0 && is_wallet_enabled) {
                                handleSwitchAndToggle();
                            } else {
                                history.push(routes.onboarding);
                                setIsOnboardingVisited(false);
                            }
                        }}
                    />
                </Popover>
            </div>
        </div>
    );
};

const ShowNotifications = ({ is_notifications_visible, notifications_count, toggleNotifications }) => {
    return (
        <div className='trading-hub-header__notification'>
            <ToggleNotifications
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotifications}
                tooltip_message={<Localize i18n_default_text='View notifications' />}
            />
        </div>
    );
};

const TradingHubHeader = ({
    acc_switcher_disabled_message,
    account_type,
    balance,
    country_standpoint,
    currency,
    has_any_real_account,
    header_extension,
    is_acc_switcher_disabled,
    is_acc_switcher_on,
    is_app_disabled,
    is_dark_mode,
    is_eu_country,
    is_eu,
    is_logged_in,
    is_mt5_allowed,
    is_notifications_visible,
    is_route_modal_on,
    is_switching,
    is_virtual,
    is_wallet_modal_visible,
    loginid,
    modal_data,
    notifications_count,
    platform,
    setIsOnboardingVisited,
    setIsWalletModalVisible,
    setWalletsMigrationInProgressPopup,
    switchAccount,
    toggleAccountsDialog,
    toggleIsTourOpen,
    toggleIsWalletTourOpen,
    toggleNeedRealAccountForCashierModal,
    toggleNotifications,
    toggleReadyToDepositModal,
    is_landing_company_loaded,
}) => {
    const { pathname } = useLocation();
    const cashier_routes = pathname.startsWith(routes.cashier);
    const is_mf = loginid?.startsWith('MF');
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });
    const history = useHistory();
    const { is_in_progress } = useWalletMigration();

    const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

    const toggleModal = () => {
        if (!has_any_real_account) {
            toggleReadyToDepositModal();
        } else if (window.location.pathname === routes.traders_hub) {
            toggleNeedRealAccountForCashierModal();
        }
    };

    const handleClickCashier = () => {
        if (is_in_progress) {
            setWalletsMigrationInProgressPopup(true);
        } else if ((!has_any_real_account && is_virtual) || real_account_needed_for_cashier) {
            toggleModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    const AccountInfoComponent = React.useCallback(
        () => (
            <AccountInfo
                acc_switcher_disabled_message={acc_switcher_disabled_message}
                account_type={account_type}
                balance={formatMoney(currency, balance, true)}
                is_disabled={is_acc_switcher_disabled}
                is_eu={is_eu}
                is_virtual={is_virtual}
                currency={currency}
                country_standpoint={country_standpoint}
                is_dialog_on={is_acc_switcher_on}
                toggleDialog={toggleAccountsDialog}
            />
        ),
        [
            is_acc_switcher_on,
            is_acc_switcher_disabled,
            is_eu,
            is_virtual,
            currency,
            country_standpoint,
            toggleAccountsDialog,
            account_type,
            balance,
            acc_switcher_disabled_message,
        ]
    );

    const DefaultMobileLinks = () => (
        <React.Fragment>
            <div className='trading-hub-header__menu-right--items--onboarding'>
                <TradingHubOnboarding
                    is_dark_mode={is_dark_mode}
                    toggleIsTourOpen={toggleIsTourOpen}
                    is_mf={is_mf}
                    is_eu={is_eu}
                    is_eu_country={is_eu_country}
                    setIsOnboardingVisited={setIsOnboardingVisited}
                />
            </div>
            <div className='trading-hub-header__menu-right--items--notifications'>
                <ShowNotifications
                    is_notifications_visible={is_notifications_visible}
                    notifications_count={notifications_count}
                    toggleNotifications={toggleNotifications}
                />
            </div>
            <Popover
                classNameBubble='account-settings-toggle__tooltip'
                alignment='bottom'
                message={<Localize i18n_default_text='Manage account settings' />}
                should_disable_pointer_events
                zIndex={9999}
            >
                <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                    <Icon icon='IcUserOutline' size={20} />
                </BinaryLink>
            </Popover>
            <div className='trading-hub-header__cashier-button'>
                <Button primary small onClick={handleClickCashier} as_disabled={is_in_progress}>
                    <Localize i18n_default_text='Cashier' />
                </Button>
            </div>
        </React.Fragment>
    );

    return (
        <header
            className={classNames('trading-hub-header', {
                'trading-hub-header--is-disabled': is_app_disabled || is_route_modal_on,
                'trading-hub-header--is-hidden': platforms[platform],
            })}
        >
            <div className='trading-hub-header__menu-left'>
                <MobileWrapper>
                    <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                    {header_extension && is_logged_in && <div>{header_extension}</div>}
                </MobileWrapper>
                <div
                    className={classNames('trading-hub-header__logo-wrapper', {
                        'trading-hub-header__logo-wrapper--cashier': cashier_routes,
                    })}
                >
                    <StaticUrl href='/'>
                        <DerivBrandLogo className='trading-hub-header__logo' />
                    </StaticUrl>
                </div>
                <DesktopWrapper>
                    <Divider />
                    <TradersHubHomeButton is_dark_mode={is_dark_mode} />
                </DesktopWrapper>
                <MenuLinks is_traders_hub_routes />
            </div>
            <DesktopWrapper>
                <div className='trading-hub-header__menu-right'>
                    <Divider />
                    <div className='trading-hub-header__menu-right--items'>
                        <div className='trading-hub-header__menu-right--items--onboarding'>
                            <TradingHubOnboarding
                                is_dark_mode={is_dark_mode}
                                is_logged_in={is_logged_in}
                                is_switching={is_switching}
                                is_wallet_modal_visible={is_wallet_modal_visible}
                                setIsOnboardingVisited={setIsOnboardingVisited}
                                setIsWalletModalVisible={setIsWalletModalVisible}
                                switchAccount={switchAccount}
                                toggleIsWalletTourOpen={toggleIsWalletTourOpen}
                                is_landing_company_loaded={is_landing_company_loaded}
                            />
                        </div>
                        <div className='trading-hub-header__menu-right--items--notifications'>
                            <ShowNotifications
                                is_notifications_visible={is_notifications_visible}
                                notifications_count={notifications_count}
                                toggleNotifications={toggleNotifications}
                            />
                        </div>
                        <Popover
                            classNameBubble='account-settings-toggle__tooltip'
                            alignment='bottom'
                            message={<Localize i18n_default_text='Manage account settings' />}
                            should_disable_pointer_events
                            zIndex={9999}
                        >
                            <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                                <Icon icon='IcUserOutline' size={20} />
                            </BinaryLink>
                        </Popover>
                        {cashier_routes && (
                            <div className='trading-hub-header__menu-right--items--account-toggle'>
                                <AccountInfoComponent />
                            </div>
                        )}
                    </div>
                </div>
                <RealAccountSignup />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='trading-hub-header__mobile-parent'>
                    <div className='trading-hub-header__menu-middle'>
                        {cashier_routes ? (
                            <React.Fragment>
                                <div className='trading-hub-header__menu-right--items--notifications__cashier'>
                                    <ShowNotifications
                                        is_notifications_visible={is_notifications_visible}
                                        notifications_count={notifications_count}
                                        toggleNotifications={toggleNotifications}
                                    />
                                </div>
                                <div className='trading-hub-header__menu-right--items--account-toggle'>
                                    <AccountInfoComponent />
                                </div>
                            </React.Fragment>
                        ) : (
                            <DefaultMobileLinks />
                        )}
                    </div>
                </div>
                <RealAccountSignup />
            </MobileWrapper>
            <SetAccountCurrencyModal />
            <CurrencySelectionModal is_visible={modal_data.active_modal === 'currency_selection'} />
        </header>
    );
};

TradingHubHeader.propTypes = {
    header_extension: PropTypes.any,
    is_app_disabled: PropTypes.bool,
    is_dark_mode: PropTypes.bool,
    is_eu_country: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_settings_modal_on: PropTypes.bool,
    loginid: PropTypes.string,
    modal_data: PropTypes.object,
    notifications_count: PropTypes.number,
    platform: PropTypes.string,
    setIsOnboardingVisited: PropTypes.func,
    settings_extension: PropTypes.array,
    toggleIsTourOpen: PropTypes.func,
    toggleNotifications: PropTypes.func,
    acc_switcher_disabled_message: PropTypes.string,
    account_type: PropTypes.string,
    balance: PropTypes.string,
    currency: PropTypes.string,
    is_acc_switcher_disabled: PropTypes.bool,
    country_standpoint: PropTypes.object,
    is_acc_switcher_on: PropTypes.bool,
    is_virtual: PropTypes.bool,
    toggleAccountsDialog: PropTypes.func,
    has_any_real_account: PropTypes.bool,
    toggleReadyToDepositModal: PropTypes.func,
    toggleNeedRealAccountForCashierModal: PropTypes.func,
    is_wallet_modal_visible: PropTypes.bool,
    setIsWalletModalVisible: PropTypes.func,
    switchAccount: PropTypes.func,
    toggleIsWalletTourOpen: PropTypes.func,
    setWalletsMigrationInProgressPopup: PropTypes.func,
    is_switching: PropTypes.bool,
    is_landing_company_loaded: PropTypes.bool,
};

export default connect(({ client, common, notifications, ui, traders_hub }) => ({
    header_extension: ui.header_extension,
    is_app_disabled: ui.is_app_disabled,
    is_dark_mode: ui.is_dark_mode_on,
    is_eu_country: client.is_eu_country,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_notifications_visible: notifications.is_notifications_visible,
    is_route_modal_on: ui.is_route_modal_on,
    modal_data: traders_hub.modal_data,
    notifications_count: notifications.notifications.length,
    toggleNotifications: notifications.toggleNotificationsModal,
    loginid: client.loginid,
    platform: common.platform,
    setIsOnboardingVisited: traders_hub.setIsOnboardingVisited,
    acc_switcher_disabled_message: ui.account_switcher_disabled_message,
    account_type: client.account_type,
    balance: client.balance,
    currency: client.currency,
    country_standpoint: client.country_standpoint,
    is_acc_switcher_on: !!ui.is_accounts_switcher_on,
    is_virtual: client.is_virtual,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    toggleIsTourOpen: traders_hub.toggleIsTourOpen,
    has_any_real_account: client.has_any_real_account,
    toggleReadyToDepositModal: ui.toggleReadyToDepositModal,
    toggleNeedRealAccountForCashierModal: ui.toggleNeedRealAccountForCashierModal,
    content_flag: traders_hub.content_flag,
    is_wallet_modal_visible: ui.is_wallet_modal_visible,
    setIsWalletModalVisible: ui.setIsWalletModalVisible,
    switchAccount: client.switchAccount,
    toggleIsWalletTourOpen: traders_hub.toggleIsWalletTourOpen,
    setWalletsMigrationInProgressPopup: client.setWalletsMigrationInProgressPopup,
    is_switching: client.is_switching,
    is_landing_company_loaded: client.is_landing_company_loaded,
}))(withRouter(TradingHubHeader));
