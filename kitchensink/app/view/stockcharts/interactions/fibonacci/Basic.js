/**
 * Class to test chart overlays
 */
Ext.define("KS.view.stockcharts.interactions.fibonacci.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-fibonacci',
    requires: [
        'Chartsly.view.test.FibonacciRetracements'
    ],
    exampleDescription: [
        'A CandleStick chart with Fibonacci interaction. You may start the interaction with drag to draw the Fibonacci levels'
    ],
    config: {
        height: 400,
        layout: 'fit',
        items: [
            {
                xtype: 'cs-fibonacci-test-chart'
            }
        ]
    }
});