import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

interface LogEntry {
  action: string;
  performedBy: string;
  performedByEmail?: string;
  targetUser?: string;
  targetUserEmail?: string;
  competitionId?: string;
  details?: string;
}

export const logSystemEvent = async (log: LogEntry) => {
  try {
    await addDoc(collection(db, 'systemLogs'), {
      ...log,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error writing system log:', error);
  }
};

