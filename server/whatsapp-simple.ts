import { storage } from './storage';
import { getWhatsAppManualService } from './whatsapp-manual';

interface WhatsAppSession {
  sessionId: string;
  phoneNumber: string;
  isActive: boolean;
  lastActivity: Date;
}

export class SimpleWhatsAppService {
  private sessions: Map<string, WhatsAppSession> = new Map();
  private adminNumber: string;

  constructor(adminNumber: string) {
    this.adminNumber = adminNumber;
  }

  // Create a session for the admin user
  createSession(): string {
    const sessionId = `wa_${Date.now()}`;
    this.sessions.set(sessionId, {
      sessionId,
      phoneNumber: this.adminNumber,
      isActive: true,
      lastActivity: new Date()
    });
    return sessionId;
  }

  // Send a message through the session (simulated)
  async sendMessage(sessionId: string, message: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return false;
    }

    session.lastActivity = new Date();
    console.log(`📱 WhatsApp Message to ${session.phoneNumber}:`);
    console.log('─'.repeat(50));
    console.log(message);
    console.log('─'.repeat(50));
    
    return true;
  }

  // Process incoming messages
  async receiveMessage(sessionId: string, message: string): Promise<string | null> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return null;
    }

    const whatsappService = getWhatsAppManualService();
    if (!whatsappService) {
      return "WhatsApp service not available";
    }

    const response = await whatsappService.processCommand(message);
    session.lastActivity = new Date();
    
    return response;
  }

  // Send daily lesson to admin
  async sendDailyLesson(): Promise<boolean> {
    const todaysLesson = await storage.getTodaysLesson();
    if (!todaysLesson) {
      return false;
    }

    const whatsappService = getWhatsAppManualService();
    if (!whatsappService) {
      return false;
    }

    const message = whatsappService.getDailyLessonMessage(todaysLesson);
    
    // Find admin session or create one
    let adminSessionId = '';
    for (const [sessionId, session] of this.sessions) {
      if (session.phoneNumber === this.adminNumber && session.isActive) {
        adminSessionId = sessionId;
        break;
      }
    }

    if (!adminSessionId) {
      adminSessionId = this.createSession();
    }

    return await this.sendMessage(adminSessionId, message);
  }

  getActiveSessions(): WhatsAppSession[] {
    return Array.from(this.sessions.values()).filter(s => s.isActive);
  }
}

let simpleWhatsAppService: SimpleWhatsAppService | null = null;

export function initializeSimpleWhatsApp(adminNumber: string) {
  if (!simpleWhatsAppService) {
    simpleWhatsAppService = new SimpleWhatsAppService(adminNumber);
    console.log('✓ Simple WhatsApp service initialized');
  }
  return simpleWhatsAppService;
}

export function getSimpleWhatsAppService() {
  return simpleWhatsAppService;
}