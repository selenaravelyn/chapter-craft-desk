import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Tenta carregar usuário do localStorage
    const storedUser = localStorage.getItem('storylab_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    // Usuário padrão para demonstração
    return {
      id: '1',
      name: 'Escritora',
      email: 'escritora@storylab.com',
    };
  });

  // Persiste o usuário no localStorage sempre que mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('storylab_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('storylab_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Simulação de login
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email: email,
    };
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulação de cadastro
    const mockUser: User = {
      id: '1',
      name: name,
      email: email,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser({
      id: '1',
      name: 'Escritora',
      email: 'escritora@storylab.com',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
