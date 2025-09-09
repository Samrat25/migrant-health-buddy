// Demo Data Seeder for Migrant Health Buddy
// This file contains sample data to populate the system for demonstration purposes

import { storage, PatientData, DoctorData, HealthCampData } from './storage';

export const seedDemoData = () => {
  // Clear existing data
  storage.clearAllData();

  // Sample Patients
  const samplePatients: PatientData[] = [
    {
      id: '1',
      aadhaarNumber: '123456789012',
      mobileNumber: '+91 9876543210',
      personalInfo: {
        name: 'Rajesh Kumar',
        age: '35',
        gender: 'male',
        occupation: 'Construction Worker',
        state: 'Maharashtra',
        city: 'Mumbai'
      },
      surveyData: {
        personalInfo: { age: '35', gender: 'male', occupation: 'Construction Worker', state: 'Maharashtra' },
        symptoms: ['Cough', 'Fatigue', 'Body aches'],
        exposure: { travelHistory: 'yes', crowdedPlaces: 'yes', sickContact: 'no' },
        healthHistory: { chronicDiseases: ['Hypertension'], medications: 'Blood pressure medication', allergies: 'None' }
      },
      reports: [
        {
          id: '1',
          name: 'blood_test_jan_2024.pdf',
          type: 'application/pdf',
          size: 1024000,
          uploadDate: '2024-01-15T10:30:00Z',
          content: {
            type: 'Blood Test',
            values: {
              hemoglobin: '11.5 g/dL',
              wbc: '8,200 cells/μL',
              rbc: '4.0 million cells/μL',
              platelets: '280,000 cells/μL',
              glucose: '110 mg/dL',
              cholesterol: '220 mg/dL'
            },
            normalRanges: {
              hemoglobin: '12.0-15.5 g/dL',
              wbc: '4,000-11,000 cells/μL',
              rbc: '4.0-5.2 million cells/μL',
              platelets: '150,000-450,000 cells/μL',
              glucose: '70-100 mg/dL',
              cholesterol: '<200 mg/dL'
            }
          }
        }
      ],
      analysis: {
        riskLevel: 'medium',
        riskScore: 45,
        riskFactors: ['Current symptoms: Cough, Fatigue, Body aches', 'Recent travel history', 'Recent exposure to crowded places', 'Chronic conditions: Hypertension'],
        reportFindings: ['Glucose levels are elevated - monitor for diabetes', 'Cholesterol levels are high - dietary changes recommended'],
        recommendations: ['Schedule appointment with healthcare provider', 'Continue monitoring symptoms', 'Maintain good hygiene practices', 'Monitor blood pressure daily'],
        healthGoals: [
          { id: 1, title: 'Complete Health Checkup', description: 'Schedule and complete comprehensive health examination', deadline: '30 days', priority: 'medium', completed: false },
          { id: 2, title: 'Improve Physical Activity', description: 'Engage in 30 minutes of moderate exercise daily', deadline: 'Ongoing', priority: 'medium', completed: false },
          { id: 3, title: 'Medication Adherence', description: 'Take prescribed medications as directed', deadline: 'Daily', priority: 'high', completed: false }
        ],
        summary: 'Based on your health assessment, you are a 35-year-old male with 3 current symptoms and 1 chronic conditions. Your overall risk level is assessed as medium. 1 medical reports have been analyzed to provide comprehensive health insights.',
        nextSteps: ['Schedule routine checkup within 2 weeks', 'Continue current medications', 'Book health camp for preventive screening', 'Maintain healthy lifestyle practices']
      },
      healthGoals: [
        { id: 1, title: 'Complete Health Checkup', description: 'Schedule and complete comprehensive health examination', deadline: '30 days', priority: 'medium', completed: false },
        { id: 2, title: 'Improve Physical Activity', description: 'Engage in 30 minutes of moderate exercise daily', deadline: 'Ongoing', priority: 'medium', completed: false },
        { id: 3, title: 'Medication Adherence', description: 'Take prescribed medications as directed', deadline: 'Daily', priority: 'high', completed: false }
      ],
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      aadhaarNumber: '234567890123',
      mobileNumber: '+91 9123456789',
      personalInfo: {
        name: 'Priya Sharma',
        age: '28',
        gender: 'female',
        occupation: 'Domestic Worker',
        state: 'Maharashtra',
        city: 'Pune'
      },
      surveyData: {
        personalInfo: { age: '28', gender: 'female', occupation: 'Domestic Worker', state: 'Maharashtra' },
        symptoms: ['Headache'],
        exposure: { travelHistory: 'no', crowdedPlaces: 'no', sickContact: 'no' },
        healthHistory: { chronicDiseases: [], medications: '', allergies: 'Dust allergy' }
      },
      reports: [],
      analysis: {
        riskLevel: 'low',
        riskScore: 15,
        riskFactors: ['Current symptoms: Headache'],
        reportFindings: [],
        recommendations: ['Continue preventive healthcare measures', 'Regular health checkups as scheduled', 'Maintain healthy lifestyle'],
        healthGoals: [
          { id: 1, title: 'Complete Health Checkup', description: 'Schedule and complete comprehensive health examination', deadline: '30 days', priority: 'medium', completed: false },
          { id: 2, title: 'Improve Physical Activity', description: 'Engage in 30 minutes of moderate exercise daily', deadline: 'Ongoing', priority: 'medium', completed: false }
        ],
        summary: 'Based on your health assessment, you are a 28-year-old female with 1 current symptoms and 0 chronic conditions. Your overall risk level is assessed as low. 0 medical reports have been analyzed to provide comprehensive health insights.',
        nextSteps: ['Continue preventive care routine', 'Schedule annual health camp visit', 'Maintain current health practices', 'Stay updated with preventive screenings']
      },
      healthGoals: [
        { id: 1, title: 'Complete Health Checkup', description: 'Schedule and complete comprehensive health examination', deadline: '30 days', priority: 'medium', completed: false },
        { id: 2, title: 'Improve Physical Activity', description: 'Engage in 30 minutes of moderate exercise daily', deadline: 'Ongoing', priority: 'medium', completed: false }
      ],
      createdAt: '2024-01-12T09:15:00Z',
      updatedAt: '2024-01-12T09:15:00Z'
    },
    {
      id: '3',
      aadhaarNumber: '345678901234',
      mobileNumber: '+91 9988776655',
      personalInfo: {
        name: 'Mohammed Ali',
        age: '42',
        gender: 'male',
        occupation: 'Factory Worker',
        state: 'Maharashtra',
        city: 'Thane'
      },
      surveyData: {
        personalInfo: { age: '42', gender: 'male', occupation: 'Factory Worker', state: 'Maharashtra' },
        symptoms: ['Fever', 'Cough', 'Shortness of breath', 'Fatigue'],
        exposure: { travelHistory: 'yes', crowdedPlaces: 'yes', sickContact: 'yes' },
        healthHistory: { chronicDiseases: ['Diabetes', 'Asthma'], medications: 'Diabetes medication, Inhaler', allergies: 'None' }
      },
      reports: [
        {
          id: '2',
          name: 'chest_xray_feb_2024.jpg',
          type: 'image/jpeg',
          size: 2048000,
          uploadDate: '2024-02-01T14:20:00Z',
          content: {
            type: 'X-Ray',
            findings: 'Mild congestion in lower lobes, no signs of pneumonia',
            impression: 'Mild respiratory congestion, follow-up recommended'
          }
        }
      ],
      analysis: {
        riskLevel: 'high',
        riskScore: 75,
        riskFactors: ['Current symptoms: Fever, Cough, Shortness of breath, Fatigue', 'Recent travel history', 'Recent exposure to crowded places', 'Contact with sick individuals', 'Chronic conditions: Diabetes, Asthma'],
        reportFindings: ['Mild congestion in lower lobes, no signs of pneumonia'],
        recommendations: ['Immediate medical consultation recommended', 'Self-isolation until cleared by healthcare provider', 'Monitor symptoms closely', 'Monitor blood sugar levels regularly'],
        healthGoals: [
          { id: 1, title: 'Complete Health Checkup', description: 'Schedule and complete comprehensive health examination', deadline: '30 days', priority: 'high', completed: false },
          { id: 2, title: 'Improve Physical Activity', description: 'Engage in 30 minutes of moderate exercise daily', deadline: 'Ongoing', priority: 'medium', completed: false },
          { id: 3, title: 'Medication Adherence', description: 'Take prescribed medications as directed', deadline: 'Daily', priority: 'high', completed: false },
          { id: 4, title: 'Follow-up Testing', description: 'Schedule follow-up blood tests in 3 months', deadline: '90 days', priority: 'medium', completed: false }
        ],
        summary: 'Based on your health assessment, you are a 42-year-old male with 4 current symptoms and 2 chronic conditions. Your overall risk level is assessed as high. 1 medical reports have been analyzed to provide comprehensive health insights.',
        nextSteps: ['Contact healthcare provider immediately', 'Book nearest health camp consultation', 'Follow isolation guidelines if symptomatic', 'Monitor vital signs regularly']
      },
      healthGoals: [
        { id: 1, title: 'Complete Health Checkup', description: 'Schedule and complete comprehensive health examination', deadline: '30 days', priority: 'high', completed: false },
        { id: 2, title: 'Improve Physical Activity', description: 'Engage in 30 minutes of moderate exercise daily', deadline: 'Ongoing', priority: 'medium', completed: false },
        { id: 3, title: 'Medication Adherence', description: 'Take prescribed medications as directed', deadline: 'Daily', priority: 'high', completed: false },
        { id: 4, title: 'Follow-up Testing', description: 'Schedule follow-up blood tests in 3 months', deadline: '90 days', priority: 'medium', completed: false }
      ],
      createdAt: '2024-01-08T11:30:00Z',
      updatedAt: '2024-02-01T14:20:00Z'
    }
  ];

  // Sample Doctors
  const sampleDoctors: DoctorData[] = [
    {
      id: '1',
      registerId: 'MH-12345',
      fullName: 'Dr. Amit Patel',
      licenseNumber: 'LIC-123456789',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD',
      experience: '8',
      hospitalAffiliation: 'City General Hospital',
      phone: '+91 9876543210',
      email: 'amit.patel@hospital.com',
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400001',
      documents: [
        { name: 'medical_license.pdf', type: 'application/pdf', size: 1024000 },
        { name: 'id_proof.jpg', type: 'image/jpeg', size: 512000 }
      ],
      status: 'verified',
      registrationDate: '2024-01-01T00:00:00Z',
      verifiedDate: '2024-01-02T00:00:00Z',
      verifiedBy: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: '2',
      registerId: 'MH-67890',
      fullName: 'Dr. Priya Sharma',
      licenseNumber: 'LIC-987654321',
      specialization: 'Internal Medicine',
      qualification: 'MBBS, MD',
      experience: '12',
      hospitalAffiliation: 'Metro Health Center',
      phone: '+91 9123456789',
      email: 'priya.sharma@metro.com',
      state: 'Maharashtra',
      city: 'Pune',
      pincode: '411001',
      documents: [
        { name: 'medical_license.pdf', type: 'application/pdf', size: 1024000 },
        { name: 'qualification_cert.pdf', type: 'application/pdf', size: 2048000 }
      ],
      status: 'verified',
      registrationDate: '2024-01-05T00:00:00Z',
      verifiedDate: '2024-01-06T00:00:00Z',
      verifiedBy: 'admin',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-06T00:00:00Z'
    },
    {
      id: '3',
      registerId: 'MH-54321',
      fullName: 'Dr. Rajesh Kumar',
      licenseNumber: 'LIC-456789123',
      specialization: 'Pulmonology',
      qualification: 'MBBS, MD, DM',
      experience: '15',
      hospitalAffiliation: 'Breathing Easy Clinic',
      phone: '+91 9988776655',
      email: 'rajesh.kumar@breathing.com',
      state: 'Maharashtra',
      city: 'Thane',
      pincode: '400601',
      documents: [
        { name: 'medical_license.pdf', type: 'application/pdf', size: 1024000 },
        { name: 'specialization_cert.pdf', type: 'application/pdf', size: 1536000 }
      ],
      status: 'pending-verification',
      registrationDate: '2024-01-20T00:00:00Z',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ];

  // Sample Health Camps
  const sampleHealthCamps: HealthCampData[] = [
    {
      id: '1',
      name: 'Central Mumbai Health Camp',
      description: 'Free health checkup and consultation for migrant workers',
      date: '2024-02-15',
      startTime: '09:00',
      endTime: '17:00',
      capacity: 100,
      booked: 45,
      address: 'Plot No. 123, Near Central Railway Station, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      location: { lat: 19.0760, lng: 72.8777 },
      specializations: ['General Medicine', 'Internal Medicine', 'Infectious Diseases'],
      requirements: 'Bring ID proof, any existing medical reports',
      contactPerson: 'Dr. Amit Sharma',
      contactPhone: '+91 9876543210',
      contactEmail: 'contact@centralcamp.com',
      status: 'active',
      createdDate: '2024-01-15T00:00:00Z',
      createdBy: 'admin',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'North Zone Health Camp',
      description: 'Comprehensive health screening and preventive care',
      date: '2024-02-20',
      startTime: '08:00',
      endTime: '16:00',
      capacity: 75,
      booked: 32,
      address: 'Community Center, Sector 15, Navi Mumbai',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400703',
      location: { lat: 19.0330, lng: 73.0297 },
      specializations: ['Family Medicine', 'Pulmonology', 'Cardiology'],
      requirements: 'Bring Aadhaar card, previous medical reports if any',
      contactPerson: 'Dr. Priya Patel',
      contactPhone: '+91 9123456789',
      contactEmail: 'contact@northzone.com',
      status: 'active',
      createdDate: '2024-01-18T00:00:00Z',
      createdBy: 'admin',
      createdAt: '2024-01-18T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z'
    },
    {
      id: '3',
      name: 'East Side Mobile Clinic',
      description: 'Mobile health camp for construction workers',
      date: '2024-02-25',
      startTime: '10:00',
      endTime: '18:00',
      capacity: 50,
      booked: 28,
      address: 'Near Construction Site, Powai, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      location: { lat: 19.1197, lng: 72.9064 },
      specializations: ['Emergency Medicine', 'General Medicine'],
      requirements: 'Bring work ID, any safety equipment',
      contactPerson: 'Dr. Rajesh Kumar',
      contactPhone: '+91 9988776655',
      contactEmail: 'contact@mobilesite.com',
      status: 'active',
      createdDate: '2024-01-22T00:00:00Z',
      createdBy: 'admin',
      createdAt: '2024-01-22T00:00:00Z',
      updatedAt: '2024-01-22T00:00:00Z'
    }
  ];

  // Save all sample data
  samplePatients.forEach(patient => storage.savePatient(patient));
  sampleDoctors.forEach(doctor => storage.saveDoctor(doctor));
  sampleHealthCamps.forEach(camp => storage.saveHealthCamp(camp));

  // Set some completed goals
  storage.saveCompletedGoals([1, 2]); // Rajesh has completed 2 goals

  console.log('Demo data seeded successfully!');
  console.log(`- ${samplePatients.length} patients`);
  console.log(`- ${sampleDoctors.length} doctors`);
  console.log(`- ${sampleHealthCamps.length} health camps`);
};

// Function to clear demo data
export const clearDemoData = () => {
  storage.clearAllData();
  console.log('Demo data cleared successfully!');
};

// Auto-seed demo data if localStorage is empty
if (typeof window !== 'undefined' && localStorage.getItem('patients') === null) {
  seedDemoData();
}
