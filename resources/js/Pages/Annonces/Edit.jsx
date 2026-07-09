import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Edit({ annonce, categories }) {
    const { data, setData, patch, processing, errors } = useForm({
        titre: annonce.titre,
        description: annonce.description,
        prix: annonce.prix,
        category_id: annonce.category_id,
        statut: annonce.statut || 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('annonces.update', annonce.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Modifier l'annonce
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="titre" value="Titre" />
                                    <TextInput
                                        id="titre"
                                        type="text"
                                        name="titre"
                                        value={data.titre}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('titre', e.target.value)}
                                    />
                                    <InputError message={errors.titre} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        rows="6"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="prix" value="Prix (€)" />
                                    <TextInput
                                        id="prix"
                                        type="number"
                                        step="0.01"
                                        name="prix"
                                        value={data.prix}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('prix', e.target.value)}
                                    />
                                    <InputError message={errors.prix} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="category_id" value="Catégorie" />
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.nom}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="statut" value="État de l'annonce" />
                                    <select
                                        id="statut"
                                        name="statut"
                                        value={data.statut}
                                        onChange={(e) => setData('statut', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="active">Active</option>
                                        <option value="vendue">Vendue</option>
                                        <option value="archivee">Archivée</option>
                                    </select>
                                    <InputError message={errors.statut} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <Link
                                        href={route('annonces.show', annonce.id)}
                                        className="text-gray-600 hover:text-gray-900 mr-4"
                                    >
                                        Annuler
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Mettre à jour
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
