/**
 * Class to test ADL chart
 */
Ext.define("KS.view.stockcharts.indicators.accumdist.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-accumdist',
    requires: [
        'Chartsly.view.test.CandleStick',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Chartsly.chart.indicator.AccumulationDistributionLine',
        'Chartsly.model.Stock', 
        'Chartsly.store.Apple'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart and Accumulation Distribution Line indicator'
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
                height: 200,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                store: Ext.create('Chartsly.store.Apple', {}),
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    fields: ['volume'],
                    title: {
                        text: 'Volume',
                        fontSize: 15
                    },
                    renderer: function() {
                        return "";
                    }
                },
                {
                    type: 'time',
                    fields: ['date'],
                    position: 'bottom',
                    background: {
                        fill: 'gray'
                    },
                    visibleRange: [0.5, 0.9],
                    style: {
                        axisLine: false,
                        strokeStyle: '#888',
                        textPadding: 10
                    },
                    label: {
                        fontWeight: '700',
                        fillStyle: '#666'
                    },
                    renderer: function (value, layoutContext, lastValue) {
                        var month, day;
                        switch (layoutContext.majorTicks.unit) {
                            case Ext.Date.YEAR:
                                return Ext.Date.format(value, 'Y');
                            case Ext.Date.MONTH:
                                month = Ext.Date.format(value, 'M');
                                if (month === 'Jan') {
                                    return Ext.Date.format(value, 'Y');
                                } else {
                                    return month;
                                }
                                break;
                            case Ext.Date.DAY:
                                day = Ext.Date.format(value, 'j');
                                if (lastValue && value.getMonth() !== lastValue.getMonth()) {
                                    month = Ext.Date.format(value, 'M');
                                    if (month === 'Jan') {
                                        return Ext.Date.format(value, 'M j y');
                                    } else {
                                        return Ext.Date.format(value, 'M j');
                                    }
                                } else {
                                    return day;
                                }
                                break;
                            default:
                                return Ext.Date.format(value, 'h:i:s');
                        }
                    }
                }],
                series: {
                    type: 'area',
                    xField: 'date',
                    yField: 'volume'
                }
            },
            {
                xclass: 'Chartsly.chart.indicator.AccumulationDistributionLine',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'adl',
                        xField: 'date',
                        yField: 'adl',
                        highField: "high",
                        lowField: "low",
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
                            text: 'ADL',
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
