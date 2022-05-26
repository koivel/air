import { BuildExecutorSchema } from './schema';

import type { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ObjUtils } from './obj-utils';
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

export interface EchoExecutorOptions {
  textToEcho: string;
}

export default async function runExecutor(
  options: EchoExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const projectRoot: string =
    context.workspace.projects[context.projectName].root;
  const apps = Object.values(context.workspace.projects).filter(
    (project) =>
      project.root.startsWith('packages/apps/') ||
      project.root.startsWith('packages/libs/')
  );
  const result: any = yaml.safeLoad(
    fs.readFileSync(
      'packages/libs/shared-api-spec/spec/base.openapi.yml',
      'utf8'
    )
  );
  for (const app of apps) {
    const specPath = path.join(app.root, 'spec', 'api-spec.openapi.yml');
    if (fs.existsSync(specPath)) {
      const openApi = yaml.safeLoad(fs.readFileSync(specPath, 'utf8'));

      const pathPrefix = openApi['servers']?.[0]?.['url'] || '';
      ObjUtils.mergeProperty(openApi, result, 'paths', true, null, pathPrefix);

      ['components.responses', 'components.parameters'].forEach(
        (prop) => ObjUtils.mergeProperty(openApi, result, prop, true)
      );

      ObjUtils.mergeProperty(
        openApi,
        result,
        'tags',
        false,
        (a, b) => a['name'] === b['name']
      );
    }

    const modelsPath = path.join(app.root, 'spec', 'models');
    if (fs.existsSync(modelsPath)) {
      const modelFiles = fs.readdirSync(modelsPath);
      for (const modelFile of modelFiles) {
        const modelsPath = path.join(app.root, 'spec', 'models', modelFile);
        const models = yaml.safeLoad(fs.readFileSync(modelsPath, 'utf8'));
        if (!models) {
          continue;
        }
        for (const schemaKey of Object.keys(models)) {
          result['components']['schemas'][schemaKey] = models[schemaKey];
        }
      }
    }
  }

  const objectsToResolve = [result];
  while (objectsToResolve.length > 0) {
    const target = objectsToResolve.pop();
    for (const key of Object.keys(target)) {
      const value = target[key];
      if (key === '$ref') {
        target['$ref'] = '#/components/schemas/' + value.split('#/')[1];
      } else if (typeof value === 'object') {
        objectsToResolve.push(value);
      }
    }
  }

  const yamlText = yaml.safeDump(result);
  if(!fs.existsSync(projectRoot + '/spec/dist/')) {
    fs.mkdirSync(projectRoot + '/spec/dist/');
  }
  fs.writeFileSync(projectRoot + '/spec/dist/full.openapi.yml', yamlText);

  await promisify(exec)(`rm -rf ${projectRoot}/src/v1/models`);
  await promisify(exec)(`rm -rf ${projectRoot}/src/v1/apis`);
  await promisify(exec)(
    `yarn openapi-generator-cli generate -i ${projectRoot}/spec/dist/full.openapi.yml -o ${projectRoot}/src/v1 -g typescript-fetch --additional-properties=modelPropertyNaming=original`
  );
  return { success: true };
}
