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
         'Chartsly.model.YahooFinance',
        'Chartsly.store.YahooFinances',
        'Setu.Util'
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
                store: 'YahooFinances', //'Apple',
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    title: {
                        text: 'Volume',
                        fontSize: 15
                    },
                    fields: 'volume',
                    label: {
                           fontWeight: '300',
                           fontSize: '13px',
                           fontFamily:'helvetica,arial,verdana,sans-serif'
                    }
                }, {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        text: 'Date',
                        fontSize: 15
                    },
                    fields: 'date',
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
                }],
                series: [{
                    type: 'bar',
                    xField: 'date',
                    yField: 'volume',
                    style: {
                        fill: 'blue'
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
                }]
            },
            {
                xclass: 'Chartsly.chart.indicator.OnBalanceVolume',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                background: 'white',
                series: [
                    {
                        store: 'YahooFinances', //'Apple',
                        type: 'obv',
                        xField: 'date',
                        yField: 'obv',
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
                            text: 'OBV',
                            fontSize: 15
                        },
                        label: {
                           fontWeight: '300',
                           fontSize: '13px',
                           fontFamily:'helvetica,arial,verdana,sans-serif',
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
