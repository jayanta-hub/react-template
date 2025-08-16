import Router from "./routes/Router";
import rtlCache from './rtlCache';
import { CacheProvider } from "@emotion/react";
import { useLanguage } from "./hooks/useLanguage";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

const App: React.FC = (): JSX.Element => {
  const { isRTL } = useLanguage();

  return (
    <ErrorBoundary>
      <div>
        {isRTL ? (
          <CacheProvider value={rtlCache}>
            <Router />
          </CacheProvider>
        ) : (
          <Router />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
