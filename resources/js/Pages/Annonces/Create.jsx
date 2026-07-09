import { Link, useForm } from '@inertiajs/react';

export default function Create({ categories }) {
  const { data, setData, post, processing, errors } = useForm({
    titre: '',
    description: '',
    prix: '',
    category_id: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('annonces.store'));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Create Announcement</h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={data.titre}
              onChange={(e) => setData('titre', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.titre && <p className="text-red-600 text-sm mt-1">{errors.titre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (€)</label>
            <input
              type="number"
              step="0.01"
              value={data.prix}
              onChange={(e) => setData('prix', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.prix && <p className="text-red-600 text-sm mt-1">{errors.prix}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={data.category_id}
              onChange={(e) => setData('category_id', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Link href={route('annonces.index')} className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
