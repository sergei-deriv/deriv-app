import React from 'react';
import { Modal } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import CopyAdvertForm from 'Pages/my-ads/copy-advert-form';
import { useStores } from 'Stores';
import { TAdvert } from 'Types';

const CopyAdvertModal = ({ advert }: TAdvert) => {
    const { is_modal_open } = useModalManagerContext();
    const { my_ads_store } = useStores();

    return (
        <Modal
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={<Localize i18n_default_text='Create a similar ad' />}
        >
            <Modal.Body className='copy-advert-modal'>
                <CopyAdvertForm advert={advert} onCancel={() => my_ads_store.setShowEditAdForm(false)} />
            </Modal.Body>
        </Modal>
    );
};

export default CopyAdvertModal;
