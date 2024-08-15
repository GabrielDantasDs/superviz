import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useRouter } from 'next/navigation';

export default function Home() {
  const participant = useSelector((state: RootState) => state.participant);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // useEffect(() => {
  //   if (participant.id) {
  //     router.push('/meeting');
  //     setIsLoading(false);
  //   }
  // }, [participant]);

  const navigateToCreateMeeting = () => {
    router.push('/create-meeting');
  }

  const navigateToJoinMeeting = () => {
    router.push('/join-meeting');
  }

  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage: `linear-gradient(rgba(8, 90, 213, 0.7), rgba(128, 90, 213, 0.7)), url('./background.jpg')`,
    }}
  >
    <div className="text-center text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Bem vindo ao Gerenciador de Projeto em Tempo Real</h1>
      <p className="text-lg md:text-xl mb-8">
        O melhor lugar para gerenciar seus projetos com eficiência e colaborar em tempo real com sua equipe.
      </p>
      <button
        onClick={navigateToJoinMeeting}
        className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Participe de uma reunião agora
      </button>
      <button
        onClick={navigateToCreateMeeting}
        className="bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Crie sua reunião
      </button>
    </div>
  </div>
  );
}
