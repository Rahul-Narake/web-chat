import ConversationCard from './ConversationCard';

export default function ViewConversation() {
  return (
    <div className="grid md:grid-cols-12 grid-cols-1 w-full h-full py-1">
      <div className="md:col-span-8 md:col-start-3 md:mx-auto m-2">
        <ConversationCard />
      </div>
    </div>
  );
}
