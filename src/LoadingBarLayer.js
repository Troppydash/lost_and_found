import App from './App';
import React from 'react';
import LoadingBar from 'react-top-loading-bar';
import { LoadingbarContext } from './util/contexts';

function LoadingBarLayer() {

    let loadingbar = null;
    const startLoadingBar = () => {
        if (loadingbar) {
            loadingbar.continousStart();
        }
    };

    const stopLoadingBar = () => {
        if (loadingbar) {
            loadingbar.complete();
        }
    };

    return (
        <>
            <LoadingbarContext.Provider value={ { startLoadingBar , stopLoadingBar } }>
                <App>
                    <LoadingBar
                        height={ 3 }
                        color='#96020c'
                        onRef={ ref => loadingbar = ref }
                        style={ { position: 'absolute' } }
                    />
                </App>
            </LoadingbarContext.Provider>
        </>

    );
}

export default LoadingBarLayer;
