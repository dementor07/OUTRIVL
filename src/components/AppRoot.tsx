'use client';

import { OutrivlProvider } from '@/state/store';
import { useMarket } from '@/state/useMarket';
import { Shell } from './shell/Shell';
import { MarketBar } from './shell/MarketBar';
import { Board } from './market/Board';
import { Floor } from './market/Floor';
import { Ladder } from './market/Ladder';
import { ProductPage } from './product/ProductPage';
import { Challenges } from './desk/Challenges';
import { BattleFeed } from './desk/BattleFeed';
import { Insights } from './desk/Insights';
import { Studio } from './desk/Studio';
import { Season } from './desk/Season';
import { LiveSitePanel } from './widget/LiveSitePanel';

/** Client-side routing between the app's surfaces. */
function Router() {
  const { d } = useMarket();
  return (
    <Shell>
      {d.isBoard || d.isFloor || d.isLadder ? <MarketBar /> : null}
      {d.isBoard && <Board />}
      {d.isFloor && <Floor />}
      {d.isLadder && <Ladder />}
      {d.isProduct && <ProductPage />}
      {d.isChallenges && <Challenges />}
      {d.isFeed && <BattleFeed />}
      {d.isInsights && <Insights />}
      {d.isStudio && <Studio />}
      {d.isSeason && <Season />}
      <LiveSitePanel />
    </Shell>
  );
}

export function AppRoot() {
  return (
    <OutrivlProvider>
      <Router />
    </OutrivlProvider>
  );
}
