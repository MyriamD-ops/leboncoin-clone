import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function Index({ annonces, categories, filters }) {
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('annonces.index'), {
            category_id: selectedCategory || undefined,
            search: searchTerm || undefined,
        });
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        router.get(route('annonces.index'), {
            category_id: e.target.value || undefined,
            search: searchTerm || undefined,
        });
    };

    return (
        <>
            <div className="bg-white py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Annonces</h1>
                        <Link href={route('annonces.create')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Créer une annonce
                        </Link>
                    </div>

                    <div className="mb-6 space-y-4">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Chercher par titre ou description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </form>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filtrer par catégorie
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {annonces.data.map((annonce) => (
                            <Link
                                key={annonce.id}
                                href={route('annonces.show', annonce.id)}
                                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                            >
                                <div className="bg-gray-200 h-48 flex items-center justify-center">
                                    {annonce.images.length > 0 ? (
                                        <img
                                            src={`/storage/${annonce.images[0].url}`}
                                            alt={annonce.titre}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500">Pas d'image</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{annonce.titre}</h3>
                                    <p className="text-blue-600 text-lg font-bold mb-2">{annonce.prix}€</p>
                                    <p className="text-sm text-gray-600">{annonce.category.nom}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {annonces.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Aucune annonce trouvée</p>
                        </div>
                    )}

                    {annonces.links && annonces.links.length > 3 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {annonces.links.map((link, idx) => (
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`px-3 py-2 rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="px-3 py-2 rounded bg-gray-100 text-gray-500"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
