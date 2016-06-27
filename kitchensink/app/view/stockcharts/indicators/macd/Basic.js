/**
 * Class to test MACD chart
 */
Ext.define("KS.view.stockcharts.indicators.macd.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-macd',
    requires: [
        'Chartsly.view.test.CandleStick',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Line',
        'Chartsly.chart.indicator.MovingAverageConvergenceDivergence',
        'Chartsly.model.YahooFinance',
        'Chartsly.store.YahooFinances',
        'Setu.Util'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart and Moving Average Convergence Divergence (MACD) indicator'
    ],
    config: {
        items: [
            {
                xtype: 'candlestick-test-chart',
                height: 350,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0}
            },
            {
                xclass: 'Chartsly.chart.MACD',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
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
                           fontFamily:'helvetica,arial,verdana,sans-serif',
                        }
                    },
                    {
                        type: 'category',   //FIXME: Bar series does not render for 'time' type. SDK seems to have an issue
                        position: 'bottom',
                        fields: ['date'],
                        style: {
                            strokeStyle: '#666',
                            estStepSize: 150
                        },
                        segmenter: {
                            type: 'time',
                            step: {
                                unit: 'y',
                                step: 1
                            }
                        },
                        //dateFormat: 'Y',
                        label: {
                           fontWeight: '300',
                           fontSize: '13px',
                           fontFamily:'helvetica,arial,verdana,sans-serif',
                        },
                        renderer: function (value, layoutContext, lastValue) {
                            return Ext.Date.format(new Date(value), 'Y');
                        }
                    }
                ]
            }
        ]
    }
});
