export function generateCode(scenario) {
  const { projectName, scenarioName, url, steps } = scenario;

  return {
    gherkin: generateGherkin(scenarioName, steps),
    pageObject: generatePageObject(steps),
    stepDefinitions: generateStepDefinitions(steps, url),
    playwrightCode: generatePlaywrightCode(steps)
  };
}

function generateGherkin(scenarioName, steps) {
  const name = scenarioName || 'Test Scenario';
  let gherkin = `Feature: ${name}\n\n`;
  gherkin += `  Scenario: ${name}\n`;
  
  steps.forEach(step => {
    const keyword = step.keyword || 'Given';
    const text = step.text || 'step';
    gherkin += `    ${keyword} ${text}\n`;
  });
  
  return gherkin;
}

function generatePageObject(steps) {
  const locators = new Map();
  const methods = [];
  const usedNames = new Set();

  steps.forEach((step, stepIndex) => {
    if (!step.actions || step.actions.length === 0) return;
    
    step.actions.forEach((action, actionIndex) => {
      if (!action.locator) return;
      
      // Generate meaningful name from locator
      const locatorName = generateMeaningfulName(action.locator, action.type, usedNames);
      const locatorCode = action.locator.code || `page.locator('${action.locator.value}')`;
      
      // Add locator
      locators.set(locatorName, `    this.${locatorName} = ${locatorCode.replace('page.', 'page.')};`);
      
      // Add method
      if (action.type === 'fill') {
        const methodName = `fill${locatorName.charAt(0).toUpperCase() + locatorName.slice(1)}`;
        methods.push(`  async ${methodName}(value) {
    await this.${locatorName}.fill(value);
  }`);
      } else if (action.type === 'click') {
        const methodName = `click${locatorName.charAt(0).toUpperCase() + locatorName.slice(1)}`;
        methods.push(`  async ${methodName}() {
    await this.${locatorName}.click();
  }`);
      }
    });
  });

  if (locators.size === 0) {
    return `class Page {
  constructor(page) {
    this.page = page;
    // No elements recorded yet
  }

  // Add methods here after recording
}

module.exports = { Page };`;
  }

  return `class Page {
  constructor(page) {
    this.page = page;
${Array.from(locators.values()).join('\n')}
  }

${methods.join('\n\n')}
}

module.exports = { Page };`;
}

// Generate meaningful name from locator
function generateMeaningfulName(locator, actionType, usedNames) {
  let baseName = '';
  
  // Extract meaningful name from locator value
  const locatorValue = locator.value || '';
  
  // For getByTestId('Adres e-mail') -> emailInput
  if (locatorValue.includes('getByTestId')) {
    const match = locatorValue.match(/getByTestId\(['"](.+?)['"]\)/);
    if (match) {
      baseName = match[1]
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    }
  }
  // For getByRole('button', { name: 'Login' }) -> loginButton
  else if (locatorValue.includes('getByRole')) {
    const nameMatch = locatorValue.match(/name:\s*['"](.+?)['"]/);
    if (nameMatch) {
      baseName = nameMatch[1]
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    }
  }
  // For getByPlaceholder('Email') -> emailInput
  else if (locatorValue.includes('getByPlaceholder')) {
    const match = locatorValue.match(/getByPlaceholder\(['"](.+?)['"]\)/);
    if (match) {
      baseName = match[1]
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    }
  }
  // For getByLabel('Password') -> passwordInput
  else if (locatorValue.includes('getByLabel')) {
    const match = locatorValue.match(/getByLabel\(['"](.+?)['"]\)/);
    if (match) {
      baseName = match[1]
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    }
  }
  // For getByText('Submit') -> submitButton
  else if (locatorValue.includes('getByText')) {
    const match = locatorValue.match(/getByText\(['"](.+?)['"]\)/);
    if (match) {
      baseName = match[1]
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    }
  }
  // For locator('#email') -> emailInput
  else if (locatorValue.includes('locator')) {
    const match = locatorValue.match(/locator\(['"](.+?)['"]\)/);
    if (match) {
      baseName = match[1]
        .replace(/^[#.]/, '') // Remove # or . prefix
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    }
  }
  
  // If no meaningful name found, use generic name
  if (!baseName) {
    baseName = actionType === 'fill' ? 'input' : 'button';
  }
  
  // Add suffix based on action type
  if (actionType === 'fill' && !baseName.toLowerCase().includes('input') && !baseName.toLowerCase().includes('field')) {
    baseName += 'Input';
  } else if (actionType === 'click' && !baseName.toLowerCase().includes('button') && !baseName.toLowerCase().includes('btn')) {
    baseName += 'Button';
  }
  
  // Ensure uniqueness
  let finalName = baseName;
  let counter = 1;
  while (usedNames.has(finalName)) {
    finalName = `${baseName}${counter}`;
    counter++;
  }
  
  usedNames.add(finalName);
  return finalName;
}

function generateStepDefinitions(steps, url) {
  let code = `const { Given, When, Then } = require('@cucumber/cucumber');\n`;
  code += `const { chromium } = require('playwright');\n`;
  code += `const { Page } = require('../pages/Page');\n\n`;
  code += `let browser;\nlet page;\nlet pageObject;\n\n`;

  const usedNames = new Set();

  steps.forEach((step, index) => {
    const keyword = step.keyword;
    const text = step.text || 'step';
    
    code += `${keyword}('${text}', async function () {\n`;
    
    if (index === 0) {
      code += `  browser = await chromium.launch({ headless: false });\n`;
      code += `  page = await browser.newPage();\n`;
      code += `  pageObject = new Page(page);\n`;
      if (url) {
        code += `  await page.goto('${url}');\n`;
      }
    }
    
    if (step.actions && step.actions.length > 0) {
      step.actions.forEach(action => {
        if (action.type === 'goto' && action.url) {
          code += `  await page.goto('${action.url}');\n`;
        } else if (action.type === 'click' && action.locator) {
          const locatorName = generateMeaningfulName(action.locator, 'click', usedNames);
          const methodName = `click${locatorName.charAt(0).toUpperCase() + locatorName.slice(1)}`;
          code += `  await pageObject.${methodName}();\n`;
        } else if (action.type === 'fill' && action.value && action.locator) {
          const locatorName = generateMeaningfulName(action.locator, 'fill', usedNames);
          const methodName = `fill${locatorName.charAt(0).toUpperCase() + locatorName.slice(1)}`;
          code += `  await pageObject.${methodName}('${action.value}');\n`;
        }
      });
    }
    
    code += `});\n\n`;
  });

  return code;
}

function generatePlaywrightCode(steps) {
  let code = `const { chromium } = require('playwright');\n\n`;
  code += `(async () => {\n`;
  code += `  const browser = await chromium.launch({ headless: false });\n`;
  code += `  const page = await browser.newPage();\n\n`;

  steps.forEach(step => {
    if (!step.actions || step.actions.length === 0) return;
    
    step.actions.forEach(action => {
      if (action.type === 'goto' && action.url) {
        code += `  await page.goto('${action.url}');\n`;
      } else if (action.type === 'click' && action.locator) {
        const locatorCode = action.locator.code || `page.locator('${action.locator.value}')`;
        code += `  await ${locatorCode}.click();\n`;
      } else if (action.type === 'fill' && action.locator && action.value) {
        const locatorCode = action.locator.code || `page.locator('${action.locator.value}')`;
        code += `  await ${locatorCode}.fill('${action.value}');\n`;
      }
    });
  });

  code += `\n  await browser.close();\n`;
  code += `})();\n`;

  return code;
}

function generateLocatorName(selector, type) {
  let name = selector
    .replace(/[\[\]"'=]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
  
  if (type === 'fill') name += '_input';
  if (type === 'click') name += '_button';
  
  return name;
}

function generateMethodName(stepText, type) {
  let name = stepText
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  return name || (type === 'click' ? 'clickElement' : 'fillInput');
}
