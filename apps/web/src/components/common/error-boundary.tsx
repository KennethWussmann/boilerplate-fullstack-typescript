import { ChevronDown, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, Textarea } from '../ui';
import { DeveloperOnly } from './dev-tools';

interface ErrorInfo {
  error: Error;
  componentStack?: string;
}

interface ErrorBoundaryContextValue {
  showError: (info: ErrorInfo) => void;
  isShowingError: boolean;
}

const ErrorBoundaryContext = React.createContext<ErrorBoundaryContextValue | null>(null);

const useErrorBoundaryContext = () => {
  return React.useContext(ErrorBoundaryContext);
};

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
}

export const ErrorBoundaryProvider = ({ children }: ErrorBoundaryProviderProps) => {
  const [errorInfo, setErrorInfo] = React.useState<ErrorInfo | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isStacktraceOpen, setStackTraceOpen] = React.useState(false);

  const showError = React.useCallback(
    (info: ErrorInfo) => {
      if (!isOpen) {
        setErrorInfo(info);
        setIsOpen(true);
      }
    },
    [isOpen]
  );

  const handleClose = () => {
    setIsOpen(false);
    setErrorInfo(null);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const contextValue = React.useMemo(
    () => ({
      showError,
      isShowingError: isOpen,
    }),
    [showError, isOpen]
  );

  return (
    <ErrorBoundaryContext.Provider value={contextValue}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Something went wrong</DialogTitle>
            <DialogDescription>
              An unexpected error occurred. You can try closing this dialog or reload the page.
            </DialogDescription>
          </DialogHeader>
          {errorInfo && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-destructive">{errorInfo.error.name}</p>
                <p className="text-sm text-muted-foreground">{errorInfo.error.message}</p>
              </div>
              <DeveloperOnly>
                {errorInfo.componentStack && (
                  <Collapsible open={isStacktraceOpen} onOpenChange={setStackTraceOpen}>
                    <CollapsibleTrigger>
                      <Button variant="ghost" size="sm" className="w-fit">
                        {isStacktraceOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        {isStacktraceOpen ? 'Hide' : 'Show'} Stacktrace
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Textarea>{errorInfo.componentStack}</Textarea>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </DeveloperOnly>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleReload}>Reload page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundaryContext.Provider>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = ErrorBoundaryContext;
  declare context: ErrorBoundaryContextValue | null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.context) {
      this.context.showError({
        error,
        componentStack: errorInfo.componentStack ?? undefined,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return null;
    }

    return this.props.children;
  }
}

export { useErrorBoundaryContext };
