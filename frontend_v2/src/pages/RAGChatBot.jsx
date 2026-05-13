import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  addMessage,
  clearChat,
  fetchChatHistory,
  sendMessage,
} from '@/features/chat/chatSlice';

export default function RAGChatBot() {
  const dispatch = useDispatch();
  const { messages, isLoading, error, conversationId } = useSelector(
    (state) => state.chat,
  );

  const [input, setInput] = useState('');
  const [status, setStatus] = useState('ready');
  // Count of messages loaded from history on mount so we can show the divider
  const [historyCount, setHistoryCount] = useState(0);
  const pendingThunkRef = useRef(null);

  // Load previous history on mount
  useEffect(() => {
    const load = async () => {
      const result = await dispatch(fetchChatHistory(20));
      if (fetchChatHistory.fulfilled.match(result)) {
        setHistoryCount(result.payload.length);
      }
    };
    load();
  }, [dispatch]);

  const stop = () => {
    if (pendingThunkRef.current) {
      pendingThunkRef.current.abort();
      pendingThunkRef.current = null;
    }
    setStatus('ready');
  };

  const handleNewChat = () => {
    stop();
    dispatch(clearChat());
    setHistoryCount(0);
  };

  const handleSubmit = async (message) => {
    if (!message?.text?.trim()) return;

    const prompt = message.text.trim();

    stop();

    // Optimistically push user message into Redux
    dispatch(
      addMessage({
        id: crypto.randomUUID(),
        role: 'user',
        parts: [{ type: 'text', text: prompt }],
      }),
    );

    setInput('');
    setStatus('submitted');

    pendingThunkRef.current = dispatch(
      sendMessage({ query: prompt, conversationId }),
    );
    await pendingThunkRef.current;
    pendingThunkRef.current = null;
    setStatus('ready');
  };

  return (
    <div className="relative mx-auto h-[calc(95vh-4rem)] size-full max-w-4xl p-6">
      <div className="flex h-full flex-col">
        {/* ── Header bar ──────────────────────────────────────────── */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {messages.length === 0
              ? 'Start a conversation'
              : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
          </span>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleNewChat}
            disabled={messages.length === 0}
          >
            + New Chat
          </Button>
        </div>

        <Conversation className="h-full">
          <ConversationContent className="h-full">
            {messages.map((message, idx) => (
              <Fragment key={message.id}>
                {/* ── History / current-session divider ── */}
                {historyCount > 0 && idx === historyCount ? (
                  <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="h-px flex-1 bg-border" />
                    <span className="shrink-0">New session</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                ) : null}

                {message.parts.map((part, partIdx) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Fragment key={`${message.id}-${partIdx}`}>
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
              </Fragment>
            ))}

            {/* ── Empty state ───────────────────────────────────────── */}
            {!isLoading && messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <p className="text-base font-medium">
                  Ask anything about your documents
                </p>
                <p className="text-sm">
                  Your uploaded knowledge base will be searched automatically.
                </p>
              </div>
            ) : null}

            {isLoading ? (
              <div className="px-4">
                <Spinner className="size-5" />
              </div>
            ) : null}

            {error ? (
              <div className="px-4 py-2 text-sm text-destructive">{error}</div>
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
