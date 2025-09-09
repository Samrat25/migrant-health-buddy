// Local Storage Utility for Migrant Health Buddy
// This utility manages all data persistence for the application

export interface PatientData {
  id: string;
  aadhaarNumber: string;
  mobileNumber: string;
  personalInfo: {
    name: string;
    age: string;
    gender: string;
    occupation: string;
    state: string;
    city: string;
    verified?: boolean;
    rejectionReason?: string;
  };
  surveyData?: any;
  reports?: any[];
  analysis?: any;
  healthGoals?: any[];
  bookings?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorData {
  id: string;
  registerId: string;
  fullName: string;
  licenseNumber: string;
  specialization: string;
  qualification: string;
  experience: string;
  hospitalAffiliation: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
  documents: any[];
  status: 'pending-verification' | 'verified' | 'rejected';
  registrationDate: string;
  verifiedDate?: string;
  verifiedBy?: string;
}

export interface HealthCampData {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: { lat: number; lng: number };
  specializations: string[];
  requirements: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  status: 'active' | 'inactive' | 'completed';
  createdDate: string;
  createdBy: string;
}

export interface VerificationData {
  id: string;
  userId: string;
  userType: 'patient' | 'doctor';
  status: 'pending' | 'verified' | 'failed' | 'approved' | 'rejected';
  submittedDate: string;
  verifiedDate?: string;
  verifiedBy?: string;
  biometricVerified?: boolean;
  documents: any[];
}

export interface AnalysisData {
  id: string;
  patientId: string;
  surveyData: any;
  reports: any[];
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  riskFactors: string[];
  reportFindings: string[];
  recommendations: string[];
  healthGoals: any[];
  summary: string;
  nextSteps: string[];
  createdAt: string;
}

export interface BookingData {
  id: string;
  patientId: string;
  campId: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

class StorageManager {
  private static instance: StorageManager;
  
  private constructor() {}
  
  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Generic methods for localStorage operations
  private getItem<T>(key: string): T[] {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  private updateItem<T extends { id: string }>(key: string, id: string, updates: Partial<T>): boolean {
    try {
      const items = this.getItem<T>(key);
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        this.setItem(key, items);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating ${key} item:`, error);
      return false;
    }
  }

  // Patient Data Management
  public getPatients(): PatientData[] {
    return this.getItem<PatientData>('patients');
  }

  public getPatient(id: string): PatientData | null {
    const patients = this.getPatients();
    return patients.find(p => p.id === id) || null;
  }

  public getPatientByAadhaar(aadhaar: string): PatientData | null {
    const patients = this.getPatients();
    return patients.find(p => p.aadhaarNumber === aadhaar) || null;
  }

  public savePatient(patient: PatientData): void {
    const patients = this.getPatients();
    const existingIndex = patients.findIndex(p => p.id === patient.id);
    
    if (existingIndex !== -1) {
      patients[existingIndex] = { ...patient, updatedAt: new Date().toISOString() };
    } else {
      patients.push({ ...patient, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    this.setItem('patients', patients);
  }

  public updatePatient(id: string, updates: Partial<PatientData>): boolean {
    return this.updateItem<PatientData>('patients', id, updates);
  }

  // Doctor Data Management
  public getDoctors(): DoctorData[] {
    return this.getItem<DoctorData>('doctors');
  }

  public getDoctor(id: string): DoctorData | null {
    const doctors = this.getDoctors();
    return doctors.find(d => d.id === id) || null;
  }

  public getDoctorByRegisterId(registerId: string): DoctorData | null {
    const doctors = this.getDoctors();
    return doctors.find(d => d.registerId === registerId) || null;
  }

  public saveDoctor(doctor: DoctorData): void {
    const doctors = this.getDoctors();
    const existingIndex = doctors.findIndex(d => d.id === doctor.id);
    
    if (existingIndex !== -1) {
      doctors[existingIndex] = { ...doctor, updatedAt: new Date().toISOString() };
    } else {
      doctors.push({ ...doctor, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    this.setItem('doctors', doctors);
  }

  public updateDoctorStatus(id: string, status: DoctorData['status'], verifiedBy?: string): boolean {
    const updates: Partial<DoctorData> = { 
      status,
      verifiedDate: new Date().toISOString(),
      verifiedBy: verifiedBy || 'admin'
    };
    return this.updateItem<DoctorData>('doctors', id, updates);
  }

  // Health Camp Management
  public getHealthCamps(): HealthCampData[] {
    return this.getItem<HealthCampData>('healthCamps');
  }

  public getHealthCamp(id: string): HealthCampData | null {
    const camps = this.getHealthCamps();
    return camps.find(c => c.id === id) || null;
  }

  public saveHealthCamp(camp: HealthCampData): void {
    const camps = this.getHealthCamps();
    const existingIndex = camps.findIndex(c => c.id === camp.id);
    
    if (existingIndex !== -1) {
      camps[existingIndex] = { ...camp, updatedAt: new Date().toISOString() };
    } else {
      camps.push({ ...camp, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    this.setItem('healthCamps', camps);
  }

  public updateCampBooking(campId: string, increment: boolean): boolean {
    const camps = this.getHealthCamps();
    const camp = camps.find(c => c.id === campId);
    if (camp) {
      camp.booked = increment ? camp.booked + 1 : Math.max(0, camp.booked - 1);
      this.setItem('healthCamps', camps);
      return true;
    }
    return false;
  }

  // Verification Management
  public getVerifications(): VerificationData[] {
    return this.getItem<VerificationData>('verifications');
  }

  public getVerification(id: string): VerificationData | null {
    const verifications = this.getVerifications();
    return verifications.find(v => v.id === id) || null;
  }

  public saveVerification(verification: VerificationData): void {
    const verifications = this.getVerifications();
    const existingIndex = verifications.findIndex(v => v.id === verification.id);
    
    if (existingIndex !== -1) {
      verifications[existingIndex] = { ...verification, updatedAt: new Date().toISOString() };
    } else {
      verifications.push({ ...verification, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    this.setItem('verifications', verifications);
  }

  public updateVerificationStatus(id: string, status: VerificationData['status'], verifiedBy?: string): boolean {
    const updates: Partial<VerificationData> = { 
      status,
      verifiedDate: new Date().toISOString(),
      verifiedBy: verifiedBy || 'admin'
    };
    return this.updateItem<VerificationData>('verifications', id, updates);
  }

  // Analysis Management
  public getAnalyses(): AnalysisData[] {
    return this.getItem<AnalysisData>('analyses');
  }

  public getAnalysis(id: string): AnalysisData | null {
    const analyses = this.getAnalyses();
    return analyses.find(a => a.id === id) || null;
  }

  public getAnalysisByPatient(patientId: string): AnalysisData | null {
    const analyses = this.getAnalyses();
    return analyses.find(a => a.patientId === patientId) || null;
  }

  public saveAnalysis(analysis: AnalysisData): void {
    const analyses = this.getAnalyses();
    const existingIndex = analyses.findIndex(a => a.id === analysis.id);
    
    if (existingIndex !== -1) {
      analyses[existingIndex] = { ...analysis, updatedAt: new Date().toISOString() };
    } else {
      analyses.push({ ...analysis, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    this.setItem('analyses', analyses);
  }

  // Booking Management
  public getBookings(): BookingData[] {
    return this.getItem<BookingData>('bookings');
  }

  public getBookingsByPatient(patientId: string): BookingData[] {
    const bookings = this.getBookings();
    return bookings.filter(b => b.patientId === patientId);
  }

  public getBookingsByCamp(campId: string): BookingData[] {
    const bookings = this.getBookings();
    return bookings.filter(b => b.campId === campId);
  }

  public saveBooking(booking: BookingData): void {
    const bookings = this.getBookings();
    const existingIndex = bookings.findIndex(b => b.id === booking.id);
    
    if (existingIndex !== -1) {
      bookings[existingIndex] = { ...booking, updatedAt: new Date().toISOString() };
    } else {
      bookings.push({ ...booking, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    this.setItem('bookings', bookings);
  }

  public updateBookingStatus(id: string, status: BookingData['status']): boolean {
    return this.updateItem<BookingData>('bookings', id, { status });
  }

  // Survey Data Management
  public getSurveys(): any[] {
    return this.getItem<any>('healthSurveys');
  }

  public saveSurvey(survey: any): void {
    const surveys = this.getSurveys();
    surveys.push({ ...survey, id: Date.now().toString(), timestamp: new Date().toISOString() });
    this.setItem('healthSurveys', surveys);
  }

  // Report Management
  public getReports(): any[] {
    return this.getItem<any>('medicalReports');
  }

  public saveReports(reports: any[]): void {
    const existingReports = this.getReports();
    const newReports = reports.map(report => ({
      ...report,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      uploadDate: new Date().toISOString()
    }));
    this.setItem('medicalReports', [...existingReports, ...newReports]);
  }

  // Health Goals Management
  public getHealthGoals(): any[] {
    return this.getItem<any>('healthGoals');
  }

  public saveHealthGoals(goals: any[]): void {
    this.setItem('healthGoals', goals);
  }

  public getCompletedGoals(): number[] {
    try {
      const completed = localStorage.getItem('completedHealthGoals');
      return completed ? JSON.parse(completed) : [];
    } catch (error) {
      console.error('Error reading completed goals:', error);
      return [];
    }
  }

  public saveCompletedGoals(goals: number[]): void {
    try {
      localStorage.setItem('completedHealthGoals', JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving completed goals:', error);
    }
  }

  // Utility Methods
  public clearAllData(): void {
    const keys = [
      'patients', 'doctors', 'healthCamps', 'verifications', 'analyses', 
      'bookings', 'healthSurveys', 'medicalReports', 'healthGoals', 
      'completedHealthGoals', 'currentPatient', 'currentDoctor'
    ];
    
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  public exportData(): string {
    const data = {
      patients: this.getPatients(),
      doctors: this.getDoctors(),
      healthCamps: this.getHealthCamps(),
      verifications: this.getVerifications(),
      analyses: this.getAnalyses(),
      bookings: this.getBookings(),
      surveys: this.getSurveys(),
      reports: this.getReports(),
      healthGoals: this.getHealthGoals(),
      completedGoals: this.getCompletedGoals(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.patients) this.setItem('patients', data.patients);
      if (data.doctors) this.setItem('doctors', data.doctors);
      if (data.healthCamps) this.setItem('healthCamps', data.healthCamps);
      if (data.verifications) this.setItem('verifications', data.verifications);
      if (data.analyses) this.setItem('analyses', data.analyses);
      if (data.bookings) this.setItem('bookings', data.bookings);
      if (data.surveys) this.setItem('healthSurveys', data.surveys);
      if (data.reports) this.setItem('medicalReports', data.reports);
      if (data.healthGoals) this.setItem('healthGoals', data.healthGoals);
      if (data.completedGoals) this.saveCompletedGoals(data.completedGoals);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Current Session Management
  public setCurrentPatient(patient: PatientData): void {
    localStorage.setItem('currentPatient', JSON.stringify(patient));
  }

  public getCurrentPatient(): PatientData | null {
    try {
      const patient = localStorage.getItem('currentPatient');
      return patient ? JSON.parse(patient) : null;
    } catch (error) {
      console.error('Error reading current patient:', error);
      return null;
    }
  }

  public setCurrentDoctor(doctor: DoctorData): void {
    localStorage.setItem('currentDoctor', JSON.stringify(doctor));
  }

  public getCurrentDoctor(): DoctorData | null {
    try {
      const doctor = localStorage.getItem('currentDoctor');
      return doctor ? JSON.parse(doctor) : null;
    } catch (error) {
      console.error('Error reading current doctor:', error);
      return null;
    }
  }

  public clearCurrentSession(): void {
    localStorage.removeItem('currentPatient');
    localStorage.removeItem('currentDoctor');
  }
}

export const storage = StorageManager.getInstance();
export default storage;
