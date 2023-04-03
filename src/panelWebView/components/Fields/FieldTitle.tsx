import * as React from 'react';
import { useMemo } from 'react';
import { VsLabel } from '../VscodeComponents';
import { RequiredAsterix } from './RequiredAsterix';

export interface IFieldTitleProps {
  label: string | JSX.Element;
  icon?: JSX.Element;
  className?: string;
  required?: boolean;
  actionElement?: JSX.Element;
}

export const FieldTitle: React.FunctionComponent<IFieldTitleProps> = ({
  label,
  icon,
  className,
  required,
  actionElement,
}: React.PropsWithChildren<IFieldTitleProps>) => {
  const Icon = useMemo(() => {
    return icon ? React.cloneElement(icon, { style: { width: '16px', height: '16px' } }) : null;
  }, [icon]);

  return (
    <VsLabel>
      <div className={`metadata_field__label ${className || ''}`}>
        <div>
          {Icon}
          <span style={{ lineHeight: '16px' }}>{label}</span>
          <RequiredAsterix required={required} />
        </div>

        {actionElement}
      </div>
    </VsLabel>
  );
};
