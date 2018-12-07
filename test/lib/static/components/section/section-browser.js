import React from 'react';
import SectionBrowser from 'lib/static/components/section/section-browser';
import {mkConnectedComponent, mkTestResult_, mkImg_} from '../utils';

function mkSectionBrowserComponent({retried, hasReason, initialState}) {
    let browser;
    if (retried) {
        browser = {
            name: 'chrome-phone',
            result: mkTestResult_({
                reason: hasReason ? 'stub reason' : null,
                status: 'skipped',
                attempt: 1,
                imagesInfo: [
                    {
                        status: 'error',
                        reason: {
                            message: 'messageStub',
                            stack: 'stackStub'
                        },
                        actualImg: mkImg_()
                    }
                ]
            }),
            retries: [
                mkTestResult_({
                    reason: {
                        message: 'messageStub',
                        stack: 'stackStub'
                    },
                    status: 'error',
                    attempt: 0
                })
            ]
        };
    } else {
        browser = {
            name: 'chrome-phone',
            result: {
                reason: hasReason ? 'stub reason' : null,
                name: 'chrome-phone',
                status: 'skipped'
            }
        };
    }

    const suite = {
        name: 'nameStub',
        suitePath: ['suitePartStub'],
        browsers: [browser],
        status: 'skipped'
    };

    return mkConnectedComponent(
        <SectionBrowser browser={browser} suite={suite} />,
        {initialState}
    );
}

describe('<SectionBrowser/>', () => {
    it('should show "[skipped]" tag in title for skipped test', () => {
        const component = mkSectionBrowserComponent({
            hasReason: false,
            retried: false
        });

        assert.equal(
            component
                .find('.section__title')
                .first()
                .text(),
            '[skipped] chrome-phone'
        );
        assert.lengthOf(component.find('[title="view in browser"]'), 0);
        assert.lengthOf(component.find('.section__body'), 0);
    });

    it('should show reason for skipped test', () => {
        const component = mkSectionBrowserComponent({
            hasReason: true,
            retried: false
        });

        assert.equal(
            component
                .find('.section__title')
                .first()
                .text(),
            '[skipped] chrome-phone, reason: stub reason'
        );
        assert.lengthOf(component.find('[title="view in browser"]'), 0);
        assert.lengthOf(component.find('.section__body'), 0);
    });

    it('should show button "view in browser" for skipped test with retries', () => {
        const component = mkSectionBrowserComponent({
            hasReason: false,
            retried: true
        });

        assert.equal(
            component
                .find('.section__title')
                .first()
                .text(),
            '[skipped] chrome-phone'
        );
        assert.lengthOf(component.find('[title="view in browser"]'), 1);
        assert.lengthOf(component.find('.section__body'), 0);
    });

    it('should show reason for skipped test with retries', () => {
        const component = mkSectionBrowserComponent({
            hasReason: true,
            retried: true
        });

        assert.equal(
            component
                .find('.section__title')
                .first()
                .text(),
            '[skipped] chrome-phone, reason: stub reason'
        );
        assert.lengthOf(component.find('[title="view in browser"]'), 1);
        assert.lengthOf(component.find('.section__body'), 0);
    });

    it('should show attempts for skipped test with retries', () => {
        const component = mkSectionBrowserComponent({
            hasReason: true,
            retried: true,
            initialState: {view: {expand: 'all'}}
        });

        assert.equal(
            component
                .find('.section__title')
                .first()
                .text(),
            '[skipped] chrome-phone, reason: stub reason'
        );
        assert.lengthOf(component.find('[title="view in browser"]'), 1);
        assert.lengthOf(component.find('.section__body'), 1);
    });
});
