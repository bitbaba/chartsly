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
        'Chartsly.model.YahooFinance',
        'Chartsly.store.YahooFinances',
        'Setu.Util'
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
                        store: 'YahooFinances', //'Apple',
                        type: 'trix',
                        xField: 'date',
                        yField: 'trix',
                        closeField: "close",
                        period: 15,
                        signalPeriod: 9,
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
                        },
                        renderer:function(val){
                            if (val==0){
                                return Ext.util.Format.number(val,'0');
                            }else{
                                return Ext.util.Format.number(val,'0.00');
                            }
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
