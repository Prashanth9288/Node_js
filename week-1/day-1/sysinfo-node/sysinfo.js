const os = require('node:os');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(2)} ${units[i]}`;
}

function getSystemInfo() {
  const architecture = os.arch();
  const cpus = os.cpus() || [];
  const cpuCores = cpus.length;
  const cpuModel = cpus[0] ? cpus[0].model : 'Unknown';
  const cpuSpeedMHz = cpus[0] ? cpus[0].speed : 0;
  const cpuSpeedGHz = (cpuSpeedMHz / 1000).toFixed(2);
  const totalMemoryBytes = os.totalmem();
  const freeMemoryBytes = os.freemem();
  const memUsage = process.memoryUsage();
  const heapUsed = memUsage.heapUsed;
  const heapTotal = memUsage.heapTotal;
  const hostname = os.hostname();
  const osType = os.type();

  console.log('System Information:');
  console.log('-------------------------');
  console.log(`Architecture: ${architecture}`);
  console.log(`CPU Cores: ${cpuCores}`);
  console.log(`CPU Model: ${cpuModel}`);
  console.log(`CPU Speed: ${cpuSpeedGHz} GHz`);
  console.log(`Total Memory: ${formatBytes(totalMemoryBytes)}`);
  console.log(`Free Memory: ${formatBytes(freeMemoryBytes)}`);
  console.log(`Heap Memory Used: ${formatBytes(heapUsed)}`);
  console.log(`Heap Memory Total: ${formatBytes(heapTotal)}`);
  console.log(`Hostname: ${hostname}`);
  console.log(`OS Type: ${osType}`);
}

module.exports = { getSystemInfo };
