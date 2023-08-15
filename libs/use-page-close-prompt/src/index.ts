import { useEffect } from 'react';

const usePageClosePrompt = () => {
  useEffect(() => {
    const pageCloseHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return (event.returnValue = '');
    };
    window.addEventListener('beforeunload', pageCloseHandler);
    return () => {
      window.removeEventListener('beforeunload', pageCloseHandler);
    };
  }, []);
};

export default usePageClosePrompt;
