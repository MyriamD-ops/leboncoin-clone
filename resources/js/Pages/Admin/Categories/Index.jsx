import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { router } from '@inertiajs/react';

export default function Index({ categories }) {
    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr?')) {
            router.delete(route('categories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Catégories
                    </h2>
                    <Link href={route('categories.create')}>
                        <PrimaryButton>Ajouter une catégorie</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {categories.length === 0 ? (
                                <p className="text-gray-600">Aucune catégorie créée</p>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Nom</th>
                                            <th className="text-left p-3">Slug</th>
                                            <th className="text-right p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr key={category.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{category.nom}</td>
                                                <td className="p-3">{category.slug}</td>
                                                <td className="p-3 text-right space-x-2">
                                                    <Link href={route('categories.edit', category.id)}>
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            Modifier
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
