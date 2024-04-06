import React, { Fragment, useState, useEffect } from "react";
import { Container } from 'reactstrap';
import { includes } from 'lodash';
// import './breadcrumb.css';
// import { MDTApp } from "../../../actions/bootAction";

const Breadcrumb = ({
    config,
    onPageClick,
}) => {
    const [pageList, setPageList] = useState([]);
    const [hidden, setHidden] = useState(false);
    // const portalLink = MDTApp.getSetting('links.login', '', false)
    // const homeLink = MDTApp.getSetting('links.home', '', false);
    useEffect(() => {
        const pageList = getPageList();
        setPageList(pageList);
    }, [config.page, config.breadCrumbs.length])

    const getPageList = () => {
        const { breadCrumbs, page, homeKey } = config;
        const breadCrumb = breadCrumbs[page] ? breadCrumbs[page] : [];
        const homeCrumb = breadCrumbs[homeKey];
        if (breadCrumb.length) {
            const hideOnMobile = breadCrumb.some(item => item.hideOnMobile);
            setHidden(!!hideOnMobile);

            let topCrumbs = [];
            const referrer = document.referrer;
            if(referrer) {
                topCrumbs = [
                    {
                        label: '',
                        referrer,
                    },
                    homeCrumb
                ];
            } else {
                topCrumbs = [
                    homeCrumb
                ];
            }
          return topCrumbs.concat(breadCrumb)
        }
        return [];
      };

    const pagesCount = pageList.length;


    if(!pageList.length) return null;
    return (
        <div id="breadcrumb-nav" role="navigation" aria-label="breadcrumbs" className={'breadcrumb d-sm-block'}>
            <Container className="my-0">
                <ul>
                    {
                        pageList.map((page, index) => {
                            return (
                                <Fragment>
                                    {
                                        page.link && (
                                            <Fragment>
                                                {/* <li className="chevron-li">
                                                    <Icon name="chevron-forward-thin"></Icon>
                                                </li> */}
                                                <li key={index} className={index === pagesCount - 2 ? 'parent-li last-parent': 'parent-li'}>
                                                    <a className="body2 link" href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        onPageClick(page);
                                                    }}>
                                                        {page.label}
                                                    </a>
                                                </li>
                                            </Fragment>
                                        )
                                    }

                                    {
                                        page.referrer && (
                                            <Fragment>
                                                <li key={index} className="referrer">
                                                    <a className="body2 link referrer" href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        // MDTApp.goto(page.referrer);
                                                    }}>
                                                        {/* <Icon name="chevron-back-double"></Icon> */}
                                                    </a>
                                                </li>
                                                {/* <li className="pipe-li">
                                                    <Icon name="pipe-thin"></Icon>
                                                </li> */}
                                            </Fragment>
                                        )
                                    }
                                    {
                                        !(page.link || page.referrer) && (
                                            <Fragment>
                                                {/* <li className="no-link chevron-li">
                                                    <Icon name="chevron-forward-thin"></Icon>
                                                </li> */}
                                                <li className="no-link child-li">
                                                    {page.label}
                                                </li>
                                            </Fragment>
                                        )
                                    }
                                </Fragment>
                            )
                        })
                    }
                </ul>
            </Container>
        </div>
    )
}

export default Breadcrumb;