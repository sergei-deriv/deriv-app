import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';
import LanguageSettings from '../language-settings';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useTranslations } from '@deriv-com/translations';

jest.mock('@deriv-com/translations');

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    TranslationFlag: { EN: () => <div>Language 1 Flag</div>, VI: () => <div>Language 2 Flag</div> },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Redirect: jest.fn(() => <div>Redirect</div>),
}));

describe('LanguageSettings', () => {
    let mockRootStore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mockRootStore = mockStore({
            common: {
                current_language: 'lang_1',
            },
            ui: {
                is_mobile: false,
            },
        });
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'EN',
            localize: jest.fn().mockImplementation(key => key),
            switchLanguage: jest.fn(),
        });
    });

    const renderLanguageSettings = () => {
        render(<LanguageSettings />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });
    };

    it('should render LanguageSettings', () => {
        renderLanguageSettings();

        expect(screen.getByText('Select Language')).toBeInTheDocument();

        const lang_1 = screen.getByText('English');
        const lang_2 = screen.getByText('Tiếng Việt');

        expect(screen.getByText(/Language 1 Flag/)).toBeInTheDocument();
        expect(screen.getByText(/Language 2 Flag/)).toBeInTheDocument();
        expect(lang_1).toBeInTheDocument();
        expect(lang_2).toBeInTheDocument();
    });

    it('should trigger language change', () => {
        renderLanguageSettings();

        const lang_2 = screen.getByText('Tiếng Việt');
        userEvent.click(lang_2);

        expect(mockRootStore.common.changeSelectedLanguage).toHaveBeenCalled();
    });

    it('should redirect in mobile view when the user tries to reach `/account/languages` route', () => {
        mockRootStore.ui.is_mobile = true;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.languages },
        });

        renderLanguageSettings();

        expect(screen.queryByText('Select Language')).not.toBeInTheDocument();
        expect(screen.getByText('Redirect')).toBeInTheDocument();
    });

    it('should redirect when the user tries to reach `/account/languages` route having wallet accounts', () => {
        mockRootStore.client.has_wallet = true;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.languages },
        });

        renderLanguageSettings();

        expect(screen.queryByText('Select Language')).not.toBeInTheDocument();
        expect(screen.getByText('Redirect')).toBeInTheDocument();
    });
});
