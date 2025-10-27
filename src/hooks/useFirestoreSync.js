import { useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Hook para sincronizar datos con Firestore
export function useFirestoreSync(user, dataKey, data, setData) {
  // Cargar datos al montar
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData[dataKey]) {
            setData(userData[dataKey]);
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    loadData();
  }, [user]);

  // Guardar datos cuando cambien
  useEffect(() => {
    if (!user || !data) return;

    const saveData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          [dataKey]: data,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error('Error guardando datos:', error);
      }
    };

    // Debounce: guardar 1 segundo después del último cambio
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [user, data, dataKey]);
}
