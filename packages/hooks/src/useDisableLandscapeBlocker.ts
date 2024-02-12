import { useEffect } from 'react';

const useDisableLandscapeBlocker = () => {
    useEffect(() => {
        const landscapeBlocker = document.getElementById('landscape_blocker');

        landscapeBlocker?.classList.add('landscape-blocker_none');

        return () => landscapeBlocker?.classList.remove('landscape-blocker_none');
    }, []);
};

export default useDisableLandscapeBlocker;
