import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import getRoutesConfig from '../../Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';
import type { TStores } from '@deriv/stores';

// this type already described in ../../Containers/routes.tsx, but PR is not merged yet
// TODO: export this type during refactor
type TPassthrough = {
    root_store: TStores;
    WS: Record<string, any>;
};

export type TBinaryRoutes = {
    is_logged_in: boolean;
    is_logging_in: boolean;
    passthrough: TPassthrough;
};

const BinaryRoutes = (props: TBinaryRoutes) => {
    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={route.path ?? idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
