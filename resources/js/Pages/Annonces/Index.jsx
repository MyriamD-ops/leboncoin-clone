import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
  Search, MapPin, Clock, Heart, Plus, ChevronDown,
  SlidersHorizontal, Tag, Star, X
} from 'lucide-react';

export default function Index({ annonces, categories, filters }) {
  const [selectedCategory, setSelectedCategory] = useState(filters?.category_id || '');
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [sortBy, setSortBy] = useState('recent');
  const [showSort, setShowSort] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  const annoncesData = annonces?.data || [];
  const paginationLinks = annonces?.links || [];
  const categoriesData = categories || [];

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('annonces.index'), {
      category_id: selectedCategory || undefined,
      search: searchTerm || undefined,
    });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    router.get(route('annonces.index'), {
      category_id: categoryId || undefined,
      search: searchTerm || undefined,
    });
  };

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatPrice = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(prix);
  };

  useEffect(() => {
    const stored = localStorage.getItem('savedAnnonces');
    if (stored) try { setSavedIds(new Set(JSON.parse(stored))); } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('savedAnnonces', JSON.stringify([...savedIds]));
  }, [savedIds]);

  const AnnonceCard = ({ annonce }) => {
    const saved = savedIds.has(annonce.id);
    const firstImage = annonce.images?.[0]?.url ? `/storage/${annonce.images[0].url}` : null;

    return (
      <Link href={route('annonces.show', annonce.id)} className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {firstImage ? (
            <img src={firstImage} alt={annonce.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Pas d'image</div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(annonce.id); }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              saved ? 'bg-orange-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart size={15} strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="p-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Tag size={10} className="text-gray-400" />
            <span className="text-[11px] text-gray-500 font-medium uppercase">{annonce.category?.nom || 'Sans catégorie'}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{annonce.titre}</h3>
          <p className="text-xl font-bold text-orange-500 mb-3">{formatPrice(annonce.prix)}</p>
          <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-2.5">
            <span className="flex items-center gap-1"><MapPin size={10} />Non spécifié</span>
            <span className="flex items-center gap-1"><Clock size={10} />{annonce.created_at ? new Date(annonce.created_at).toLocaleDateString('fr-FR') : 'Récent'}</span>
          </div>
          {annonce.user && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-semibold text-gray-700">
                {annonce.user.name?.charAt(0) || 'U'}
              </div>
              <span className="text-[11px] text-gray-500 truncate">{annonce.user.name || 'Anonyme'}</span>
            </div>
          )}
        </div>
      </Link>
    );
  };

  const Pagination = () => {
    if (paginationLinks.length <= 3) return null;
    return (
      <div className="mt-8 flex justify-center gap-2">
        {paginationLinks.map((link, idx) => (
          link.url ? (
            <Link key={idx} href={link.url} className={`px-3 py-2 rounded text-sm ${link.active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
          ) : (
            <span key={idx} className="px-3 py-2 rounded bg-gray-100 text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: link.label }} />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-full bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href={route('annonces.index')} className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">Annonces.fr</span>
          </Link>
          <form onSubmit={handleSearch} className="flex-1 relative max-w-xl mx-auto">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full h-9 pl-9 pr-4 rounded-md bg-gray-100 text-sm focus:border-orange-500 focus:outline-none focus:bg-white border border-transparent transition-colors"
            />
          </form>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={route('login')} className="hidden sm:inline text-sm text-gray-500 hover:text-gray-900 px-2 py-1.5">Se connecter</Link>
            <Link href={route('annonces.create')} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors">
              <Plus size={14} />
              <span className="hidden sm:inline">Déposer</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            <button onClick={() => handleCategoryChange('')} className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${selectedCategory === '' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>Toutes</button>
            {categoriesData.map((cat) => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${selectedCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {cat.nom}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{selectedCategory ? categoriesData.find(c => c.id === selectedCategory)?.nom || 'Annonces' : 'Toutes les annonces'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{annonces?.total || 0} annonce{annonces?.total !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-md">
                {sortBy === 'recent' && 'Récentes'}
                {sortBy === 'price_asc' && 'Prix ↑'}
                {sortBy === 'price_desc' && 'Prix ↓'}
                <ChevronDown size={13} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1 min-w-[140px]">
                  {[{ value: 'recent', label: 'Plus récentes' }, { value: 'price_asc', label: 'Prix croissant' }, { value: 'price_desc', label: 'Prix décroissant' }].map((opt) => (
                    <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSort(false); }} className={`w-full text-left px-4 py-2 text-sm ${sortBy === opt.value ? 'text-orange-500 font-medium bg-gray-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {annoncesData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {annoncesData.map((annonce) => (
              <AnnonceCard key={annonce.id} annonce={annonce} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-gray-700">Aucun résultat</p>
            <p className="text-gray-500 text-sm mt-2">Essayez une autre recherche.</p>
          </div>
        )}

        <Pagination />
      </main>

      <footer className="border-t border-gray-200 mt-12 py-8 text-center text-xs text-gray-400">
        <p>© 2025 Annonces.fr</p>
      </footer>
    </div>
  );
}
