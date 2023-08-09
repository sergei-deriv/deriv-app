import {
    CFD_PLATFORMS,
    getUrlBinaryBot,
    getUrlSmartTrader,
    getPlatformSettingsAppstore,
    routes,
    getStaticUrl,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { PlatformIcons } from 'Assets/svgs/trading-platform';
import { TAccountCategory, TRegionAvailability } from 'Types';

export type AccountType = { text: 'Real' | 'Demo'; value: TAccountCategory };
export type RegionAvailability = 'Non-EU' | 'EU' | 'All';
export const getAccountTypes = (): AccountType[] => [
    { text: localize('Demo'), value: 'demo' },
    { text: localize('Real'), value: 'real' },
];
export const region_availability: RegionAvailability[] = ['Non-EU', 'EU'];

export type BrandConfig = {
    name: string;
    icon: keyof typeof PlatformIcons;
    availability: TRegionAvailability;
    is_deriv_platform?: boolean;
};

export interface PlatformConfig {
    name: string;
    app_desc: string;
    link_to?: string;
    is_external?: boolean;
    new_tab?: boolean;
}

export interface MfPlatformConfig extends PlatformConfig {
    app_icon: string;
    app_title: string;
}

export const getAppstorePlatforms = (): PlatformConfig[] => [
    {
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Options and multipliers trading platform.'),
        link_to: routes.trade,
    },
    {
        name: getPlatformSettingsAppstore('dbot').name,
        app_desc: localize('Automate your trading, no coding needed.'),
        link_to: routes.bot,
    },
    {
        name: getPlatformSettingsAppstore('smarttrader').name,
        app_desc: localize('Our legacy options trading platform.'),
        link_to: getUrlSmartTrader(),
        is_external: true,
    },
    {
        name: getPlatformSettingsAppstore('bbot').name,
        app_desc: localize('Our legacy automated trading platform.'),
        link_to: getUrlBinaryBot(),
        is_external: true,
    },
    {
        name: getPlatformSettingsAppstore('go').name,
        app_desc: localize('Trade on the go with our mobile app.'),
        link_to: getStaticUrl('/deriv-go'),
        is_external: true,
        new_tab: true,
    },
];

export const getMFAppstorePlatforms = (): MfPlatformConfig[] => [
    {
        app_icon: getPlatformSettingsAppstore('trader').icon,
        app_title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Multipliers trading platform.'),
        link_to: routes.trade,
    },
];

export const openStaticPage = (
    availability: RegionAvailability,
    platform: string | undefined,
    icon: BrandConfig['icon'],
    is_eu_user: boolean,
    name: string,
    is_deriv_platform: boolean
) => {
    return () => {
        if (is_deriv_platform) {
            switch (name) {
                case DERIV_PLATFORM_NAMES.TRADER:
                    window.open(getStaticUrl(`/dtrader`));
                    break;
                case DERIV_PLATFORM_NAMES.DBOT:
                    window.open(getStaticUrl(`/dbot`));
                    break;
                case DERIV_PLATFORM_NAMES.SMARTTRADER:
                    window.open(getUrlSmartTrader());
                    break;
                case DERIV_PLATFORM_NAMES.BBOT:
                    window.open(getUrlBinaryBot());
                    break;
                case DERIV_PLATFORM_NAMES.GO:
                    window.open(getStaticUrl('/deriv-go'));
                    break;
                default:
            }
        }
        if (platform === CFD_PLATFORMS.MT5 && availability === 'EU')
            window.open(getStaticUrl(`/dmt5`, {}, false, true));
        else if (platform === CFD_PLATFORMS.MT5 && availability !== 'EU') window.open(getStaticUrl(`/dmt5`));
        else if (platform === CFD_PLATFORMS.DXTRADE) window.open(getStaticUrl(`/derivx`));
        else if (platform === CFD_PLATFORMS.DERIVEZ) window.open(getStaticUrl(`/derivez`));
        else if (icon === 'Options' && !is_eu_user) window.open(getStaticUrl(`/trade-types/options/`));
        else;
    };
};

// The platform names were taken from packages/shared/brand.config.json
export const DERIV_PLATFORM_NAMES = {
    TRADER: 'Deriv Trader',
    DBOT: 'Deriv Bot',
    SMARTTRADER: 'SmartTrader',
    BBOT: 'Binary Bot',
    GO: 'Deriv GO',
} as const;
