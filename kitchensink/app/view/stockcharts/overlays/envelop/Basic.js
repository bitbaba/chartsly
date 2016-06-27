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
        'A CandleStick chart with Moving Average Envelopes (MAE) overlay.'
    ],
    config: {
        height: 500,
        layout: 'fit',
        items: [
            {
                xtype: 'cs-maenv-test-chart'
            }
        ]
    }
});