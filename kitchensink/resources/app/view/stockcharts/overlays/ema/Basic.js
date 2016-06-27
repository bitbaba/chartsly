/**
 * Class to test chart overlays
 */
Ext.define("KS.view.stockcharts.overlays.ema.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-ema',
    requires: [
        'Chartsly.view.test.ExponentialMovingAverage'
    ],
    exampleDescription: [
        'A CandleStick chart with Exponential Moving Average (EMA) overlay.'
    ],
    config: {
        height: 500,
        layout: 'fit',
        items: [
            {
                xtype: 'cs-ema-test-chart'
            }
        ]
    }
});