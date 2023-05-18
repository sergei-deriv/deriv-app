import React from 'react';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import RealWalletsUpgrade from 'Components/modals/real-wallets-upgrade';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: () => <div>Modal</div>,
}));

describe('<RealWalletsUpgrade />', () => {
    test('should render the Modal', async () => {
        const mock = mockStore({
            traders_hub: {
                is_real_wallets_upgrade_on: true,
                toggleWalletsUpgrade: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealWalletsUpgrade />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    test('should not render the Modal if is_real_wallets_upgrade_on is false', () => {
        const mock = mockStore({
            traders_hub: {
                is_real_wallets_upgrade_on: false,
                toggleWalletsUpgrade: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealWalletsUpgrade />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});
