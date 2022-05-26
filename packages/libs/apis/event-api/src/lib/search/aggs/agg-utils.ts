import _ from 'lodash';
import { SearchAggGenerator } from './search-agg-generator';

export default class AggUtils {
  public static mapSubBuckets(
    generator: SearchAggGenerator,
    result: any,
    target: any
  ) {
    const resultBuckets = [];
    _.set(target, `buckets`, resultBuckets);
    for (const bucket of result?.['buckets'] || []) {
      const key = bucket['key'];
      const resultBucket = { key: key };
      resultBuckets.push(resultBucket);
      for (const child of generator.children || []) {
        const subPath = `aggs.${child.resultPath}`;
        const childTarget = _.get(resultBucket, subPath) || {};
        child.mapResults(_.get(bucket, child.resultPath), childTarget);
        if (Object.keys(childTarget).length > 0) {
          _.set(resultBucket, subPath, childTarget);
        }
      }
    }

    
    const postProcess = generator.searchBody['postProcess'];
    if (postProcess) {
      postProcess(this, target);
    }
  }
}
