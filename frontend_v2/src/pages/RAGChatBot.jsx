import { Fragment, useRef, useState } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Spinner } from '@/components/ui/spinner';

const buildAssistantReply = (prompt) => {
  const text = prompt.trim();

  return [
    `You asked: "${text}".`,
    'This chat page is running with manual React state instead of @ai-sdk/react.',
    'Next step: connect this UI to your own backend endpoint for real responses.',
  ].join(' ');
};

export default function RAGChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('ready');
  const pendingReplyRef = useRef(null);

  const stop = () => {
    if (pendingReplyRef.current) {
      clearTimeout(pendingReplyRef.current);
      pendingReplyRef.current = null;
    }
    setStatus('ready');
  };

  const sendAssistantReply = (prompt) => {
    setStatus('streaming');

    pendingReplyRef.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          parts: [{ type: 'text', text: buildAssistantReply(prompt) }],
        },
      ]);
      setStatus('ready');
      pendingReplyRef.current = null;
    }, 900);
  };

  const handleSubmit = (message) => {
    if (!message?.text?.trim()) {
      return;
    }

    const prompt = message.text.trim();

    stop();
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        parts: [{ type: 'text', text: prompt }],
      },
    ]);
    setStatus('submitted');
    setInput('');
    sendAssistantReply(prompt);
  };

  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <div className="relative mx-auto h-[calc(95vh-4rem)] size-full max-w-4xl p-6">
      <div className="flex h-full flex-col">
        <Conversation className="h-full">
          <ConversationContent className="h-full">
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Fragment key={`${message.id}-${index}`}>
                          <Message className="" from={message.role}>
                            <MessageContent className="">
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {isLoading ? (
              <div className="px-4">
                <Spinner className="size-5" />
              </div>
            ) : null}
          </ConversationContent>
          <ConversationScrollButton className="" />
        </Conversation>

        <PromptInput
          accept="image/*,.pdf,.txt"
          className="mt-4"
          globalDrop={false}
          maxFiles={5}
          maxFileSize={10 * 1024 * 1024}
          multiple={true}
          onSubmit={handleSubmit}
          syncHiddenInput={false}
        >
          <PromptInputBody className="">
            <PromptInputTextarea
              className="min-h-16"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter className="">
            <PromptInputTools className="">
              {/* Model selector, web search, etc. */}
            </PromptInputTools>
            <PromptInputSubmit
              className=""
              style={{ minWidth: 70 }}
              disabled={!input.trim() && !isLoading}
              onClick={() => {}}
              onStop={stop}
              status={status}
            >
              Send
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
