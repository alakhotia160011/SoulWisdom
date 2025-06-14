import { storage } from './server/storage';
import { initializeTwilioWhatsApp } from './server/whatsapp-twilio';

async function testWhatsAppSubscriptionWorkflow() {
  try {
    console.log('Testing complete WhatsApp subscription workflow...');
    
    const testPhoneNumber = 'whatsapp:+16176420146';
    const whatsappService = initializeTwilioWhatsApp();
    
    // Test 1: New user sends "subscribe"
    console.log('\n--- Test 1: New subscription ---');
    await whatsappService.processIncomingMessage('subscribe', testPhoneNumber);
    
    // Verify subscription was created
    const subscriber = await storage.getWhatsAppSubscriberByPhone(testPhoneNumber);
    console.log('Subscription created:', !!subscriber);
    console.log('Subscriber details:', {
      phoneNumber: subscriber?.phoneNumber,
      isActive: subscriber?.isActive,
      joinedVia: subscriber?.joinedVia
    });
    
    // Test 2: Existing subscriber sends "today"
    console.log('\n--- Test 2: Getting today\'s lesson ---');
    await whatsappService.processIncomingMessage('today', testPhoneNumber);
    
    // Test 3: Ask a spiritual question
    console.log('\n--- Test 3: Spiritual question ---');
    await whatsappService.processIncomingMessage('How can I find inner peace?', testPhoneNumber);
    
    // Test 4: Get inspiration
    console.log('\n--- Test 4: Random inspiration ---');
    await whatsappService.processIncomingMessage('inspire', testPhoneNumber);
    
    // Test 5: Help command
    console.log('\n--- Test 5: Help for subscribed user ---');
    await whatsappService.processIncomingMessage('help', testPhoneNumber);
    
    // Test 6: Test unsubscribe
    console.log('\n--- Test 6: Unsubscribe ---');
    await whatsappService.processIncomingMessage('unsubscribe', testPhoneNumber);
    
    // Verify unsubscription
    const unsubscribedUser = await storage.getWhatsAppSubscriberByPhone(testPhoneNumber);
    console.log('User unsubscribed (isActive should be false):', !unsubscribedUser?.isActive);
    
    // Test 7: Non-subscriber tries to access content
    console.log('\n--- Test 7: Non-subscriber access ---');
    await whatsappService.processIncomingMessage('today', testPhoneNumber);
    
    console.log('\n✓ WhatsApp subscription workflow testing completed');
    
    // Show current subscriber count
    const allSubscribers = await storage.getWhatsAppSubscribers();
    console.log(`\nActive WhatsApp subscribers: ${allSubscribers.length}`);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testWhatsAppSubscriptionWorkflow();