/**
 * Class to test TRIX chart
 */
Ext.define("KS.view.stockcharts.indicators.trix.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-trix',
    requires: [
        'Chartsly.view.test.CandleStick',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Chartsly.chart.indicator.TRIX',
        'Chartsly.model.Stock', 
        'Chartsly.store.Apple'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart and TRIX indicator'
    ],
    config: {
        items: [
            {
                xtype: 'candlestick-test-chart',
                height: 350,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0}
            },
            {
                xclass: 'Chartsly.chart.indicator.TRIX',
                height: 250,
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'trix',
                        xField: 'date',
                        yField: 'trix',
                        closeField: "close",
                        period: 15,
                        signalPeriod: 9,
                        style: {
                            stroke: 'rgba(67,174,175,0.75)',
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
