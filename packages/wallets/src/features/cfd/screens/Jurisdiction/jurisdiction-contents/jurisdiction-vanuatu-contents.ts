import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionVanuatuContents = (): TJurisdictionCardItems => ({
    contents: {
        financial: [
            {
                description: 'Forex (standard/micro), stocks, stock indices, commodities, cryptocurrencies and ETFs',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '90+',
                    displayTextSkinColor: 'red-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        tag: 'dynamicLeverage',
                        text: 'Dynamic Leverage',
                        type: 'link',
                    },
                ],
                key: 'leverage',
                title: 'Leverage up to',
                titleIndicators: {
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: 'Spreads from',
                titleIndicators: {
                    displayText: '0.5 pips',
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: 'Learn more',
                        type: 'link',
                    },
                    {
                        text: 'about verifications needed.',
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: 'Vanuatu Financial Services Commission',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
        synthetic: [
            {
                description:
                    'Forex (standard), stock indices, commodities, cryptocurrencies, synthetic indices, basket indices and derived FX',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '210+',
                    displayTextSkinColor: 'red-darker',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage up to',
                titleIndicators: {
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: 'Learn more',
                        type: 'link',
                    },
                    {
                        text: 'about verifications needed.',
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: 'Vanuatu Financial Services Commission',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
    },
    header: 'Vanuatu',
    isOverHeaderAvailable: false,
    verificationDocs: {
        financial: ['documentNumber', 'nameAndAddress'],
        synthetic: ['documentNumber', 'nameAndAddress'],
    },
});
