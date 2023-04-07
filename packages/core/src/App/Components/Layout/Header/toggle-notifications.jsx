import classNames from 'classnames';
import React from 'react';
import { Counter, DesktopWrapper, Icon, MobileWrapper, Popover } from '@deriv/components';
import NotificationsDialog from 'App/Containers/NotificationsDialog';
import 'Sass/app/modules/notifications-dialog.scss';
import { useStore, observer } from '@deriv/stores';

const ToggleNotificationsDrawer = observer(
    ({ count, is_visible, toggleDialog, tooltip_message, should_disable_pointer_events = false }) => {
        const {
            client: { is_logging_in, is_switching, is_landing_company_loaded, is_account_setting_loaded },
        } = useStore();

        const is_notifications_loading_completed =
            !is_logging_in && !is_switching && is_landing_company_loaded && is_account_setting_loaded;

        const [notificationsCount, setNotificationsCount] = React.useState(0);

        React.useEffect(() => {
            if (is_notifications_loading_completed && !!count) setNotificationsCount(count);
            else if (is_notifications_loading_completed) setNotificationsCount(0);
        }, [is_notifications_loading_completed, count]);

        const notifications_toggler_el = (
            <div
                className={classNames('notifications-toggle__icon-wrapper', {
                    'notifications-toggle__icon-wrapper--active': is_visible,
                })}
                onClick={toggleDialog}
            >
                <Icon className='notifications-toggle__icon' icon='IcBell' />
                {!!notificationsCount && <Counter count={notificationsCount} className='notifications-toggle__step' />}
            </div>
        );

        return (
            <div
                className={classNames('notifications-toggle', {
                    'notifications-toggle--active': is_visible,
                })}
            >
                <DesktopWrapper>
                    <Popover
                        classNameBubble='notifications-toggle__tooltip'
                        alignment='bottom'
                        message={tooltip_message}
                        should_disable_pointer_events={should_disable_pointer_events}
                        zIndex={9999}
                    >
                        {notifications_toggler_el}
                    </Popover>
                    <NotificationsDialog is_visible={is_visible} toggleDialog={toggleDialog} />
                </DesktopWrapper>
                <MobileWrapper>
                    {notifications_toggler_el}
                    <NotificationsDialog is_visible={is_visible} toggleDialog={toggleDialog} />
                </MobileWrapper>
            </div>
        );
    }
);

export default ToggleNotificationsDrawer;
