/**
 * Class to test Fast Stochastic Oscillator chart
 */
Ext.define("KS.view.stockcharts.indicators.faststoch.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-fast-stoch',
    requires: [
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
	'Chartsly.view.test.CandleStick',
        'Chartsly.chart.indicator.FastStochasticOscillator',
        'Chartsly.model.Stock', 
        'Chartsly.store.Apple'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart and Fast Stochastic Oscillator indicator'
    ],
    config: {
        items: [
	     {
	        xtype: 'candlestick-test-chart',
	        height: 350,
	        innerPadding : {top: 0, left: 0, right: 10, bottom: 0}
	    },	
            {
                xclass: 'Chartsly.chart.indicator.FastStochasticOscillator',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                insetPadding: {
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 0
                },
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'faststochasticoscillator',
                        xField: 'date',
                        yField: 'pctk',
                        closeField: "close",
                        highField: "high",
                        lowField: "low",
                        overboughtLevel: 80,
                        oversoldLevel: 30,
                        lookBackPeriod: 14,  //in days
                        smaDays: 3,  //in days
                        style: {
                            stroke: 'red',
                            fill: 'red',
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
