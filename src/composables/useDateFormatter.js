// composables/useDateFormatter.js

import { date as quasarDate } from 'quasar'

export function useDateFormatter() {
  /**
   * Converts a date string from YYYY-MM-DD format to ISO format
   * @param {string} dateStr - Date in YYYY-MM-DD format
   * @returns {string} - Date in ISO format
   */
  const toISOFormat = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      // Handle both cases: if the string already contains time information or not
      const baseDate = dateStr.length > 10 ? dateStr.substring(0, 10) : dateStr;
      const dateObj = new Date(baseDate);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date provided:', dateStr);
        return '';
      }
      
      return dateObj.toISOString();
    } catch (e) {
      console.error('Error converting date to ISO format:', e);
      return '';
    }
  }

  /**
   * Formats a date for display in Persian calendar format
   * @param {string} dateStr - Date string in any compatible format
   * @returns {string} - Formatted date for display (YYYY/MM/DD in Persian)
   */
  const formatPersianDisplay = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      return quasarDate.formatDate(dateStr, 'YYYY/MM/DD', { calendar: 'persian' });
    } catch (e) {
      console.error('Error formatting Persian date:', e);
      return dateStr;
    }
  }

  /**
   * Formats an ISO date to YYYY-MM-DD for form inputs
   * @param {string} isoDateStr - Date in ISO format
   * @returns {string} - Date in YYYY-MM-DD format
   */
  const formatForFormInput = (isoDateStr) => {
    if (!isoDateStr) return '';
    
    try {
      // Extract just the date part
      return isoDateStr.substring(0, 10);
    } catch (e) {
      console.error('Error formatting date for form:', e);
      return '';
    }
  }

  /**
   * Converts a Persian date to ISO format (if your Persian dates need conversion)
   * Note: You would need to implement or use a library for Persian to Gregorian conversion
   * This is just a placeholder - implement with appropriate library
   * @param {string} persianDateStr - Persian date in YYYY-MM-DD format
   * @returns {string} - Date in ISO format
   */
  const persianToISO = (persianDateStr) => {
    if (!persianDateStr) return '';
    
    // If using simple Persian display but storing Gregorian dates, you might not need this
    // This is just a placeholder - implement with appropriate library if needed
    // For example, you might use a library like moment-jalaali
    
    // For now, this function just calls the regular toISOFormat
    return toISOFormat(persianDateStr);
  }

  return {
    toISOFormat,
    formatPersianDisplay,
    formatForFormInput,
    persianToISO
  }
}