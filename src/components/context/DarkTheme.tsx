/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';

type ContextType = {
    darkTheme: boolean;
    setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DarkTheme = React.createContext<ContextType>({
    darkTheme: true,
    setDarkTheme: (): void => {},
});
