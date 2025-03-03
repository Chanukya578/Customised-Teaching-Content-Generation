import React from 'react';
import { Spin } from 'antd';

/**
 * Renders a loading icon component.
 * 
 * This component displays a loading spinner while the page content is being loaded.
 * It sets a loading state upon page load and hides the spinner after a delay.
 * 
 * @returns {JSX.Element} The JSX element representing the loading icon.
*/
function LoadingIcon() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    function onPageLoad() {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
    window.addEventListener('load', onPageLoad);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="loading-container" style={{
                backdropFilter: 'blur(45px)',
                height: screen.height - Math.min(screen.height * 0.1,100) + "px",
                width: '100vw',
                position: 'fixed',
                top: Math.min(screen.height * 0.1,100) + "px",
                left: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '1000',
            }}>
            <Spin size="large" />
        </div>
      ) : (
        <>
        </>
)}
    </div>
  );
}

export default LoadingIcon;