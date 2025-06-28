"use server";

import { treatmentsApi } from '@/lib/services/api';

export async function getTreatments() {
  try {
    const response = await treatmentsApi.getTreatments();
    
    if (response.success) {
      return response.treatments;
    } else {
      console.error('Error fetching treatments:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return [];
  }
}

export async function deleteTreatment(id: string) {
  try {
    const response = await treatmentsApi.deleteTreatment(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete treatment' };
    }
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return { success: false, error: 'Failed to delete treatment' };
  }
}