import React, { useEffect, useState } from 'react';
import { Carrera, UserRegisterData } from '@/types/user.types';

interface UserFormProps {
    initialData?: UserRegisterData;
    carreras: Carrera[];
    isLoading: boolean;
    onSubmit: (data: UserRegisterData) => Promise<void>;
    error?: string | null;
}

const UserForm: React.FC<UserFormProps> = ({
    initialData,
    carreras,
    isLoading,
    onSubmit,
    error
}) => {
    const [formData, setFormData] = useState<UserRegisterData>({
        nombre: '',
        apellido: '',
        dni: '',
        codigo: '',
        id_carrera: 0,
        condicion_med: '',
        correo: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'id_carrera' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Apellido */}
                <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* DNI */}
                <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                        DNI
                    </label>
                    <input
                        type="text"
                        id="dni"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                        minLength={8}
                        maxLength={8}
                        pattern="[0-9]*"
                    />
                </div>

                {/* Código */}
                <div>
                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
                        Código
                    </label>
                    <input
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                        minLength={6}
                    />
                </div>

                {/* Carrera */}
                <div>
                    <label htmlFor="id_carrera" className="block text-sm font-medium text-gray-700">
                        Carrera
                    </label>
                    <select
                        id="id_carrera"
                        name="id_carrera"
                        value={formData.id_carrera}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccione una carrera</option>
                        {carreras.map(carrera => (
                            <option key={carrera.id_carrera} value={carrera.id_carrera}>
                                {carrera.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Condición Médica */}
                <div className="md:col-span-2">
                    <label htmlFor="condicion_med" className="block text-sm font-medium text-gray-700">
                        Condición Médica (Opcional)
                    </label>
                    <textarea
                        id="condicion_med"
                        name="condicion_med"
                        value={formData.condicion_med}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {isLoading ? 'Procesando...' : initialData ? 'Actualizar' : 'Registrar'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;