import { useMemo } from 'react';
import useQuery from '../useQuery';

/** A custom hook that gets the client country. */
const useClientCountry = () => {
    const { data, ...website_status_rest } = useQuery('website_status');

    /** Modify the residence client country. */
    const modified_client_country = useMemo(() => {
        if (!data?.website_status?.clients_country) return undefined;

        return data.website_status?.clients_country;
    }, [data]);

    return {
        /** The client's country */
        data: modified_client_country,
        ...website_status_rest,
    };
};

export default useClientCountry;
