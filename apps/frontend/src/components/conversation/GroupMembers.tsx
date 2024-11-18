import { User } from '../../types';

function GroupMembers({ members }: { members: User[] }) {
  return (
    <div className="flex flex-col w-full h-full">
      {members &&
        members.map((m) => {
          return (
            <div key={m?.id} className="flex flex-row items-center space-x-2">
              <img
                src={
                  m?.profile ||
                  'https://tse2.mm.bing.net/th?id=OIP.Gfp0lwE6h7139625a-r3aAHaHa&pid=Api&P=0&h=180'
                }
                alt={m?.name}
                className="w-10 h-10 rounded-full"
              />
              <h3>{m?.name}</h3>
            </div>
          );
        })}
    </div>
  );
}

export default GroupMembers;
