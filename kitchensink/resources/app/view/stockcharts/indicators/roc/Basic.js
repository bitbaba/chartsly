/**
 * Class to test ROC chart
 */
Ext.define("KS.view.stockcharts.indicators.roc.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-roc',
    requires: [
        'Chartsly.view.test.CandleStick',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Chartsly.chart.indicator.RateOfChange',
        'Chartsly.model.Stock', 
        'Chartsly.store.Apple'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart and Rate Of Change (ROC) indicator'
    ],
    config: {
        items: [
            {
                xtype: 'candlestick-test-chart',
                height: 350,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0}
            },
            {
                xclass: 'Chartsly.chart.indicator.RateOfChange',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'roc',
                        xField: 'date',
                        yField: 'roc',
                        closeField: "close",
                        period: 12,
                        style: {
                            stroke: 'rgba(237,123,43,0.75)',
                            fill: 'rgba(237,123,43,0.1)',
                            miterLimit: 1
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left'
                    },
                    {
                        type: 'time',
                        position: 'bottom',
                        fields: ['date'],
                        style: {
                            strokeStyle: '#666',
                            estStepSize: 150
                        },
                        dateFormat: 'Y',
                        segmenter: {
                            type: 'time',
                            step: {
                                unit: 'y',
                                step: 1
                            }
                        },
                        label: {
                            fontSize: 10,
                            fillStyle: '#666'
                        }
                    }
                ]
            }
        ]
    }
});
