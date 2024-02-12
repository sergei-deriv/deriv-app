import React from 'react';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import Routes from 'Components/routes/routes';
import classNames from 'classnames';
import './app.scss';
import { useDisableLandscapeBlocker } from '@deriv/hooks';

const AppContent: React.FC = observer(() => {
    useDisableLandscapeBlocker();

    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    return (
        <main
            className={classNames('dashboard', {
                'theme--light': !is_dark_mode_on,
                'theme--dark': is_dark_mode_on,
                'dashboard-onboarding': window.location.pathname === routes.onboarding,
            })}
        >
            <div className='dw-dashboard'>
                <Routes />
            </div>
        </main>
    );
});

export default AppContent;
