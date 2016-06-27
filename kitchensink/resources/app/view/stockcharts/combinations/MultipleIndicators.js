/**
 * Class to test MACD and William %R chart
 */
Ext.define("KS.view.stockcharts.combinations.MultipleIndicators", {
    extend: 'Ext.Panel',
    xtype: 'basic-combo-multi-indicators',
    requires: [
        'Chartsly.view.test.CandleStick',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Line',
        'Chartsly.chart.indicator.WilliamPctR',
        'Chartsly.chart.indicator.MovingAverageConvergenceDivergence',
        'Chartsly.model.Stock', 
        'Chartsly.store.Apple'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart with William %R and MACD indicators'
    ],
    config: {
        items: [
            {
                xtype: 'candlestick-test-chart',
                height: 350,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0}
            },
            {
                xclass: 'Chartsly.chart.indicator.WilliamPctR',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                insetPadding: {
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'williampctr',
                        xField: 'date',
                        yField: 'pctr',
                        highField: "high",
                        lowField: "low",
                        closeField: "close",
                        overboughtLevel: -20,
                        oversoldLevel: -80,
                        lookBackPeriod: 14,  //in days
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
            },
            {
                xclass: 'Chartsly.chart.MACD',
                height: 250,
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'macd',
                        xField: 'date',
                        yField: 'macd',
                        closeField: "close",
                        period1: 12,
                        period2: 26,
                        signalPeriod: 9,
                        smooth: true,
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
                        type: 'category',   //FIXME: Bar series does not render for 'time' type. SDK seems to have an issue
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
