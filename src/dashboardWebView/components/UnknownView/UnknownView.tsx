import { StopIcon } from '@heroicons/react/24/outline';
import * as React from 'react';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';

export interface IUnknownViewProps { }

export const UnknownView: React.FunctionComponent<IUnknownViewProps> = (
  _: React.PropsWithChildren<IUnknownViewProps>
) => {
  return (
    <div className={`w-full h-full flex items-center justify-center`}>
      <div className={`flex flex-col items-center text-[var(--frontmatter-text)]`}>
        <StopIcon className="w-32 h-32" />
        <p className="text-3xl mt-2">
          {l10n.t(LocalizationKey.dashboardUnkownViewTitle)}
        </p>
        <p className="text-xl mt-4">
          {l10n.t(LocalizationKey.dashboardUnkownViewDescription)}
        </p>
      </div>
    </div>
  );
};
