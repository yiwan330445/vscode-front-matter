import { Messenger } from '@estruyf/vscode/dist/client';
import * as React from 'react';
import { PanelSettings } from '../../models';
import { CommandToCode } from '../CommandToCode';
import useStartCommand from '../hooks/useStartCommand';
import { LocalizationKey } from '../../localization';
import * as l10n from "@vscode/l10n"

export interface IStartServerButtonProps {
  settings: PanelSettings | undefined;
}

export const StartServerButton: React.FunctionComponent<IStartServerButtonProps> = ({
  settings
}: React.PropsWithChildren<IStartServerButtonProps>) => {
  const { startCommand } = useStartCommand(settings);

  const startLocalServer = (command: string) => {
    Messenger.send(CommandToCode.frameworkCommand, { command });
  };

  const stopLocalServer = () => {
    Messenger.send(CommandToCode.stopServer);
  };

  return startCommand ? (
    <>
      <button
        title={l10n.t(LocalizationKey.panelStartServerbuttonStart)}
        type={`button`}
        onClick={() => startLocalServer(startCommand)}>
        {l10n.t(LocalizationKey.panelStartServerbuttonStart)}
      </button>
      <button
        title={l10n.t(LocalizationKey.panelStartServerbuttonStop)}
        type={`button`}
        onClick={() => stopLocalServer()}>
        {l10n.t(LocalizationKey.panelStartServerbuttonStop)}
      </button>
    </>
  ) : null;
};
