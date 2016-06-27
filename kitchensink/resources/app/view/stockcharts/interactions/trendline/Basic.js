/**
 * Class to test chart overlays
 */
Ext.define("KS.view.stockcharts.interactions.trendline.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-trendline',
    requires: [
        'Chartsly.view.test.Trendline'
    ],
    exampleDescription: [
        'A CandleStick chart with Trendline interaction. You may add a new trendline using drag and you can add any number of trendlines to a chart.'
    ],
    config: {
        height: 400,
        layout: 'fit',
        items: [
            {
                xtype: 'cs-tline-test-chart'
            }
        ]
    }
});