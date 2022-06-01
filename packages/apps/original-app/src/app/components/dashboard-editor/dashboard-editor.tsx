import { JsonEditor } from 'jsoneditor-react';
import { useContext, useEffect, useRef, useState } from 'react';

import { KoivelDashboardEditor } from '../../contexts/koivel-dashboard-editor';
import DashboardSideEditor from './dashboard-side-editor';

const DashboardEditor = () => {
  const { dashboardJson, setDashboardJson } = useContext(KoivelDashboardEditor);
  const queryJsonEditor = useRef(null);

  useEffect(() => {
    setDashboardJson({
      _id: 'runelite-demo',
      displayName: 'OSRS Skill Gains',
      collectionId: 'runescape',
      description:
        'Uses the Runelite Koivel plugin to track and display your XP gains and other stats!',
      backgroundImage:
        'https://www.spieltimes.com/wp-content/uploads/2019/10/osrs.jpg',
      perms: ['dashboards:read:userId:*'],
      tags: ['runescape', 'runelite', 'xp'],
      searches: [
        {
          key: 'search1',
          collectionId: 'runescape',
          must: [
            {
              type: 'Equals',
              options: {
                field: 'groupId',
                value: 'total_xp',
              },
            },
          ],
          aggs: {
            rsSkills: {
              type: 'GroupByTags',
              options: {
                tags: ['skillName'],
              },
              aggs: {
                minMax: {
                  type: 'MinMax',
                  options: {
                    diff: true,
                  },
                },
                '60MAgg': {
                  type: 'MixMaxTimeseries',
                  options: {
                    calInterval: 'hour',
                    serialDiff: true,
                  },
                },
                '10MAgg': {
                  type: 'MixMaxTimeseries',
                  options: {
                    fixedInterval: '10m',
                    serialDiff: true,
                  },
                },
                '1DAgg': {
                  type: 'MixMaxTimeseries',
                  options: {
                    calInterval: 'day',
                    serialDiff: true,
                  },
                },
              },
            },
          },
        },
        {
          key: 'search2',
          collectionId: 'runescape',
          must: [
            {
              type: 'Equals',
              options: {
                field: 'groupId',
                value: 'total_level',
              },
            },
          ],
          aggs: {
            rsSkills: {
              type: 'GroupByTags',
              options: {
                tags: ['skillName'],
              },
              aggs: {
                minMax: {
                  type: 'MinMax',
                  options: {
                    diff: true,
                  },
                },
                '60MAgg': {
                  type: 'MixMaxTimeseries',
                  options: {
                    calInterval: 'hour',
                    serialDiff: true,
                  },
                },
                '10MAgg': {
                  type: 'MixMaxTimeseries',
                  options: {
                    fixedInterval: '10m',
                    serialDiff: true,
                  },
                },
                '1DAgg': {
                  type: 'MixMaxTimeseries',
                  options: {
                    calInterval: 'day',
                    serialDiff: true,
                  },
                },
              },
            },
          },
        },
      ],
      cards: [
        {
          title: 'XP Gains/10m',
          type: 'hchart-stock',
          className: 'lg:col-span-3',
          options: {
            navigator: true,
          },
          series: [
            {
              resultSelector: 'search1.aggs.rsSkills.*.aggs.10MAgg.*',
              dataSelector: ['keys.10MAgg', 'values.serialDiff'],
              nameSelector: 'keys.rsSkills',
            },
          ],
        },
        {
          title: 'Total XP Gained',
          type: 'hchart-pie',
          series: [
            {
              resultSelector: 'search1.aggs.rsSkills.*.aggs.minMax',
              dataSelector: ['values.diff'],
              nameSelector: 'keys.rsSkills',
            },
          ],
        },
        {
          title: 'XP Gains/Hour',
          type: 'hchart-stock',
          options: {
            type: 'line',
          },
          series: [
            {
              resultSelector: 'search1.aggs.rsSkills.*.aggs.60MAgg.*',
              dataSelector: ['keys.60MAgg', 'values.serialDiff'],
              nameSelector: 'keys.rsSkills',
            },
          ],
        },
        {
          title: 'Level Gains',
          type: 'ktable',
          className: 'lg:row-span-2',
          options: {
            headers: ['Skill', 'Start', 'End', 'Gained'],
          },
          series: [
            {
              resultSelector: 'search2.aggs.rsSkills.*.aggs.minMax',
              dataSelector: ['values.min', 'values.max', 'values.diff'],
              nameSelector: 'keys.rsSkills',
            },
          ],
        },
        {
          title: 'Level Gains/Hour',
          type: 'hchart-stock',
          options: {
            navigator: true,
          },
          series: [
            {
              resultSelector: 'search2.aggs.rsSkills.*.aggs.60MAgg.*',
              dataSelector: ['keys.60MAgg', 'values.serialDiff'],
              nameSelector: 'keys.rsSkills',
            },
          ],
        },
        {
          title: 'XP Gains/Day',
          type: 'hchart-stock',
          series: [
            {
              resultSelector: 'search1.aggs.rsSkills.*.aggs.1DAgg.*',
              dataSelector: ['keys.1DAgg', 'values.serialDiff'],
              nameSelector: 'keys.rsSkills',
            },
          ],
        },
      ],
    });
  }, [setDashboardJson]);

  useEffect(() => {
    queryJsonEditor.current?.jsonEditor?.set(dashboardJson);
  }, [dashboardJson, queryJsonEditor.current?.jsonEditor]);

  return (
    <div className="h-full grid grid-cols-2">
      <DashboardSideEditor />
      <JsonEditor ref={queryJsonEditor} mode="code" value={{}} />
    </div>
  );
};

export default DashboardEditor;
