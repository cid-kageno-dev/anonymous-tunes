import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const gradients = [
  "from-pink-500 to-rose-600",
  "from-purple-500 to-indigo-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-cyan-600",
  "from-fuchsia-500 to-purple-600",
  "from-red-500 to-pink-600",
  "from-lime-500 to-emerald-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-fuchsia-600",
  "from-orange-500 to-red-600",
  "from-teal-500 to-sky-600",
];

const Genres = () => {
  const { data: genres, isLoading } = useQuery({ queryKey: ["genres"], queryFn: () => api.genres() });

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8 animate-fade-in">
      <div>
        <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Browse</div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">Genres</h1>
        <p className="text-muted-foreground mt-2">Explore music by mood and style</p>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading genres...</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres?.map((g, i) => (
          <Link
            key={g.id}
            to={`/genre/${g.id}`}
            className={`group relative aspect-[5/3] rounded-2xl overflow-hidden bg-gradient-to-br ${gradients[i % gradients.length]} shadow-card hover:scale-[1.03] transition-transform`}
          >
            <div className="absolute inset-0 p-4 flex items-start">
              <h3 className="font-display font-bold text-lg sm:text-xl text-white drop-shadow-lg">{g.name}</h3>
            </div>
            {g.picture_medium && (
              <img
                src={g.picture_medium}
                alt=""
                loading="lazy"
                className="absolute -bottom-2 -right-2 w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl rotate-12 shadow-2xl group-hover:rotate-6 transition-transform"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
