/**
 * Class to test MACD and William %R chart
 */
Ext.define("KS.view.stockcharts.combinations.MixOfAll", {
    extend: 'Ext.Panel',
    xtype: 'basic-combo-all',
    requires: [
        'Chartsly.view.test.CandleStick',
        'KS.store.CandleStick',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Ext.chart.interactions.ItemHighlight',
        'Chartsly.chart.indicator.WilliamPctR',
        'Chartsly.chart.indicator.MovingAverageConvergenceDivergence',
        'Chartsly.model.YahooFinance',
        'Chartsly.store.YahooFinances',
        'Setu.Util'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart with PSAR and Bollinger Bands, which has got Annotation and Events, and two indicators - MACD and William %R'
    ],
    config: {
        items: [
            {
                xtype: 'chart',
                height: 300,
                background: 'white',
                insetPadding: {
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                interactions: {
                    type: 'annotation'
                },
                listeners: {
                    annotationupdated: function(chart, annotText, sprite) {
                           Ext.Msg.alert({message:'Annotation Updated: ' + annotText,
                               buttons: Ext.Msg.OK,
                               closable : true
                           });
                   },
                   annotationmoved: function(chart, sprite) {
                       Ext.Msg.alert({message:'Annotation moved to: ' + sprite.attr.x + ':' + sprite.attr.y,
                           buttons: Ext.Msg.OK,
                           closable : true
                       });
                 }
                },
                series: [{
                        store: Ext.create('Chartsly.store.AppleDividend', {}),
                        type: 'event',
                        eventType: 'dividend',
                        xField: 'date',
                        yField: 'dividend'
                    }, {
                        store: Ext.create('Chartsly.store.AppleBonus', {}),
                        type: 'event',
                        eventType: 'bonus',
                        xField: 'date',
                        yField: 'bonus'
                    }, {
                        store: Ext.create('Chartsly.store.AppleDividend', {}),
                        type: 'event',
                        eventType: 'split',
                        xField: 'date',
                        yField: 'dividend'
                    },{
                        store: 'YahooFinances', //'Google',
                        type: 'parabolicsar',
                        highField: 'high',
                        lowField: 'low',
                        style: {
                            stroke: 'none'
                        },
                        xField: 'date',
                        yField: 'sar',
                        marker: {
                            type: 'path',
                            path: ['M', -0.5, 0, 0, 0.5, 0.5, 0, 0, -0.5, 'Z'],
                            stroke: 'red',
                            lineWidth: 0
                        }
                    },{
                        store: 'YahooFinances', //'Google',
                        type: 'bbands',
                        closeField: 'close',
                        period: 15,
                        bandGap: 5,
                        style: {
                            stroke: 'rgb(187, 175, 174)',
                            lineDash: [5, 5]
                        },
                        xField: 'date',
                        yField: 'bband'
                    }, {
                        store: 'YahooFinances', //'Google',
                        type: 'bbands',
                        closeField: 'close',
                        period: 15,
                        bandGap: 5,
                        style: {
                            stroke: 'rgb(67, 175, 174)'
                        },
                        xField: 'date',
                        yField: 'upperbband'
                    }, {
                        store: 'YahooFinances', //'Google',
                        type: 'bbands',
                        closeField: 'close',
                        period: 15,
                        bandGap: 5,
                        style: {
                            stroke: 'rgb(67, 175, 174)'
                        },
                        xField: 'date',
                        yField: 'lowerbband'
                    },
                    {
                        store: Ext.create('KS.store.CandleStick',{}),
                        type: 'candlestick',
                        xField: 'date',
                        openField: 'Open',
                        highField: 'High',
                        lowField: 'Low',
                        closeField: 'Close',
                        style: {
                            barWidth: 10,
                            opacity: 0.9,
                            dropStyle: {
                                fill: 'rgb(228,124,124)',
                                stroke: 'rgb(228,124,124)'
                            },
                            raiseStyle: {
                                fill: 'rgb(67,175,174)',
                                stroke: 'rgb(67,175,174)'
                            }
                        },
                        aggregator: {
                            stretagy: 'time'
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
                        fields: ['open', 'high', 'low', 'close', 'bband', 'upperbband', 'lowerbband'],
                        position: 'left',
                        style: {
                            floating: true,
                            strokeStyle: '#666',
                            estStepSize: 40
                        },
                        label: {
                           fontWeight: '300',
                           fontSize: '13px',
                           fontFamily:'helvetica,arial,verdana,sans-serif'
                        },
                        background: {
                            fill: {
                                type: 'linear',
                                degrees: 180,
                                stops: [
                                    {
                                        offset: 0.3,
                                        color: 'white'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(255,255,255,0)'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: 'time',
                        fields: ['date'],
                        position: 'bottom',
                        background: {
                            fill: 'gray'
                        },
                        //visibleRange: [0.5, 0.9],
                        style: {
                            strokeStyle: '#888',
                            estStepSize: 50,
                            textPadding: 10
                        },
                        label: {
                           fontWeight: '300',
                           fontSize: '13px',
                           fontFamily:'helvetica,arial,verdana,sans-serif',
                           rotate: {
                              // degrees: 290
                           }
                        },
                        dateFormat:"M"
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
                    }
                ]
            },
            {
                xclass: 'Chartsly.chart.MACD',
                height: 250,
                background: 'white',
                series: [
                    {
                        store: 'YahooFinances', //'Apple',
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
                        label: {
                           fontWeight: '300',
                           fontSize: '13px',
                           fontFamily:'helvetica,arial,verdana,sans-serif'
                        }
                    },
                    {
                        type: 'time',   //FIXME: Bar series does not render for 'time' type. SDK seems to have an issue
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
                           fontFamily:'helvetica,arial,verdana,sans-serif'
                        },
                        renderer: function (value, layoutContext, lastValue) {
                            return Ext.Date.format(new Date(value), 'Y');
                        }
                    }
                ]
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
                        store: 'YahooFinances', //'Apple',
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
                        label: {
                           fontWeight: '300',
                           fontSize: '13px',
                           fontFamily:'helvetica,arial,verdana,sans-serif'
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
                           fontFamily:'helvetica,arial,verdana,sans-serif'
                        }
                    }
                ]
            }
        ]
    }
});
