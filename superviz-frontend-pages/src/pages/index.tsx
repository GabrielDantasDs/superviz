import { useEffect, useState } from 'react';
import useFetchParticipant from './useFetchParticipant';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useRouter } from 'next/navigation';

export default function Home() {
  useFetchParticipant();
  const participant = useSelector((state: RootState) => state.participant);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (participant.id) {
      router.push('/meeting');
      setIsLoading(false);
    }
  }, [participant]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {participant.name}</h1>
      {/* Restante do conteúdo da página */}
    </div>
  );
}
