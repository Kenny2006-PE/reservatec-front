'use client';

interface HeaderProps {
  title: string;
  description: string;
  userImage?: string;
}

export default function Header({ title, description, userImage }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 font-poppins">{title}</h1>
          <p className="text-slate-600 font-medium tracking-wide text-sm sm:text-base">{description}</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm sm:text-base font-semibold text-slate-900 font-poppins">Usuario Demo</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Estudiante Activo</p>
          </div>
          {userImage ? (
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={userImage} 
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-lg font-poppins">
              UD
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
