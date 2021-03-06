/**
 * Class to test chart overlays
 */
Ext.define("KS.view.stockcharts.overlays.envelop.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-env',
    requires: [
        'Chartsly.view.test.MovingAverageEnvelops'
    ],
    exampleDescription: [
        'A CandleStick chart with Moving Average Envelops (MAE) overlay.'
    ],
    config: {
        // height: 400,
        // layout: 'fit',
        items: [
            {
                height: 500,
                xtype: 'cs-maenv-test-chart'
            }
        ]
    }
});