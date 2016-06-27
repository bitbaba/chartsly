/**
 * Class to test chart crosshair
 */
Ext.define("KS.view.stockcharts.interactions.crosshair.Basic", {
    extend: 'Ext.Panel',
    xtype: 'basic-crosshair',
    requires: [
        'Ext.chart.interactions.Crosshair',
    ],
    exampleDescription: [
        'A CandleStick chart with Crosshair interaction. You may start the interaction with drag to see the crosshair lines.'
    ],
    config: {
        height: 400,
        layout: 'fit',
        items: {
            xtype: 'candlestick-test-chart',
            innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
            interactions: {
                type: 'crosshair',
                axes: {
                    left: {
                        label: {
                            fillStyle: 'white'
                        },
                        rect: {
                            fillStyle: 'brown',
                            radius: 6
                        }
                    },
                    bottom: {
                        label: {
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }
                    }
                },
                lines: {
                    horizontal: {
                        strokeStyle: 'brown',
                        lineWidth: 2,
                        lineDash: [20, 2, 2, 2, 2, 2, 2, 2]
                    }
                }
            }
        }
    }
});
