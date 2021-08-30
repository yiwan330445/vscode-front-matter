import * as React from 'react';
import { PageFrontMatter } from '../../models/PageFrontMatter';
import { Sidebar } from './Sidebar';

export interface IPageProps {
  items: PageFrontMatter[];
}

export const Page: React.FunctionComponent<IPageProps> = ({items, children}: React.PropsWithChildren<IPageProps>) => {
  return (
    <div className={`py-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
      <div className={`lg:flex`}>

        <div className={`h-screen sticky top-16 lg:block hidden lg:w-60 xl:w-72`}>
          <Sidebar items={items} />
        </div>

        <div className={`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible`}>
          {children}
        </div>
      </div>
    </div>
  );
};

