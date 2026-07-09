import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Edit({ category }) {
    const { data, setData, patch, processing, errors } = useForm({
        nom: category.nom,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('categories.update', category.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Modifier la catégorie
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="nom" value="Nom" />

                                    <TextInput
                                        id="nom"
                                        type="text"
                                        name="nom"
                                        value={data.nom}
                                        className="mt-1 block w-full"
                                        autoComplete="nom"
                                        isFocused={true}
                                        onChange={(e) => setData('nom', e.target.value)}
                                    />

                                    <InputError message={errors.nom} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <Link
                                        href={route('categories.index')}
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
