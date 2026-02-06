import { useSelector } from 'react-redux';
import { selectGroups } from '../store/slices/groupSlice';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';

export default function Groups() {
  const groups = useSelector(selectGroups);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Groups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <Link key={group.id} to={`/app/groups/${group.id}`} className="block h-full">
            <Card className="hover:border-brand-300 transition-all cursor-pointer h-full group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform">
                  {group.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{group.name}</h3>
                  <p className="text-sm text-slate-500">{group.type}</p>
                </div>
              </div>
              <div className="flex -space-x-2 overflow-hidden">
                {group.members.slice(0, 5).map((m, i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                    {m.split('-')[1]}
                  </div>
                ))}
              </div>
            </Card>
          </Link>
        ))}

        {/* Add Group Card */}
        <Card className="border-dashed border-2 flex items-center justify-center min-h-[160px] text-slate-400 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50/50 cursor-pointer transition-all">
          <div className="text-center">
            <span className="text-2xl block mb-2">+</span>
            <span className="font-medium">Create New Group</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
