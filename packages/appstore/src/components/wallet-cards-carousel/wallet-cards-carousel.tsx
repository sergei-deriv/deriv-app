import React from 'react';
import { getWalletHeaderButtons } from 'Constants/utils';
import { TWalletAccount } from 'Types';
import WalletButton from 'Components/wallet-button';
import CardsSliderSwiper from './cards-slider-swiper';
import { observer, useStore } from '@deriv/stores';
import './wallet-cards-carousel.scss';

type TProps = {
    readonly items: TWalletAccount[];
};

const WalletCardsCarousel = observer(({ items }: TProps) => {
    const {
        client: { loginid, switchAccount },
    } = useStore();

    const [active_page, setActivePage] = React.useState(
        items.findIndex(item => item?.loginid === loginid) === -1
            ? 0
            : items.findIndex(item => item?.loginid === loginid)
    );

    React.useEffect(() => {
        switchAccount(items[active_page]?.loginid);
    }, [active_page, items, switchAccount]);

    const wallet_buttons = getWalletHeaderButtons(items[active_page]?.is_virtual);

    return (
        <div className='wallet-cards-carousel traders-hub__wallets-bg'>
            <CardsSliderSwiper items={items} setActivePage={setActivePage} active_page={active_page} />
            <div className='wallet-cards-carousel__buttons'>
                {wallet_buttons.map(button => (
                    <WalletButton key={button.name} button={button} />
                ))}
            </div>
        </div>
    );
});

export default WalletCardsCarousel;
