#!/usr/bin/env node

/**
 * AI Career Soft Skills Coach - Development Test Script
 * 验证项目的各个组件是否正常工作
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const PROJECT_ROOT = '/Users/wangshihao/projects/openclaws/ai-career-soft-skills-coach';
const LOG_DIR = path.join(PROJECT_ROOT, 'logs');
const TEST_LOG_FILE = path.join(LOG_DIR, 'development-test.log');

console.log('🧪 开始 AI Career Soft Skills Coach 开发测试...\n');

// 确保日志目录存在
async function ensureLogDirectory() {
  try {
    await fs.access(LOG_DIR);
  } catch {
    await fs.mkdir(LOG_DIR, { recursive: true });
  }
}

// 记录日志
async function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  try {
    await fs.appendFile(TEST_LOG_FILE, logMessage + '\n');
  } catch (error) {
    console.error('日志写入失败:', error);
  }
}

// 执行 shell 命令
function executeCommand(command, description) {
  return new Promise((resolve) => {
    log(`🔧 执行: ${description}`);
    exec(command, { cwd: PROJECT_ROOT }, (error, stdout, stderr) => {
      if (error) {
        log(`❌ ${description} 失败: ${error.message}`);
        if (stderr) log(`错误输出: ${stderr}`);
        resolve(false);
      } else {
        log(`✅ ${description} 成功`);
        if (stdout) log(`输出: ${stdout}`);
        resolve(true);
      }
    });
  });
}

// 主测试函数
async function runTests() {
  await ensureLogDirectory();
  await log('🎯 AI Career Soft Skills Coach 开发测试开始');
  
  const tests = [
    {
      command: 'npm run type-check',
      description: 'TypeScript 类型检查'
    },
    {
      command: 'npm run lint',
      description: 'ESLint 代码规范检查'
    },
    {
      command: 'npm test',
      description: '单元测试运行'
    },
    {
      command: 'npm run build',
      description: '后端项目构建'
    },
    {
      command: 'npm run build:frontend',
      description: '前端项目构建'
    }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    const success = await executeCommand(test.command, test.description);
    if (success) passedTests++;
    await log(''); // 空行分隔
  }
  
  await log('📊 测试完成');
  await log(`✅ 通过: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    await log('🎉 所有测试通过！项目已准备好进行下一步开发');
    await log('🚀 建议下一步: 部署测试和生产环境准备');
  } else {
    await log('⚠️ 部分测试失败，请检查项目配置');
  }
  
  process.exit(passedTests === totalTests ? 0 : 1);
}

// 运行测试
runTests().catch((error) => {
  console.error('测试执行失败:', error);
  process.exit(1);
});