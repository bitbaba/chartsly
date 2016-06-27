/**
 * Class to test chart overlays
 */
Ext.define("KS.view.stockcharts.overlays.psar.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-psar',
    requires: [
        'Chartsly.view.test.ParabolicSAR'
    ],
    exampleDescription: [
        'A CandleStick chart with Parabolic SAR (PSAR) overlay.'
    ],
    config: {
        height: 500,
        layout: 'fit',
        items: [
            {
                xtype: 'cs-psar-test-chart'
            }
        ]
    }
});