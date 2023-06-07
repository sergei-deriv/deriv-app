import React, { useRef } from 'react';
import { ProgressBarOnboarding, Icon, Text, WalletCard } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
import { TWalletAccount } from 'Types';
import { formatMoney } from '@deriv/shared';
import Slider from 'react-slick';
import './wallet-cards-carousel.scss';

interface WalletCardsCarouselProps {
    readonly items: TWalletAccount[];
}

export const WalletCardsCarousel = ({ items }: WalletCardsCarouselProps) => {
    const [activePage, setActivePage] = React.useState(0);
    const ref = useRef<Slider | null>(null);

    const wallet_btns = getWalletHeaderButtons(items[activePage]?.is_virtual);

    const sliderJSX = React.useMemo(() => {
        const handlerGoTo = (slideNumber: number) => {
            setActivePage(slideNumber - 1);
            ref?.current?.slickGoTo(slideNumber - 1);
        };

        const settings = {
            dots: true,
            infinite: false,
            centerMode: true,
            centerPadding: '0',
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            arrow: false,
            speed: 500,
            touchThreshold: 10,
            dotsClass: 'wallet-cards-carousel__pagination',
            afterChange: (currentSlide: number) => {
                setActivePage(currentSlide);
            },
            appendDots: (dots: React.ReactElement[]) => {
                const active = dots.findIndex(dot => dot.props.className === 'slick-active') || 0;
                const steps = dots.map((_, idx) => idx.toString());

                return (
                    <div>
                        <ProgressBarOnboarding
                            step={active + 1}
                            amount_of_steps={steps}
                            is_transition={true}
                            setStep={handlerGoTo}
                        />
                    </div>
                );
            },
        };

        return (
            <Slider {...settings} ref={ref}>
                {items.map((item: TWalletAccount) => (
                    <WalletCard
                        key={`${item.name} ${item.currency} ${item.landing_company_shortcode}`}
                        wallet={{
                            ...item,
                            balance: formatMoney(item.currency, item.balance, true),
                            jurisdiction_title: item.landing_company_shortcode,
                        }}
                        size='medium'
                    />
                ))}
            </Slider>
        );
    }, [items]);

    return (
        <div className='wallet-cards-carousel'>
            {sliderJSX}
            <div className='wallet-cards-carousel__buttons'>
                {wallet_btns.map(btn => (
                    <div key={btn.name} className='wallet-cards-carousel__buttons-item' onClick={btn.action}>
                        <div className='wallet-cards-carousel__buttons-item-icon'>
                            <Icon icon={btn.icon} />
                        </div>
                        <Text size='xxxxs' className='wallet-cards-carousel__buttons-item-text'>
                            {btn.text}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};
WalletCardsCarousel.displayName = 'WalletCardsCarousel';

export default WalletCardsCarousel;
