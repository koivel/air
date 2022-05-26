import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import { MetricQueryService } from '../../../services/metric-query-service';
import Highcharts from 'highcharts';
import { KoivelDashboard } from '../../../contexts/koivel-dashboard-context';
import { KDashboardCard } from '@air/shared-api-spec';

export function HChartPie(props) {
  const card: KDashboardCard = props.cardConfig;

  const defualtChartConfig: any = {
    chart: {
      type: 'pie',
      styledMode: true,
      animation: false,
    },
    title: {
      text: null,
    },
    series: [],
  };

  const chartComponent: any = React.useRef();
  const [chartConfig, setChartConfig] = React.useState(defualtChartConfig);

  const { searchResults } = React.useContext(KoivelDashboard);

  React.useEffect(() => {
    const extractedSeries = MetricQueryService.extractSeries2(
      searchResults,
      props.cardConfig.series[0],
      (series) => {
        return { name: series.name, y: series.data.flat()[0] };
      }
    );
    if (extractedSeries) {
      setChartConfig((c) => {
        return { ...c, series: [{ name: card.title, data: extractedSeries }] };
      });
      chartComponent?.current?.chart?.reflow();
    }
  }, [searchResults, card.title, props.cardConfig.series]);

  React.useEffect(() => {
    chartComponent?.current?.chart?.reflow();
  }, []);

  return (
    <HighchartsReact
      ref={chartComponent}
      highcharts={Highcharts}
      options={chartConfig}
      containerProps={{ style: { height: '100%' } }}
      className="h-max"
    />
  );
}

export default HChartPie;
