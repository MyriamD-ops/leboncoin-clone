import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ annonce }) {
    const { auth } = usePage().props;
    const [mainImage, setMainImage] = useState(
        annonce.images?.length > 0 ? annonce.images[0] : null
    );

    const isOwner = auth?.user?.id === annonce.user_id;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Link href={route('annonces.index')} className="text-blue-600 hover:text-blue-900 mb-4">
                    ← Retour aux annonces
                </Link>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            {mainImage ? (
                                <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
                                    <img
                                        src={`/storage/${mainImage.url}`}
                                        alt={annonce.titre}
                                        className="w-full h-auto"
                                    />
                                </div>
                            ) : (
                                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-4">
                                    <span className="text-gray-500">Pas d'image</span>
                                </div>
                            )}

                            {annonce.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {annonce.images.map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setMainImage(img)}
                                            className={`rounded border-2 overflow-hidden ${
                                                mainImage.id === img.id
                                                    ? 'border-blue-600'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${img.url}`}
                                                alt="thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold mb-4">{annonce.titre}</h1>
                            <p className="text-4xl font-bold text-blue-600 mb-6">{annonce.prix}€</p>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-600">Catégorie</p>
                                <p className="text-lg font-semibold">{annonce.category.nom}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-600">Publié par</p>
                                <p className="text-lg font-semibold">{annonce.user.name}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-600">État de l'annonce</p>
                                <p className="text-lg font-semibold capitalize">{annonce.statut}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-2">Description</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {annonce.description}
                                </p>
                            </div>

                            {isOwner && (
                                <div className="flex gap-4">
                                    <Link
                                        href={route('annonces.edit', annonce.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Modifier
                                    </Link>
                                    <Link
                                        href={route('annonces.destroy', annonce.id)}
                                        method="delete"
                                        as="button"
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        onClick={(e) => {
                                            if (!confirm('Êtes-vous sûr?')) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        Supprimer
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
