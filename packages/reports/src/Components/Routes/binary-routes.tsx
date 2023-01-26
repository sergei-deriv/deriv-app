import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import getRoutesConfig from '../../Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';

type TBinaryRoutes = {
    is_logged_in: boolean;
    is_logging_in: boolean;
    passthrough: Record<string, any>;
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
                {getRoutesConfig().map(route => (
                    <RouteWithSubRoutes key={route.path} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
