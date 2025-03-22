import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I'm your diet assistant. I'm here to help you with your nutrition goals. Would you like to tell me about your dietary preferences?",
    sender: 'assistant',
    timestamp: new Date(),
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener('keypress', handleKeyPress);
      }
    };
  }, [inputText]);

  if (!fontsLoaded) {
    return null;
  }

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate API call delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand. Let me process that information. Could you also tell me about any specific dietary restrictions or allergies you have?",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Diet Assistant</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  message.sender === 'user' && styles.userMessageText
                ]}
              >
                {message.text}
              </Text>
              <Text style={[
                styles.timestamp,
                message.sender === 'user' ? styles.userTimestamp : styles.assistantTimestamp
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
          {isTyping && (
            <View style={[styles.messageBubble, styles.assistantMessage]}>
              <View style={styles.typingIndicator}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#ffffff' : '#a1a1aa'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
      height: '100vh',
    }),
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#18181b',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#10b981',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#18181b',
  },
  userMessageText: {
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  assistantTimestamp: {
    color: '#71717a',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    }),
  },
  sendButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  sendButtonDisabled: {
    backgroundColor: '#e4e4e7',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginHorizontal: 2,
    opacity: 0.6,
  },
  typingDot1: {
    ...(Platform.OS === 'web' && {
      animationKeyframes: {
        '0%, 100%': { opacity: 0.6 },
        '50%': { opacity: 0.2 },
      },
      animationDuration: '1s',
      animationIterationCount: 'infinite',
      animationDelay: '0s',
    }),
  },
  typingDot2: {
    ...(Platform.OS === 'web' && {
      animationKeyframes: {
        '0%, 100%': { opacity: 0.6 },
        '50%': { opacity: 0.2 },
      },
      animationDuration: '1s',
      animationIterationCount: 'infinite',
      animationDelay: '0.2s',
    }),
  },
  typingDot3: {
    ...(Platform.OS === 'web' && {
      animationKeyframes: {
        '0%, 100%': { opacity: 0.6 },
        '50%': { opacity: 0.2 },
      },
      animationDuration: '1s',
      animationIterationCount: 'infinite',
      animationDelay: '0.4s',
    }),
  },
});