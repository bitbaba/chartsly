/**
 * Class to test chart overlays
 */
Ext.define("KS.view.stockcharts.interactions.annotation.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-annotation',
    requires: [
        'Chartsly.view.test.Annotation'
    ],
    exampleDescription: [
        'A CandleStick chart with Annotation interaction. You may add new annotation by double clicking/tapping. You may move the annotations anywhere on the chart and also edit the annotation text. Finally, you may remove an annotation by clicking/tapping on the Remove button.'
    ],
    config: {
        height: 400,
        layout: 'fit',
        items: [
            {
                xtype: 'cs-annot-test-chart'
            }
        ]
    }
});