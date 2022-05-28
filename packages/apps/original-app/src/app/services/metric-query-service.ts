import { KDashboardSeries } from '@air/shared-api-spec';
import _ from 'lodash';

export class MetricQueryService {
  public static extractSeries2(
    searchResults: any,
    series: KDashboardSeries,
    mapData: any = null
  ): any[] {
    let extractedSeries = null;

    const resultSelector: string = series['resultSelector'];

    if (resultSelector) {
      const explore: {
        prevPath?: string;
        node: any;
        path: string[];
        keys: any;
      }[] = [
        { node: searchResults, path: resultSelector.split('.'), keys: {} },
      ];

      while (explore.length > 0) {
        const current = explore.shift();
        const path: string[] = current.path;
        const localPath = path[0];

        let nextNodes;
        if (localPath.startsWith('[') || localPath === '*') {
          nextNodes = current.node['buckets'];
        } else {
          const nextNode = current.node[localPath];
          nextNodes = [nextNode];
        }

        for (const nextNode of nextNodes) {
          if (!nextNode) continue;

          if (!extractedSeries) {
            extractedSeries = {};
          }

          let keys = current.keys;
          if (nextNode['key']) {
            keys = _.clone(keys);
            keys[current.prevPath] = nextNode['key'];
          }

          if (localPath.startsWith('[')) {
            const keyFilterValue = localPath.slice(1, -1);
            if (keys[current.prevPath] !== keyFilterValue) {
              continue;
            }
          }

          if (path.length > 1) {
            explore.push({
              prevPath: localPath,
              node: nextNode,
              path: path.slice(1),
              keys: keys,
            });
          } else {
            const finalNode = nextNode;

            let selectedName = '';
            const nameSelector: string = series['nameSelector'];
            if (nameSelector) {
              if (nameSelector.startsWith('keys.')) {
                selectedName = keys[nameSelector.split('.')[1]];
              } else if (nameSelector.startsWith('tags.')) {
                selectedName = _.get(finalNode, nameSelector);
              } else {
                selectedName = nameSelector;
              }
            }

            if (finalNode['key']) {
              keys[localPath] = finalNode['key'];
            }

            const selectedData = [];
            for (const dataSelector of series['dataSelector']) {
              let selectedValue;
              if (dataSelector.startsWith('keys.')) {
                selectedValue = _.get({ keys }, dataSelector);
              } else {
                selectedValue = _.get(finalNode, dataSelector);
              }

              selectedData.push(selectedValue);
            }

            if (!extractedSeries[selectedName]) {
              extractedSeries[selectedName] = {
                name: selectedName,
                data: [],
              };
            }
            extractedSeries[selectedName].data.push(selectedData);
          }
        }
      }
    }

    if (extractedSeries) {
      const extractedValues = Object.values(extractedSeries);
      const mappedExtracted = mapData
        ? extractedValues.map(mapData)
        : extractedValues;

      return mappedExtracted;
    }

    return null;
  }
}
