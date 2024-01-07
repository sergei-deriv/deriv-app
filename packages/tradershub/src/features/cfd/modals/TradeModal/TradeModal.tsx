import React, { FC, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Provider } from '@deriv/library';
import { Text, useBreakpoint } from '@deriv/quill-design';
import { Modal } from '../../../../components/Modal';
import InstallationAppleIcon from '../../../../public/images/ic-installation-apple.svg';
import InstallationGoogleIcon from '../../../../public/images/ic-installation-google.svg';
import InstallationHuaweiIcon from '../../../../public/images/ic-installation-huawei.svg';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { PlatformDetails } from '../../constants';
import { MT5TradeScreen } from '../../screens/MT5TradeScreen';

type TAppLinks = {
    android: string;
    huawei?: string;
    ios: string;
};

const LinksMapper: Record<TPlatforms.All, TAppLinks> = {
    ctrader: {
        android: 'https://play.google.com/store/apps/details?id=com.deriv.ct',
        ios: 'https://apps.apple.com/cy/app/ctrader/id767428811',
    },
    dxtrade: {
        android: 'https://play.google.com/store/apps/details?id=com.deriv.dx',
        huawei: 'https://appgallery.huawei.com/app/C104633219',
        ios: 'https://apps.apple.com/us/app/deriv-x/id1563337503',
    },
    mt5: {
        android: 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
        huawei: 'https://appgallery.huawei.com/#/app/C102015329',
        ios: 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
    },
};

const AppToIconMapper: Record<string, React.ComponentType<React.SVGAttributes<SVGElement>>> = {
    android: InstallationGoogleIcon,
    huawei: InstallationHuaweiIcon,
    ios: InstallationAppleIcon,
};

type TTradeModalProps = {
    account?: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    marketType?: TMarketTypes.All;
    platform: TPlatforms.All;
};

const TradeModal: FC<TTradeModalProps> = ({ account, marketType, platform }) => {
    const { setModalState } = Provider.useModal();
    const { isDesktop } = useBreakpoint();

    useEffect(() => {
        setModalState('marketType', marketType);
        setModalState('platform', platform);
        if (platform === 'mt5') setModalState('accountId', (account as THooks.MT5AccountsList)?.loginid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const appOrder = ['ios', 'android', 'huawei'];

    return (
        <Modal>
            <Modal.Header title='Trade' />
            <Modal.Content>
                <MT5TradeScreen account={account} />
            </Modal.Content>
            <Modal.Footer>
                <div className='pt-50 min-h-[19rem] lg:pt-[inherit] lg:min-h-[inherit] flex justify-center items-center flex-col h-fit w-full gap-800'>
                    <Text align='center' size='sm' weight='bold'>
                        Download {PlatformDetails[platform].title} on your phone to trade with the{' '}
                        {PlatformDetails[platform].title} account
                    </Text>
                    <div className='flex gap-800'>
                        <div className='flex flex-col justify-center gap-400 svg'>
                            {appOrder.map(app => {
                                const AppsLinkMapper = LinksMapper[platform][app as keyof TAppLinks];
                                if (AppsLinkMapper) {
                                    const AppIcon = AppToIconMapper[app];
                                    const appLink = AppsLinkMapper;
                                    return (
                                        <AppIcon
                                            className='w-[13.7rem] h-[4rem] cursor-pointer'
                                            key={app}
                                            onClick={() => window.open(appLink)}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </div>
                        {isDesktop && (
                            <div className='border-[1px_solid_hover-background] rounded-200 flex flex-col justify-center items-center w-[15rem] gap-[0.5rem] p-400'>
                                <QRCode size={80} value={PlatformDetails[platform].link} />
                                <Text align='center' size='xs'>
                                    Scan the QR code to download {PlatformDetails[platform].title}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default TradeModal;
