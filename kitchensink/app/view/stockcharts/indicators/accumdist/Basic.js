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
        'Chartsly.model.YahooFinance',
        'Chartsly.store.YahooFinances',
        'Setu.Util'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart and Accumulation Distribution Line (ADL) indicator'
    ],
    config: {
        items: [
            {
                xtype: 'candlestick-test-chart',
                height: 200,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0}
            },
            {
                xtype: 'cartesian',
                height: 200,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                store:'YahooFinances',
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    fields: ['volume'],
                    title: {
                        text: 'Volume',
                        fontSize: 15
                    },
                    /*renderer: function() {
                        return "";
                    }*/
                },
                {
                    //type: 'time',
                    type: 'category',
                    fields: ['date'],
                    position: 'bottom',
                    background: {
                        fill: 'gray'
                    },
                    //visibleRange: [0.5, 0.9],
                    style: {
                        axisLine: false,
                        strokeStyle: '#888',
                        textPadding: 10,
                        estStepSize: 50,
                    },
                    label: {
                       fontWeight: '300',
                       fontSize: '13px',
                       fontFamily:'helvetica,arial,verdana,sans-serif',
                       rotate: {
                          degrees: 290
                       }
                    },
                    renderer: function (value, layoutContext, lastValue) {
                        return Ext.Date.format(new Date(value), 'Y-m-d');
                    }
                    //dateFormat:"Y-m-d"
                    /*renderer: function (value, layoutContext, lastValue) {
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
                    }*/
                }],
                series: [{
                    type: 'area',
                    xField: 'date',
                    yField: 'volume',
                    marker: {
                        opacity: 1,
                        scaling: 0.2,
                        fillStyle : '#E3742D',
                        fx: {
                            duration: 20,
                            easing: 'easeOut'
                        }
                    },
                    highlightCfg: {
                        opacity: 1,
                        scaling: 1.5
                    },
                    tooltip: {
                        trackMouse: true,
                        style:{
                            backgroundColor:'#fff',
                            border:'2px solid #E3742D',
                            fontFamily:'Helvetica',
                        },
                        renderer: function(tooltip,record, item) {
                            var open = Util.formatNumber(record.get('open'),"0.0000");
                            var close = Util.formatNumber(record.get('close'),"0.0000");
                            var high = Util.formatNumber(record.get('high'),"0.0000");
                            var low = Util.formatNumber(record.get('low'),"0.0000");
                            var volume = record.get('volume');
                            tooltip.setHtml('<table>'+'<tr>'+'<td>'+'Open:'+'</td>'+'<td>'+'$'+open+'</td>'+'</tr>'+'<tr>'+'<td>'+'Close:'+'</td>'+'<td>'+'$'+close+'</td>'+'</tr>'+'<tr>'+'<td>'+'High:'+'</td>'+'<td>'+'$'+high+'</td>'+'</tr>'+'<tr>'+'<td>'+'Low:'+'</td>'+'<td>'+'$'+low+'</td>'+'</tr>'+'<tr>'+'<td>'+'Volume:'+'</td>'+'<td>'+'$'+volume+'</td>'+'</tr>'+'</table>');
                        }
                    }
                }]
            },
            {
                xclass: 'Chartsly.chart.indicator.AccumulationDistributionLine',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                background: 'white',
                series: [
                    {
                        store: 'YahooFinances', //'Apple',
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
                        },
                        marker: {
                            opacity: 1,
                            scaling: 0.2,
                            fillStyle : '#E3742D',
                            fx: {
                                duration: 20,
                                easing: 'easeOut'
                            }
                        },
                        highlightCfg: {
                            opacity: 1,
                            scaling: 1.5
                        },
                        tooltip: {
                            trackMouse: true,
                            style:{
                                backgroundColor:'#fff',
                                border:'2px solid #E3742D',
                                fontFamily:'Helvetica',
                            },
                            renderer: function(tooltip,record, item) {
                                var open = Util.formatNumber(record.get('open'),"0.0000");
                                var close = Util.formatNumber(record.get('close'),"0.0000");
                                var high = Util.formatNumber(record.get('high'),"0.0000");
                                var low = Util.formatNumber(record.get('low'),"0.0000");
                                var volume = record.get('volume');
                                tooltip.setHtml('<table>'+'<tr>'+'<td>'+'Open:'+'</td>'+'<td>'+'$'+open+'</td>'+'</tr>'+'<tr>'+'<td>'+'Close:'+'</td>'+'<td>'+'$'+close+'</td>'+'</tr>'+'<tr>'+'<td>'+'High:'+'</td>'+'<td>'+'$'+high+'</td>'+'</tr>'+'<tr>'+'<td>'+'Low:'+'</td>'+'<td>'+'$'+low+'</td>'+'</tr>'+'<tr>'+'<td>'+'Volume:'+'</td>'+'<td>'+'$'+volume+'</td>'+'</tr>'+'</table>');
                            }
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
                           fontWeight: '300',
                           fontSize: '13px',
                           fontFamily:'helvetica,arial,verdana,sans-serif',
                        }
                    }
                ]
            }
        ]
    }
});
