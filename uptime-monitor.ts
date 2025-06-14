import https from 'https';
import http from 'http';

interface UptimeConfig {
  url: string;
  interval: number;
  timeout: number;
  retries: number;
}

class UptimeMonitor {
  private config: UptimeConfig;
  private isRunning: boolean = false;
  private consecutiveFailures: number = 0;
  private lastSuccessTime: Date = new Date();

  constructor(config: UptimeConfig) {
    this.config = config;
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`Uptime monitor started for ${this.config.url}`);
    this.scheduleCheck();
  }

  stop(): void {
    this.isRunning = false;
    console.log('Uptime monitor stopped');
  }

  private scheduleCheck(): void {
    if (!this.isRunning) return;

    setTimeout(() => {
      this.performCheck();
      this.scheduleCheck();
    }, this.config.interval);
  }

  private async performCheck(): Promise<void> {
    try {
      const success = await this.pingEndpoint();
      
      if (success) {
        this.consecutiveFailures = 0;
        this.lastSuccessTime = new Date();
        console.log(`Uptime check: OK (${new Date().toISOString()})`);
      } else {
        this.handleFailure();
      }
    } catch (error) {
      this.handleFailure();
    }
  }

  private pingEndpoint(): Promise<boolean> {
    return new Promise((resolve) => {
      const url = new URL(this.config.url);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'User-Agent': 'UptimeMonitor/1.0'
        },
        timeout: this.config.timeout
      }, (res) => {
        const success = res.statusCode === 200;
        resolve(success);
        req.destroy();
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  }

  private handleFailure(): void {
    this.consecutiveFailures++;
    console.error(`Uptime check failed (${this.consecutiveFailures}/${this.config.retries}) at ${new Date().toISOString()}`);
    
    if (this.consecutiveFailures >= this.config.retries) {
      this.alertCriticalFailure();
    }
  }

  private alertCriticalFailure(): void {
    const timeSinceLastSuccess = Date.now() - this.lastSuccessTime.getTime();
    const minutesDown = Math.floor(timeSinceLastSuccess / 60000);
    
    console.error(`CRITICAL: Service has been down for ${minutesDown} minutes`);
    console.error(`Last successful check: ${this.lastSuccessTime.toISOString()}`);
    
    // Reset failure count to avoid spam
    this.consecutiveFailures = 0;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      consecutiveFailures: this.consecutiveFailures,
      lastSuccessTime: this.lastSuccessTime,
      timeSinceLastSuccess: Date.now() - this.lastSuccessTime.getTime()
    };
  }
}

// Export singleton monitor
const monitor = new UptimeMonitor({
  url: process.env.REPLIT_DOMAINS ? 
    `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/api/health` : 
    'http://localhost:5000/api/health',
  interval: 2 * 60 * 1000, // 2 minutes
  timeout: 10000, // 10 seconds
  retries: 3
});

export { UptimeMonitor, monitor as uptimeMonitor };