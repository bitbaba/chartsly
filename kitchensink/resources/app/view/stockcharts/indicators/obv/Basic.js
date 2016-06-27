/**
 * Class to test OBV chart
 */
Ext.define("KS.view.stockcharts.indicators.obv.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-obv',
    requires: [
        'Chartsly.view.test.CandleStick',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Line',
        'Chartsly.chart.indicator.OnBalanceVolume',
        'Chartsly.model.Stock', 
        'Chartsly.store.Apple'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart and On Balance Volume (OBV) indicator'
    ],
    config: {
        items: [
            {
                xtype: 'candlestick-test-chart',
                height: 150,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0}
            },
            {
                xtype: 'cartesian',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                background: 'white',
                store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    title: {
                        text: 'Volume',
                        fontSize: 15
                    },
                    fields: 'volume'
                }, {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        text: 'Date',
                        fontSize: 15
                    },
                    fields: 'date'
                }],
                series: {
                    type: 'bar',
                    xField: 'date',
                    yField: 'volume',
                    style: {
                        fill: 'blue'
                    }
                }
            },
            {
                xclass: 'Chartsly.chart.indicator.OnBalanceVolume',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'obv',
                        xField: 'date',
                        yField: 'obv',
                        closeField: "close",
                        volumeField: "volume",
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
                        position: 'left',
                        title: {
                            text: 'OBV',
                            fontSize: 15
                        }
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
