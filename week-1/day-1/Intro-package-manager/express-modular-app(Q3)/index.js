const express = require('express');
const os = require('os');
const dns = require('dns').promises;
const { readDataFile } = require('./read');
const app = express();
const PORT = process.env.PORT || 3000;
function bytesToGB(bytes) {
  return (bytes / (1024 ** 3)).toFixed(2);
}
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});
app.get('/readfile', async (req, res) => {
  try {
    const content = await readDataFile();
    res.send(content);
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).send('Data.txt not found');
    console.error('Error reading file:', err);
    res.status(500).send('Error reading file');
  }
});
app.get('/systemdetails', (req, res) => {
  const platform = os.platform();
  const totalMemoryGB = bytesToGB(os.totalmem());
  const freeMemoryGB = bytesToGB(os.freemem());
  const cpus = os.cpus() || [];
  const cpuCores = cpus.length;
  const cpuModel = cpus[0] ? cpus[0].model : 'Unknown';
  res.json({
    platform,
    totalMemoryGB: `${totalMemoryGB} GB`,
    freeMemoryGB: `${freeMemoryGB} GB`,
    cpuModel,
    cpuCores
  });
});
app.get('/getip', async (req, res) => {
  try {
    const url = new URL('https://masaischool.com/');
    const hostname = url.hostname;
    const [v4Result, v6Result] = await Promise.allSettled([
      dns.resolve4(hostname),
      dns.resolve6(hostname)
    ]);
    const ipv4 = v4Result.status === 'fulfilled' ? v4Result.value : [];
    const ipv6 = v6Result.status === 'fulfilled' ? v6Result.value : [];
    res.json({
      hostname,
      ipv4: ipv4.length ? ipv4 : 'No IPv4 addresses found',
      ipv6: ipv6.length ? ipv6 : 'No IPv6 addresses found'
    });
  } catch (err) {
    console.error('DNS resolution error:', err);
    res.status(500).json({ error: 'DNS resolution failed', details: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
