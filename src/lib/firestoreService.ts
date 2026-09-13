import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { ScamAnalysisReport } from '../types';

/**
 * Save an analysis report for a specific authenticated user in Firestore:
 * Path: users/{userId}/scamReports/{reportId}
 */
export async function saveUserReportToCloud(
  userId: string,
  report: ScamAnalysisReport
): Promise<void> {
  try {
    const reportRef = doc(db, 'users', userId, 'scamReports', report.id);
    await setDoc(reportRef, {
      ...report,
      userId,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving report to Firestore:', error);
    throw error;
  }
}

/**
 * Fetch all reports belonging to a user from Firestore
 */
export async function fetchUserReportsFromCloud(
  userId: string
): Promise<ScamAnalysisReport[]> {
  try {
    const reportsCol = collection(db, 'users', userId, 'scamReports');
    const q = query(reportsCol, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const results: ScamAnalysisReport[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as ScamAnalysisReport;
      results.push(data);
    });
    return results;
  } catch (error) {
    console.error('Error fetching reports from Firestore:', error);
    return [];
  }
}

/**
 * Delete a user's report by ID from Firestore
 */
export async function deleteUserReportFromCloud(
  userId: string,
  reportId: string
): Promise<void> {
  try {
    const reportRef = doc(db, 'users', userId, 'scamReports', reportId);
    await deleteDoc(reportRef);
  } catch (error) {
    console.error('Error deleting report from Firestore:', error);
    throw error;
  }
}
