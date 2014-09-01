/**
 * @class Chartsly.series.indicator.MovingAverageConvergenceDivergence
 * @extends Ext.chart.series.Cartesian
 *
 * MovingAverageConvergenceDivergence series that iterates the store records and 
 * calculates the MACD and its signal value based on the below formula:
 * 1. MACD Line: (12-day EMA - 26-day EMA) 
 * 2. Signal Line: 9-day EMA of MACD Line
 * 
 * The calculated MACD value is set as "macd" field on the record and the signal value is
 * set as "sigmacd" on the record
 *
 * TODO: Draw the Histogram
 */
Ext.define('Chartsly.series.indicator.MovingAverageConvergenceDivergence', {
    extend: 'Ext.chart.series.Cartesian',
    alias: 'series.macd',
    seriesType: 'lineSeries',  //sprite type for this series

    config: {
        /*
         * Data field containing the close value. Defaults to "close"
         */
        closeField: "close",
        /*
         * First period to calculate EMA of close price. Defaults to 12
         */
        period1: 12,
        /*
         * Secoond period to calculate EMA of close price. Defaults to 26
         */
        period2: 26,
        /*
         * Period to calculate EMA for MACD Signal. Defaults to 9
         */
        signalPeriod: 9
    },

    /*
     * Creats a MACD series
     * @param {Object} [config] Configuration
     */
    constructor: function (config) {

        var me = this;

        var st = Ext.data.StoreManager.lookup(config.store);
        var recs = st.getRange();
        var closes = Ext.Array.pluck(Ext.Array.pluck(recs, "data"), config.closeField);

        var p1 = config.period1, ema1Arr = [], ema1 = 0, prevEma1;
        var p2 = config.period2, ema2Arr = [], ema2 = 0, prevEma2;
        var sp = config.signalPeriod, ema3 = 0, prevEma3;
        var close, macd, macdArr = [];

        var mult1 = 2/(p1 + 1);
        var mult2 = 2/(p2 + 1);
        var mult3 = 2/(sp + 1);

        st.each(function (item, index, length) {
            close = item.data[config.closeField];

            //Calculate MACD
            if (index >= p1) {
                if (index == p1) {
                    ema1 = Ext.Array.mean(Ext.Array.slice(closes, 0, index));
                } else {
                    ema1 = (close - prevEma1) * mult1 + prevEma1;
                }

                prevEma1 = ema1;
            }

            if (index >= p2) {
                if (index == p2) {
                    ema2 = Ext.Array.mean(Ext.Array.slice(closes, 0, index));
                } else {
                    ema2 = (close - prevEma2) * mult2 + prevEma2;
                }

                prevEma2 = ema2;
            }

            //MACD Line: (12-day EMA - 26-day EMA)
            if (ema1 && ema2) { //this is not clear whether we shall consider the records where p1 < p2. TODO: verify from other resources
                macd = ema1 - ema2;
                item.data.macd = macd;
                macdArr.push(macd);

                // console.log('MACD: ' + item.data.macd);
            }

            //Calculate MACD Signal line
            //Signal Line: 9-day EMA of MACD Line
            var l = macdArr.length;
            var maxP = Ext.Array.max([p1, p2]);
            var p = maxP + sp;
            if (index >= p) {
                if (index == p) {
                    ema3 = Ext.Array.mean(Ext.Array.slice(macdArr, 0, sp));
                } else {
                    ema3 = (macd - prevEma3) * mult3 + prevEma3;
                }

                prevEma3 = ema3;

                item.data.sigmacd = ema3;
            }


        });

        this.callParent(arguments);
    }

});