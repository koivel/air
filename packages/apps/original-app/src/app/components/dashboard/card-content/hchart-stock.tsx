import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import { MetricQueryService } from '../../../services/metric-query-service';
import Highcharts from 'highcharts/highstock';
import { KoivelDashboard } from '../../../contexts/koivel-dashboard-context';

export function HChartStock(props) {
  const defualtChartConfig: any = {
    accessibility: {
      enabled: false,
    },
    time: {
      useUTC: false,
    },
    chart: {
      type: props.cardConfig?.options?.type || 'column',
      styledMode: true,
      animation: false,
    },
    scrollbar: { enabled: false },
    rangeSelector: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false,
        },
      },
      area: {
        stacking: 'normal',
      },
    },
    xAxis: {
      ordinal: false,
    },
    yAxis: {
      title: {
        text: null,
      },
      stackLabels: {
        enabled: true,
        formatter: function () {
          if (this.total > 1000000) {
            return (this.total / 1000000).toFixed(2) + 'm';
          }
          if (this.total > 1000) {
            return (this.total / 1000).toFixed(1) + 'k';
          }
          return this.total.toFixed(0);
        },
      },
    },
    tooltip: {
      shape: 'square',
      headerShape: 'callout',
      borderWidth: 0,
      shadow: false,
      positioner: function (width, height, point) {
        const chart = this.chart;
        let position;

        if (point.isHeader) {
          position = {
            x: Math.max(
              chart.plotLeft,
              Math.min(
                point.plotX + chart.plotLeft - width / 2,
                chart.chartWidth - width - chart.marginRight
              )
            ),
            y: point.plotY,
          };
        } else {
          position = {
            x: point.series.chart.plotLeft,
            y: point.series.yAxis.top - chart.plotTop,
          };
        }
        return position;
      },
    },
    legend: {
      enabled: false,
    },
    title: {
      text: null,
    },
    navigator: {
      enabled: props.cardConfig?.options?.navigator === true,
    },
    exporting: {
      enabled: false,
    },
    series: [],
  };

  const chartComponent: any = React.useRef();
  const [chartConfig, setChartConfig] = React.useState(defualtChartConfig);

  const { searchResults } = React.useContext(KoivelDashboard);

  React.useEffect(() => {
    const extractedSeries = MetricQueryService.extractSeries2(
      searchResults,
      props.cardConfig.series[0]
    );
    if (extractedSeries) {
      setChartConfig((c) => {
        return { ...c, series: extractedSeries };
      });
      chartComponent?.current?.chart?.reflow();
    }
  }, [searchResults, props.cardConfig.series, props.parentCard]);

  React.useEffect(() => {
    chartComponent?.current?.chart?.reflow();
  }, []);

  return (
    <HighchartsReact
      ref={chartComponent}
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={chartConfig}
      containerProps={{ style: { height: '100%' } }}
      className="h-max"
    />
  );
}

export default HChartStock;
