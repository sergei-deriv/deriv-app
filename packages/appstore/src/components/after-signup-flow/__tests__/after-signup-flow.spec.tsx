import React from 'react';
import AfterSignupFlow from '../after-signup-flow';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useContentFlag, useGrowthbookGetFeatureValue } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useContentFlag: jest.fn(() => ({ is_cr_demo: true, is_eu_demo: false })),
    useGrowthbookGetFeatureValue: jest.fn(() => [false, true]),
}));

describe('AfterSignupFlow', () => {
    const mockDefault = mockStore({});

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    it('should render correctly', () => {
        const { container } = render(<AfterSignupFlow />, {
            wrapper: wrapper(),
        });
        expect(container).toBeInTheDocument();
    });

    it('check if growthbook feature flags are false', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);

        const mockedOpenRealAccountSignup = jest.fn();
        const mockedSetIsFromSignupAccount = jest.fn();
        const mockedSetIsSetupRealAccountOrGoToDemoModalVisible = jest.fn();

        const mock = mockStore({
            client: {
                is_logged_in: true,
                has_active_real_account: false,
            },
            ui: {
                is_from_signup_account: true,
                openRealAccountSignup: mockedOpenRealAccountSignup,
                setIsFromSignupAccount: mockedSetIsFromSignupAccount,
            },
            traders_hub: {
                setIsSetupRealAccountOrGoToDemoModalVisible: mockedSetIsSetupRealAccountOrGoToDemoModalVisible,
            },
        });

        render(<AfterSignupFlow />, {
            wrapper: wrapper(mock),
        });

        expect(mockedOpenRealAccountSignup).not.toBeCalled();
        expect(mockedSetIsFromSignupAccount).not.toBeCalled();
        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).not.toBeCalled();
    });

    it('check if growthbook feature flags "direct-real-account-creation-flow" is true for is_cr_demo = true', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValueOnce([true, true]);
        (useContentFlag as jest.Mock).mockReturnValue({ is_cr_demo: true, is_eu_demo: false });

        const mockedOpenRealAccountSignup = jest.fn();
        const mockedSetIsFromSignupAccount = jest.fn();
        const mockedSetIsSetupRealAccountOrGoToDemoModalVisible = jest.fn();

        const mock = mockStore({
            client: {
                is_logged_in: true,
                has_active_real_account: false,
            },
            ui: {
                is_from_signup_account: true,
                openRealAccountSignup: mockedOpenRealAccountSignup,
                setIsFromSignupAccount: mockedSetIsFromSignupAccount,
            },
            traders_hub: {
                setIsSetupRealAccountOrGoToDemoModalVisible: mockedSetIsSetupRealAccountOrGoToDemoModalVisible,
            },
        });

        render(<AfterSignupFlow />, {
            wrapper: wrapper(mock),
        });

        expect(mockedOpenRealAccountSignup).toBeCalled();
        expect(mockedSetIsFromSignupAccount).toBeCalled();
        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).not.toBeCalled();
    });

    it('check if growthbook feature flags "direct-real-account-creation-flow" is true for is_eu_demo = true', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValueOnce([true, true]);
        (useContentFlag as jest.Mock).mockReturnValue({ is_cr_demo: false, is_eu_demo: true });

        const mockedOpenRealAccountSignup = jest.fn();
        const mockedSetIsFromSignupAccount = jest.fn();
        const mockedSetIsSetupRealAccountOrGoToDemoModalVisible = jest.fn();

        const mock = mockStore({
            client: {
                is_logged_in: true,
                has_active_real_account: false,
            },
            ui: {
                is_from_signup_account: true,
                openRealAccountSignup: mockedOpenRealAccountSignup,
                setIsFromSignupAccount: mockedSetIsFromSignupAccount,
            },
            traders_hub: {
                setIsSetupRealAccountOrGoToDemoModalVisible: mockedSetIsSetupRealAccountOrGoToDemoModalVisible,
            },
        });

        render(<AfterSignupFlow />, {
            wrapper: wrapper(mock),
        });

        expect(mockedOpenRealAccountSignup).toBeCalled();
        expect(mockedSetIsFromSignupAccount).toBeCalled();
        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).not.toBeCalled();
    });

    it('check if growthbook feature flags "show_setup_real_or_go_demo" is true', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValueOnce([false, true]);
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValueOnce([true, true]);

        const mockedOpenRealAccountSignup = jest.fn();
        const mockedSetIsFromSignupAccount = jest.fn();
        const mockedSetIsSetupRealAccountOrGoToDemoModalVisible = jest.fn();

        const mock = mockStore({
            client: {
                is_logged_in: true,
                has_active_real_account: false,
            },
            ui: {
                is_from_signup_account: true,
                openRealAccountSignup: mockedOpenRealAccountSignup,
                setIsFromSignupAccount: mockedSetIsFromSignupAccount,
            },
            traders_hub: {
                setIsSetupRealAccountOrGoToDemoModalVisible: mockedSetIsSetupRealAccountOrGoToDemoModalVisible,
            },
        });

        render(<AfterSignupFlow />, {
            wrapper: wrapper(mock),
        });

        expect(mockedOpenRealAccountSignup).not.toBeCalled();
        expect(mockedSetIsFromSignupAccount).toBeCalled();
        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).toBeCalled();
    });
});
