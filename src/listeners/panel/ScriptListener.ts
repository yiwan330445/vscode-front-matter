import { SETTING_CUSTOM_SCRIPTS } from '../../constants';
import { CustomScript, Settings } from '../../helpers';
import { CustomScript as ICustomScript, PostMessageData } from '../../models';
import { CommandToCode } from '../../panelWebView/CommandToCode';
import { BaseListener } from './BaseListener';

export class ScriptListener extends BaseListener {
  /**
   * Process the messages for the dashboard views
   * @param msg
   */
  public static process(msg: PostMessageData) {
    super.process(msg);

    switch (msg.command) {
      case CommandToCode.runCustomScript:
        this.runCustomScript(msg);
        break;
    }
  }

  /**
   * Run a custom script
   * @param msg
   */
  private static runCustomScript(msg: PostMessageData) {
    const scripts: ICustomScript[] | undefined = Settings.get(SETTING_CUSTOM_SCRIPTS);

    if (msg?.payload?.title && msg?.payload?.script && scripts) {
      const customScript = scripts.find((s: ICustomScript) => s.title === msg.payload.title);
      if (customScript?.script && customScript?.title) {
        CustomScript.run(customScript);
      }
    }
  }
}
