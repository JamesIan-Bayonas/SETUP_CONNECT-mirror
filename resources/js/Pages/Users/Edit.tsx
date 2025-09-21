import { FormEventHandler, useRef, useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, UserType } from '@/types';

interface EditUserProps {
  user: User;
  userTypes: UserType[];
}

interface UserForm {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  user_type: string;
  is_active: boolean;
  photo?: File | null;
}

export default function Edit({ user, userTypes }: EditUserProps) {
  const { data, setData, post, processing, errors } = useForm<UserForm>({
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    user_type: user.user_type,
    is_active: user.is_active,
    photo: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.photo ? `/storage/${user.photo}` : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('photo', file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setData('photo', null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    
    // Create FormData for file uploads
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('user_type', data.user_type);
    formData.append('is_active', data.is_active ? '1' : '0');
    
    if (data.password) {
      formData.append('password', data.password);
      formData.append('password_confirmation', data.password_confirmation || '');
    }
    
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    // Use router.post for FormData with _method=PUT
    router.post(`/users/${user.id}`, formData, {
      onSuccess: () => {
        router.visit('/users');
      },
      onError: (errors) => {
        console.error('Error updating user:', errors);
      }
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Edit User: {user.name}
          </h2>
          <div className="flex space-x-4">
            <Link
              href={`/users/${user.id}`}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              View User
            </Link>
            <Link
              href="/users"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Users
            </Link>
          </div>
        </div>
      }
    >
      <Head title={`Edit User: ${user.name}`} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Photo Upload Section */}
                  <div className="lg:col-span-1">
                    <div className="flex flex-col items-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                      </label>
                      
                      <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400">
                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded"
                        >
                          Choose Photo
                        </button>
                        {previewUrl && (
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {errors.photo && (
                        <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                        User Type
                      </label>
                      <select
                        id="user_type"
                        value={data.user_type}
                        onChange={(e) => setData('user_type', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      >
                        {userTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.user_type && (
                        <p className="mt-1 text-sm text-red-600">{errors.user_type}</p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        id="is_active"
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Active Account
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password (Optional)</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                          {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                          {errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-6">
                  <Link
                    href={`/users/${user.id}`}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {processing ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}