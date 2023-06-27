import merge from 'lodash.merge';
import type { TStores } from '../types';

const mock = (): TStores & { is_mock: boolean } => {
    return {
        is_mock: true,
        client: {
            fetchResidenceList: jest.fn(),
            fetchStatesList: jest.fn(),
            getChangeableFields: jest.fn(),
            residence_list: [
                {
                    text: 'Text',
                    value: 'value',
                },
            ],
            states_list: [
                {
                    text: 'Text',
                    value: 'value',
                },
            ],
            account_settings: {},
            accounts: {},
            is_social_signup: false,
            active_account_landing_company: '',
            trading_platform_available_accounts: [],
            account_limits: {
                account_balance: 300000,
                daily_transfers: {
                    dxtrade: {
                        allowed: 0,
                        available: 0,
                    },
                    internal: {
                        allowed: 0,
                        available: 0,
                    },
                    mt5: {
                        allowed: 0,
                        available: 0,
                    },
                },
                lifetime_limit: 13907.43,
                market_specific: {
                    commodities: [
                        {
                            name: 'Commodities',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                    ],
                    cryptocurrency: [
                        {
                            name: 'Cryptocurrencies',
                            payout_limit: 100.0,
                            profile_name: 'extreme_risk',
                            turnover_limit: 1000.0,
                        },
                    ],
                    forex: [
                        {
                            name: 'Smart FX',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                        {
                            name: 'Major Pairs',
                            payout_limit: 20000,
                            profile_name: 'medium_risk',
                            turnover_limit: 100000,
                        },
                        {
                            name: 'Minor Pairs',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                    ],
                    indices: [
                        {
                            name: 'Stock Indices',
                            payout_limit: 20000,
                            profile_name: 'medium_risk',
                            turnover_limit: 100000,
                        },
                    ],
                    synthetic_index: [
                        {
                            name: 'Synthetic Indices',
                            payout_limit: 50000,
                            profile_name: 'low_risk',
                            turnover_limit: 500000,
                        },
                    ],
                },
                num_of_days: 30,
                num_of_days_limit: 13907.43,
                open_positions: 100,
                payout: 50000,
                remainder: 13907.43,
                withdrawal_for_x_days_monetary: 0,
                withdrawal_since_inception_monetary: 0,
            },
            account_status: {
                authentication: {
                    attempts: {
                        count: 1,
                        history: [
                            {
                                country_code: 'id',
                                id: '8919',
                                service: 'manual',
                                status: 'verified',
                                timestamp: 1674633681,
                            },
                        ],
                        latest: {
                            country_code: 'id',
                            id: '8919',
                            service: 'manual',
                            status: 'verified',
                            timestamp: 1674633681,
                        },
                    },
                    document: {
                        status: 'verified',
                    },

                    identity: {
                        services: {
                            idv: {
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'verified',
                            },
                            onfido: {
                                country_code: 'IDN',
                                documents_supported: [
                                    'Driving Licence',
                                    'National Identity Card',
                                    'Passport',
                                    'Residence Permit',
                                ],
                                is_country_supported: 1,
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'verified',
                    },
                    income: {
                        status: 'none',
                    },
                    needs_verification: [],
                    ownership: {
                        requests: [],
                        status: 'none',
                    },
                },
                currency_config: {
                    USD: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                p2p_status: 'none',
                prompt_client_to_authenticate: 0,
                risk_classification: 'low',
                status: [
                    'age_verification',
                    'allow_document_upload',
                    'authenticated',
                    'dxtrade_password_not_set',
                    'financial_information_not_complete',
                    'idv_disallowed',
                    'mt5_password_not_set',
                    'trading_experience_not_complete',
                ],
            },
            balance: '',
            can_change_fiat_currency: false,
            currency: '',
            current_currency_type: '',
            current_fiat_currency: '',
            cfd_score: 0,
            setCFDScore: jest.fn(),
            getLimits: jest.fn(() => Promise.resolve({ get_limits: {} })),
            has_any_real_account: false,
            has_active_real_account: false,
            has_logged_out: false,
            has_maltainvest_account: false,
            initialized_broadcast: false,
            is_account_setting_loaded: false,
            is_authorize: false,
            is_deposit_lock: false,
            is_dxtrade_allowed: false,
            is_eu: false,
            is_eu_country: false,
            is_uk: false,
            has_residence: false,
            is_fully_authenticated: false,
            is_financial_account: false,
            is_financial_information_incomplete: false,
            is_low_risk: false,
            is_identity_verification_needed: false,
            is_landing_company_loaded: false,
            is_logged_in: false,
            is_logging_in: false,
            is_pending_proof_of_ownership: false,
            is_switching: false,
            is_tnc_needed: false,
            is_high_risk: false,
            is_trading_experience_incomplete: false,
            is_virtual: false,
            is_withdrawal_lock: false,
            is_populating_account_list: false,
            landing_company_shortcode: '',
            local_currency_config: {
                currency: '',
                decimal_places: 0,
            },
            loginid: '',
            pre_switch_broadcast: false,
            residence: '',
            responseMt5LoginList: jest.fn(),
            responseTradingPlatformAccountsList: jest.fn(),
            standpoint: {
                iom: '',
                svg: '',
                malta: '',
                maltainvest: '',
                gaming_company: '',
                financial_company: '',
            },
            switchAccount: jest.fn(),
            verification_code: {
                payment_agent_withdraw: '',
                payment_withdraw: '',
                request_email: '',
                reset_password: '',
                signup: '',
                system_email_change: '',
                trading_platform_dxtrade_password_reset: '',
                trading_platform_mt5_password_reset: '',
            },
            email: '',
            setVerificationCode: jest.fn(),
            updateAccountStatus: jest.fn(),
            is_authentication_needed: false,
            authentication_status: {
                document_status: '',
                identity_status: '',
            },
            mt5_login_list: [],
            logout: jest.fn(),
            should_allow_authentication: false,
            active_accounts: [],
            account_list: [],
            available_crypto_currencies: [],
            setAccountStatus: jest.fn(),
            setBalanceOtherAccounts: jest.fn(),
            setInitialized: jest.fn(),
            setLogout: jest.fn(),
            setVisibilityRealityCheck: jest.fn(),
            setP2pAdvertiserInfo: jest.fn(),
            setPreSwitchAccount: jest.fn(),
            switched: false,
            switch_broadcast: false,
            switchEndSignal: jest.fn(),
            is_crypto: jest.fn(),
            dxtrade_accounts_list: [],
            derivez_accounts_list: [],
            default_currency: 'USD',
            resetVirtualBalance: jest.fn(),
            has_enabled_two_fa: false,
            setTwoFAStatus: jest.fn(),
            has_changed_two_fa: false,
            setTwoFAChangedStatus: jest.fn(),
            real_account_creation_unlock_date: 0,
            setPrevAccountType: jest.fn(),
        },
        common: {
            error: {
                app_routing_history: [],
                header: '',
                message: '',
                type: '',
                redirect_label: '',
                redirect_to: '',
                should_clear_error_on_click: false,
                should_show_refresh: false,
                redirectOnClick: jest.fn(),
                setError: jest.fn(),
            },
            current_language: 'EN',
            isCurrentLanguage: jest.fn(),
            is_from_derivgo: false,
            has_error: false,
            platform: '',
            routeBackInApp: jest.fn(),
            routeTo: jest.fn(),
            changeCurrentLanguage: jest.fn(),
            changeSelectedLanguage: jest.fn(),
            is_network_online: false,
            server_time: undefined,
            is_language_changing: false,
        },
        ui: {
            app_contents_scroll_ref: {
                current: null,
            },
            current_focus: null,
            is_cashier_visible: false,
            is_wallet_modal_visible: false,
            is_closing_create_real_account_modal: false,
            is_dark_mode_on: false,
            is_language_settings_modal_on: false,
            is_mobile: false,
            is_reports_visible: false,
            disableApp: jest.fn(),
            enableApp: jest.fn(),
            setCurrentFocus: jest.fn(),
            toggleAccountsDialog: jest.fn(),
            toggleCashier: jest.fn(),
            setDarkMode: jest.fn(),
            setReportsTabIndex: jest.fn(),
            has_real_account_signup_ended: false,
            notification_messages_ui: null,
            openRealAccountSignup: jest.fn(),
            setIsWalletModalVisible: jest.fn(),
            setIsClosingCreateRealAccountModal: jest.fn(),
            setRealAccountSignupEnd: jest.fn(),
            shouldNavigateAfterChooseCrypto: jest.fn(),
            toggleLanguageSettingsModal: jest.fn(),
            toggleSetCurrencyModal: jest.fn(),
            addToast: jest.fn(),
            removeToast: jest.fn(),
            reports_route_tab_index: 1,
            should_show_cancellation_warning: false,
            toggleCancellationWarning: jest.fn(),
            toggleUnsupportedContractModal: jest.fn(),
            toggleReports: jest.fn(),
            setSubSectionIndex: jest.fn(),
            sub_section_index: 0,
            toggleShouldShowRealAccountsList: jest.fn(),
            toggleReadyToDepositModal: jest.fn(),
            is_tablet: false,
            is_ready_to_deposit_modal_visible: false,
            is_real_acc_signup_on: false,
            is_need_real_account_for_cashier_modal_visible: false,
            toggleNeedRealAccountForCashierModal: jest.fn(),
            populateHeaderExtensions: jest.fn(),
            populateSettingsExtensions: jest.fn(),
            setShouldShowCooldownModal: jest.fn(),
        },
        traders_hub: {
            closeModal: jest.fn(),
            combined_cfd_mt5_accounts: [],
            content_flag: '',
            CFDs_restricted_countries: false,
            openModal: jest.fn(),
            selected_account: {
                login: '',
                account_id: '',
            },
            is_eu_user: false,
            is_demo: false,
            is_real: false,
            selectRegion: jest.fn(),
            setSelectedAccount: jest.fn(),
            is_low_risk_cr_eu_real: false,
            is_real_wallets_upgrade_on: false,
            toggleWalletsUpgrade: jest.fn(),
            toggleRegulatorsCompareModal: jest.fn(),
            financial_restricted_countries: false,
            selected_account_type: 'real',
            no_CR_account: false,
            no_MF_account: false,
            multipliers_account_status: '',
            openFailedVerificationModal: jest.fn(),
            setTogglePlatformType: jest.fn(),
            toggleAccountTransferModal: jest.fn(),
            selectAccountType: jest.fn(),
            is_wallet_migration_failed: false,
            setWalletsMigrationFailedPopup: jest.fn(),
            is_tour_open: false,
            selected_platform_type: '',
            available_platforms: [],
            is_demo_low_risk: false,
            selected_region: 'All',
            getExistingAccounts: jest.fn(),
            available_dxtrade_accounts: [],
            is_wallet_upgrade_in_progress: false,
            setWalletsUpgradeInProgressPopup: jest.fn(),
            is_wallet_upgrade_ready: false,
            setWalletsUpgradeReadyPopup: jest.fn(),
        },
        menu: {
            attach: jest.fn(),
            update: jest.fn(),
        },
        notifications: {
            addNotificationMessage: jest.fn(),
            client_notifications: {},
            filterNotificationMessages: jest.fn(),
            refreshNotifications: jest.fn(),
            removeNotificationByKey: jest.fn(),
            removeNotificationMessage: jest.fn(),
            setP2POrderProps: jest.fn(),
            showAccountSwitchToRealNotification: jest.fn(),
            setP2PRedirectTo: jest.fn(),
            addNotificationMessageByKey: jest.fn(),
        },
        portfolio: {
            active_positions: [],
            error: {
                header: '',
                message: '',
                type: '',
                redirect_label: '',
                redirect_to: '',
                should_clear_error_on_click: false,
                should_show_refresh: false,
                redirectOnClick: jest.fn(),
                setError: jest.fn(),
                app_routing_history: [],
            },
            getPositionById: jest.fn(),
            is_loading: false,
            is_accumulator: false,
            is_multiplier: false,
            onClickCancel: jest.fn(),
            onClickSell: jest.fn(),
            onMount: jest.fn(),
            removePositionById: jest.fn(),
        },
        contract_trade: {
            getContractById: jest.fn(),
        },
        modules: {},
        exchange_rates: {
            data: undefined,
            update: jest.fn(),
            unmount: jest.fn(),
        },
        feature_flags: {
            data: undefined,
            update: jest.fn(),
            unmount: jest.fn(),
        },
    };
};

const mockStore = (override: DeepPartial<TStores>): TStores => merge(mock(), override);

export default mockStore;
