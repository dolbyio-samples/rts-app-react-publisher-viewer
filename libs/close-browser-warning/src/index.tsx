import React, { useEffect } from "react";

const CloseBrowserWarning = () => {
    useEffect(() => {
        const handleTabClose = event => {
          event.preventDefault();    
          return (event.returnValue = 'Are you sure you want to exit?');
        };
    
        window.addEventListener('beforeunload', handleTabClose);
    
        return () => {
          window.removeEventListener('beforeunload', handleTabClose);
        };
      }, []);

    return (
        <div>test test</div>
    )
}

export default CloseBrowserWarning;