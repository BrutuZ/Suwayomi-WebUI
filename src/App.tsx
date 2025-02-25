/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import CssBaseline from '@mui/material/CssBaseline';
import React, { useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { loadable } from 'react-lazily/loadable';
import Box from '@mui/material/Box';
import { AppContext } from '@/components/context/AppContext';
import '@/i18n';
import { DefaultNavBar } from '@/components/navbar/DefaultNavBar';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { WebUIUpdateChecker } from '@/components/util/WebUIUpdateChecker.tsx';
import { ServerUpdateChecker } from '@/components/util/ServerUpdateChecker.tsx';
import { lazyLoadFallback } from '@/util/LazyLoad.tsx';
import { ErrorBoundary } from '@/util/ErrorBoundary.tsx';
import { useNavBarContext } from '@/components/context/NavbarContext.tsx';

const { Browse } = loadable(() => import('@/screens/Browse'), lazyLoadFallback);
const { DownloadQueue } = loadable(() => import('@/screens/DownloadQueue'), lazyLoadFallback);
const { Library } = loadable(() => import('@/screens/Library'), lazyLoadFallback);
const { Manga } = loadable(() => import('@/screens/Manga'), lazyLoadFallback);
const { Reader } = loadable(() => import('@/screens/Reader'), lazyLoadFallback);
const { SearchAll } = loadable(() => import('@/screens/SearchAll'), lazyLoadFallback);
const { Settings } = loadable(() => import('@/screens/Settings'), lazyLoadFallback);
const { About } = loadable(() => import('@/screens/settings/About'), lazyLoadFallback);
const { Backup } = loadable(() => import('@/screens/settings/Backup'), lazyLoadFallback);
const { Categories } = loadable(() => import('@/screens/settings/Categories'), lazyLoadFallback);
const { DefaultReaderSettings } = loadable(() => import('@/screens/settings/DefaultReaderSettings'), lazyLoadFallback);
const { SourceConfigure } = loadable(() => import('@/screens/SourceConfigure'), lazyLoadFallback);
const { SourceMangas } = loadable(() => import('@/screens/SourceMangas'), lazyLoadFallback);
const { Updates } = loadable(() => import('@/screens/Updates'), lazyLoadFallback);
const { LibrarySettings } = loadable(() => import('@/screens/settings/LibrarySettings'), lazyLoadFallback);
const { DownloadSettings } = loadable(() => import('@/screens/settings/DownloadSettings.tsx'), lazyLoadFallback);
const { ServerSettings } = loadable(() => import('@/screens/settings/ServerSettings.tsx'), lazyLoadFallback);
const { BrowseSettings } = loadable(() => import('@/screens/settings/BrowseSettings.tsx'), lazyLoadFallback);
const { WebUISettings } = loadable(() => import('@/screens/settings/WebUISettings.tsx'), lazyLoadFallback);
const { Migrate } = loadable(() => import('@/screens/Migrate.tsx'), lazyLoadFallback);
const { DeviceSetting } = loadable(() => import('@/components/settings/DeviceSetting.tsx'), lazyLoadFallback);
const { TrackingSettings } = loadable(() => import('@/screens/settings/TrackingSettings.tsx'), lazyLoadFallback);
const { TrackerOAuthLogin } = loadable(() => import('@/screens/TrackerOAuthLogin.tsx'), lazyLoadFallback);
const { LibraryDuplicates } = loadable(() => import('@/screens/settings/LibraryDuplicates.tsx'), lazyLoadFallback);

if (process.env.NODE_ENV !== 'production') {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
}

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

/**
 * Creates permanent subscriptions to always have the latest data.
 *
 * E.g. in case a view is open, which does not subscribe to the download updates, finished downloads are never received
 * and thus, data of existing chapters/mangas in the cache get outdated
 */
const BackgroundSubscriptions = () => {
    requestManager.useDownloadSubscription();
    requestManager.useUpdaterSubscription();
    requestManager.useWebUIUpdateSubscription();

    return null;
};

const MainApp = () => {
    const { navBarWidth, appBarHeight, bottomBarHeight } = useNavBarContext();

    return (
        <Box
            id="appMainContainer"
            component="main"
            sx={{
                minHeight: `calc(100vh - ${appBarHeight + bottomBarHeight}px)`,
                width: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                minWidth: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                maxWidth: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                position: 'relative',
                mt: `${appBarHeight}px`,
                mb: `${bottomBarHeight}px`,
            }}
        >
            <ErrorBoundary>
                <Routes>
                    {/* General Routes */}
                    <Route path="/" element={<Navigate to="/library" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="settings">
                        <Route index element={<Settings />} />
                        <Route path="about" element={<About />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="defaultReaderSettings" element={<DefaultReaderSettings />} />
                        <Route path="librarySettings">
                            <Route index element={<LibrarySettings />} />
                            <Route path="duplicates" element={<LibraryDuplicates />} />
                        </Route>
                        <Route path="downloadSettings" element={<DownloadSettings />} />
                        <Route path="backup" element={<Backup />} />
                        <Route path="server" element={<ServerSettings />} />
                        <Route path="webUI" element={<WebUISettings />} />
                        <Route path="browseSettings" element={<BrowseSettings />} />
                        <Route path="device" element={<DeviceSetting />} />
                        <Route path="trackingSettings" element={<TrackingSettings />} />
                    </Route>

                    {/* Manga Routes */}

                    <Route path="sources">
                        <Route index element={<Navigate to="/" replace />} />
                        <Route path=":sourceId" element={<SourceMangas />} />
                        <Route path=":sourceId/configure/" element={<SourceConfigure />} />
                        <Route path="all/search/" element={<SearchAll />} />
                    </Route>
                    <Route path="downloads" element={<DownloadQueue />} />
                    <Route path="manga/:id">
                        <Route path="chapter/:chapterNum" element={null} />
                        <Route index element={<Manga />} />
                    </Route>
                    <Route path="library" element={<Library />} />
                    <Route path="updates" element={<Updates />} />
                    <Route path="browse" element={<Browse />} />
                    <Route path="migrate/source/:sourceId">
                        <Route index element={<Migrate />} />
                        <Route path="manga/:mangaId/search" element={<SearchAll />} />
                    </Route>
                    <Route path="tracker/login/oauth" element={<TrackerOAuthLogin />} />
                </Routes>
            </ErrorBoundary>
        </Box>
    );
};

const ReaderApp = () => (
    <ErrorBoundary>
        <Routes>
            <Route path="manga/:mangaId/chapter/:chapterIndex" element={<Reader />} />
            <Route path="*" element={null} />
        </Routes>
    </ErrorBoundary>
);

export const App: React.FC = () => (
    <AppContext>
        <ScrollToTop />
        <ServerUpdateChecker />
        <WebUIUpdateChecker />
        <BackgroundSubscriptions />
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexShrink: 0 }}>
                <DefaultNavBar />
            </Box>
            <MainApp />
            <ReaderApp />
        </Box>
    </AppContext>
);
