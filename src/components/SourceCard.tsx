/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { translateExtensionLanguage } from '@/screens/util/Extensions';
import { SourceContentType } from '@/screens/SourceMangas';
import { SpinnerImage } from '@/components/util/SpinnerImage.tsx';
import { GetSourcesListQuery } from '@/lib/graphql/generated/graphql.ts';
import { MediaQuery } from '@/lib/ui/MediaQuery.tsx';

interface IProps {
    source: GetSourcesListQuery['sources']['nodes'][number];
    showSourceRepo: boolean;
}

export const SourceCard: React.FC<IProps> = (props: IProps) => {
    const { t } = useTranslation();

    const isMobileWidth = MediaQuery.useIsMobileWidth();

    const {
        source: {
            id,
            name,
            lang,
            iconUrl,
            supportsLatest,
            isNsfw,
            extension: { repo },
        },
        showSourceRepo,
    } = props;

    return (
        <Card
            sx={{
                margin: 1,
                marginTop: 0,
            }}
        >
            <CardActionArea
                component={Link}
                to={`/sources/${id}`}
                state={{ contentType: SourceContentType.POPULAR, clearCache: true }}
            >
                <CardContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 1.5,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            variant="rounded"
                            alt={name}
                            sx={{
                                width: 56,
                                height: 56,
                                flex: '0 0 auto',
                                mr: 1,
                                background: 'transparent',
                            }}
                        >
                            <SpinnerImage
                                spinnerStyle={{ small: true }}
                                imgStyle={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                alt={name}
                                src={requestManager.getValidImgUrlFor(iconUrl)}
                            />
                        </Avatar>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h6" component="h3">
                                {name}
                            </Typography>
                            {id !== '0' && (
                                <Typography variant="caption" display="block">
                                    {translateExtensionLanguage(lang)}
                                    {isNsfw && (
                                        <Typography variant="caption" display="inline" color="error">
                                            {' 18+'}
                                        </Typography>
                                    )}
                                    {showSourceRepo && (
                                        <Typography variant="caption" display="block">
                                            {repo}
                                        </Typography>
                                    )}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                        {supportsLatest && (
                            <Button
                                variant="outlined"
                                component={Link}
                                to={`/sources/${id}`}
                                state={{ contentType: SourceContentType.LATEST, clearCache: true }}
                            >
                                {t('global.button.latest')}
                            </Button>
                        )}
                        {!isMobileWidth && (
                            <Button
                                variant="outlined"
                                component={Link}
                                to={`/sources/${id}`}
                                state={{ contentType: SourceContentType.POPULAR, clearCache: true }}
                            >
                                {t('global.button.popular')}
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
