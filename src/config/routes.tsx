import { PageConfig } from 'components/pages/page-config/PageConfig';
import { PageHistory } from 'components/pages/page-history/PageHistory';
import { PageHome } from 'components/pages/page-home/PageHome';
import { PageNotFound } from 'components/pages/page-not-found/PageNotFound';
import { PageProfiles } from 'components/pages/page-profiles/PageProfiles';
import { PageRoast } from 'components/pages/page-roast/PageRoast';

export const routes = {
    "/": (p?) => <PageHome />,
    "/roast": (p?) => <PageRoast />,
    "/history": (p?) => <PageHistory />,
    "/profiles": (p?) => <PageProfiles />,
    "/config": (p?) => <PageConfig />,
    "/page-not-found": (p?) => <PageNotFound />,
    "*": (p?) => <PageNotFound />
};

export const DEFAULT_ROUTE = "/roast";