import React, { Suspense, lazy } from 'react';
import { connect } from 'react-redux';

// import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Switcher = ({ page, direction }) => {

    const UniversalComponent = lazy(() => import(`./${page}/index.js`));

    return <Suspense
        fallback={
            <div className="spinner">
                <div />
            </div>
        }
    >
        <UniversalComponent />
    </Suspense>
};

const mapState = ({ page, direction }) => {
    return { page, direction };
};

export default connect(mapState)(Switcher);
