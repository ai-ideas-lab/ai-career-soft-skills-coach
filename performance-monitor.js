#!/usr/bin/env node

/**
 * AI Career Soft Skills Coach - Performance Monitor
 * 生产环境性能监控和报告
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PROJECT_ROOT = '/Users/wangshihao/projects/openclaws/ai-career-soft-skills-coach';
const LOG_DIR = path.join(PROJECT_ROOT, 'logs');
const MONITOR_LOG = path.join(LOG_DIR, 'performance.log');
const CONFIG_FILE = path.join(PROJECT_ROOT, 'monitoring-config.json');

let config;
let metrics = {
  timestamp: new Date().toISOString(),
  system: {},
  application: {},
  database: {}
};

// 加载配置
function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
    config = JSON.parse(configData);
    console.log('📊 监控配置加载成功');
  } catch (error) {
    console.error('❌ 监控配置加载失败:', error.message);
    process.exit(1);
  }
}

// 确保日志目录存在
function ensureLogDirectory() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

// 记录日志
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  console.log(logMessage);
  
  try {
    fs.appendFileSync(MONITOR_LOG, logMessage + '\n');
  } catch (error) {
    console.error('日志写入失败:', error.message);
  }
}

// 系统指标收集
function collectSystemMetrics() {
  try {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = (usedMem / totalMem) * 100;
    
    metrics.system = {
      cpu_usage: cpus.reduce((total, cpu) => total + cpu.times.user + cpu.times.sys, 0) / cpus.length,
      memory_usage: memUsagePercent,
      memory_total: totalMem,
      memory_used: usedMem,
      memory_free: freeMem,
      uptime: os.uptime(),
      load_average: os.loadavg()
    };
    
    // CPU使用率警告
    if (metrics.system.cpu_usage > config.alerts.cpu_usage.critical) {
      log(`⚠️ CPU使用率过高: ${metrics.system.cpu_usage.toFixed(2)}%`, 'critical');
    } else if (metrics.system.cpu_usage > config.alerts.cpu_usage.warning) {
      log(`⚠️ CPU使用率偏高: ${metrics.system.cpu_usage.toFixed(2)}%`, 'warning');
    }
    
    // 内存使用率警告
    if (metrics.system.memory_usage > config.alerts.memory_usage.critical) {
      log(`⚠️ 内存使用率过高: ${metrics.system.memory_usage.toFixed(2)}%`, 'critical');
    } else if (metrics.system.memory_usage > config.alerts.memory_usage.warning) {
      log(`⚠️ 内存使用率偏高: ${metrics.system.memory_usage.toFixed(2)}%`, 'warning');
    }
    
  } catch (error) {
    log(`系统指标收集失败: ${error.message}`, 'error');
  }
}

// 应用指标收集
function collectApplicationMetrics() {
  try {
    // 模拟应用指标（实际项目中需要从应用中收集）
    const responseTime = Math.random() * 2000; // 模拟响应时间
    const errorRate = Math.random() * 5; // 模拟错误率
    const requestCount = Math.floor(Math.random() * 1000);
    
    metrics.application = {
      response_time: responseTime,
      error_rate: errorRate,
      request_count: requestCount,
      active_connections: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString()
    };
    
    // 响应时间警告
    if (metrics.application.response_time > config.alerts.response_time.critical) {
      log(`⚠️ 应用响应时间过长: ${metrics.application.response_time.toFixed(2)}ms`, 'critical');
    } else if (metrics.application.response_time > config.alerts.response_time.warning) {
      log(`⚠️ 应用响应时间偏高: ${metrics.application.response_time.toFixed(2)}ms`, 'warning');
    }
    
    // 错误率警告
    if (metrics.application.error_rate > config.alerts.error_rate.critical) {
      log(`⚠️ 应用错误率过高: ${metrics.application.error_rate.toFixed(2)}%`, 'critical');
    } else if (metrics.application.error_rate > config.alerts.error_rate.warning) {
      log(`⚠️ 应用错误率偏高: ${metrics.application.error_rate.toFixed(2)}%`, 'warning');
    }
    
  } catch (error) {
    log(`应用指标收集失败: ${error.message}`, 'error');
  }
}

// 数据库指标收集
function collectDatabaseMetrics() {
  try {
    // 模拟数据库指标（实际项目中需要从数据库查询）
    const queryTime = Math.random() * 1000;
    const connectionCount = Math.floor(Math.random() * 50);
    
    metrics.database = {
      query_time: queryTime,
      connection_count: connectionCount,
      slow_queries: Math.floor(Math.random() * 5),
      timestamp: new Date().toISOString()
    };
    
    // 连接数警告
    if (metrics.database.connection_count > config.alerts.database_connections.critical) {
      log(`⚠️ 数据库连接数过多: ${metrics.database.connection_count}`, 'critical');
    } else if (metrics.database.connection_count > config.alerts.database_connections.warning) {
      log(`⚠️ 数据库连接数偏高: ${metrics.database.connection_count}`, 'warning');
    }
    
  } catch (error) {
    log(`数据库指标收集失败: ${error.message}`, 'error');
  }
}

// 生成报告
function generateReport() {
  const report = {
    timestamp: metrics.timestamp,
    summary: {
      system_status: metrics.system.cpu_usage < config.alerts.cpu_usage.warning ? 'healthy' : 'warning',
      application_status: metrics.application.error_rate < config.alerts.error_rate.warning ? 'healthy' : 'warning',
      database_status: metrics.database.connection_count < config.alerts.database_connections.warning ? 'healthy' : 'warning'
    },
    metrics: metrics,
    alerts: []
  };
  
  // 添加警告信息
  if (metrics.system.cpu_usage > config.alerts.cpu_usage.warning) {
    report.alerts.push({
      type: 'system',
      level: 'warning',
      message: `CPU使用率偏高: ${metrics.system.cpu_usage.toFixed(2)}%`
    });
  }
  
  if (metrics.system.memory_usage > config.alerts.memory_usage.warning) {
    report.alerts.push({
      type: 'system',
      level: 'warning',
      message: `内存使用率偏高: ${metrics.system.memory_usage.toFixed(2)}%`
    });
  }
  
  if (metrics.application.error_rate > config.alerts.error_rate.warning) {
    report.alerts.push({
      type: 'application',
      level: 'warning',
      message: `错误率偏高: ${metrics.application.error_rate.toFixed(2)}%`
    });
  }
  
  // 保存报告
  const reportFile = path.join(LOG_DIR, 'performance-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  log(`📊 性能报告已生成: ${reportFile}`);
  
  // 如果有警告，显示总结
  if (report.alerts.length > 0) {
    log(`⚠️ 发现 ${report.alerts.length} 个警告事项`, 'warning');
    report.alerts.forEach(alert => {
      log(`   - [${alert.level.toUpperCase()}] ${alert.message}`, alert.level);
    });
  } else {
    log('✅ 系统运行正常', 'success');
  }
}

// 主监控函数
function runMonitoring() {
  ensureLogDirectory();
  loadConfig();
  
  log('🚀 开始性能监控...');
  
  // 收集指标
  collectSystemMetrics();
  collectApplicationMetrics();
  collectDatabaseMetrics();
  
  // 生成报告
  generateReport();
  
  log('🏁 性能监控完成');
}

// 运行监控
if (require.main === module) {
  runMonitoring();
}

module.exports = { runMonitoring, metrics, config };