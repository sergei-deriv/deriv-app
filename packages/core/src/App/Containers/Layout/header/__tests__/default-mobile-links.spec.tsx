import React from 'react';
import { render, screen } from '@testing-library/react';
import DefaultMobileLinks from '../default-mobile-links';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('App/Components/Routes', () => ({
    BinaryLink: jest.fn(() => <div data-testid='dt_binary_link'>MockedBinaryLink to Account Settings</div>),
}));
jest.mock('../show-notifications', () =>
    jest.fn(() => <div data-testid='dt_show_notifications'>MockedShowNotifications</div>)
);
jest.mock('../traders-hub-onboarding', () =>
    jest.fn(() => <div data-testid='dt_traders_hub_onboarding'>MockedTradersHubOnboarding</div>)
);

describe('DefaultMobileLinks', () => {
    const store = mockStore({
        client: {
            has_wallet: false,
            has_any_real_account: true,
            is_virtual: false,
        },
    });
    const renderComponent = (modified_store = store) =>
        render(
            <StoreProvider store={modified_store}>
                <DefaultMobileLinks />
            </StoreProvider>
        );
    it('should render "DefaultMobileLinks" with Onboarding, Notifications & link to Account Settings', () => {
        renderComponent();
        expect(screen.getByTestId('dt_traders_hub_onboarding')).toBeInTheDocument();
        expect(screen.getByText('MockedTradersHubOnboarding')).toBeInTheDocument();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
        expect(screen.getByText('MockedBinaryLink to Account Settings')).toBeInTheDocument();
    });

    it('should display the cashier button if client does not have wallet account', () => {
        renderComponent();
        expect(screen.getByRole('button', { name: 'Cashier' })).toBeInTheDocument();
    });
});
