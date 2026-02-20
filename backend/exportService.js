import fs from 'fs/promises';
import path from 'path';
import { generateCode } from './codeGenerator.js';

export async function exportFramework(scenario) {
  const { projectName, scenarioName } = scenario;
  const exportDir = path.join(process.cwd(), 'exports', projectName || 'project');

  // Create directory structure
  await fs.mkdir(exportDir, { recursive: true });
  await fs.mkdir(path.join(exportDir, 'features'), { recursive: true });
  await fs.mkdir(path.join(exportDir, 'pages'), { recursive: true });
  await fs.mkdir(path.join(exportDir, 'step-definitions'), { recursive: true });

  const code = generateCode(scenario);

  // Write feature file
  await fs.writeFile(
    path.join(exportDir, 'features', `${scenarioName || 'test'}.feature`),
    code.gherkin
  );

  // Write page object
  await fs.writeFile(
    path.join(exportDir, 'pages', 'Page.js'),
    code.pageObject
  );

  // Write step definitions
  await fs.writeFile(
    path.join(exportDir, 'step-definitions', `${scenarioName || 'test'}.steps.js`),
    code.stepDefinitions
  );

  // Write package.json
  const packageJson = {
    name: projectName || 'bdd-automation',
    version: '1.0.0',
    type: 'commonjs',
    scripts: {
      test: 'cucumber-js'
    },
    dependencies: {
      '@cucumber/cucumber': '^10.0.0',
      'playwright': '^1.40.0'
    }
  };

  await fs.writeFile(
    path.join(exportDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Write cucumber.js config
  const cucumberConfig = `module.exports = {
  default: {
    require: ['step-definitions/**/*.js'],
    format: ['progress', 'html:cucumber-report.html'],
    publishQuiet: true
  }
};`;

  await fs.writeFile(
    path.join(exportDir, 'cucumber.js'),
    cucumberConfig
  );

  // Write playwright.config.js
  const playwrightConfig = `module.exports = {
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
  },
};`;

  await fs.writeFile(
    path.join(exportDir, 'playwright.config.js'),
    playwrightConfig
  );

  return exportDir;
}
