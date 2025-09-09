# Migrant Health Buddy - Comprehensive Health Management System

A comprehensive health management system designed specifically for migrant workers, featuring AI-driven health analysis, biometric verification, and health camp management.

## 🚀 Features

### Patient Portal
- **Aadhaar-based Authentication**: Secure login using Aadhaar number and mobile verification
- **Comprehensive Health Survey**: Multi-step health assessment covering:
  - Personal information (age, gender, occupation, location)
  - Current symptoms tracking
  - Exposure history (travel, crowded places, sick contacts)
  - Medical history (chronic diseases, medications, allergies)
- **Report Upload System**: Upload blood reports, X-rays, and medical documents
- **AI-Driven Health Analysis**: 
  - Risk assessment based on survey and reports
  - Automated report analysis
  - Personalized health recommendations
  - Risk level classification (Low/Medium/High)
- **Pre-Diagnosis System**: Preliminary health assessment with urgency levels
- **Sustainable Health Goals**: Personalized health goals with progress tracking
- **Health Camp Booking**: Find and book nearby health camps
- **Progress Dashboard**: Real-time health journey tracking

### Doctor Portal
- **Doctor Registration**: Complete registration with unique medical register ID
- **Patient Management**: View and manage patient assessments
- **Risk-based Patient Sorting**: Filter patients by risk levels
- **Prescription Management**: Create and send prescriptions
- **WhatsApp Integration**: Send prescriptions directly to patients
- **Health Camp Scheduling**: Schedule and manage health camps

### Admin Portal
- **Biometric Verification**: Advanced biometric authentication for user verification
- **Manual Approval System**: Approve/reject doctors and patients
- **Health Camp Management**: Create, manage, and monitor health camps
- **Real-time Analytics**: System usage and health insights
- **User Verification**: Comprehensive verification workflow
- **Camp Mapping**: Geographic location management for health camps

## 🛠️ Technical Implementation

### Local Storage Integration
- **Comprehensive Data Management**: All data persisted in browser localStorage
- **Patient Data**: Complete patient profiles with health assessments
- **Doctor Data**: Doctor registrations with verification status
- **Health Camps**: Camp information with booking management
- **Analyses**: AI-generated health analyses with recommendations
- **Bookings**: Patient camp bookings and management

### Data Models
```typescript
interface PatientData {
  id: string;
  aadhaarNumber: string;
  mobileNumber: string;
  personalInfo: PersonalInfo;
  surveyData?: SurveyData;
  reports?: MedicalReport[];
  analysis?: HealthAnalysis;
  healthGoals?: HealthGoal[];
  bookings?: Booking[];
}

interface DoctorData {
  id: string;
  registerId: string;
  fullName: string;
  licenseNumber: string;
  specialization: string;
  status: 'pending-verification' | 'verified' | 'rejected';
  // ... other fields
}

interface HealthCampData {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  capacity: number;
  booked: number;
  specializations: string[];
  // ... other fields
}
```

### AI Analysis Engine
- **Risk Scoring Algorithm**: Calculates health risk based on multiple factors
- **Report Analysis**: Automated analysis of blood reports and medical documents
- **Recommendation Engine**: Personalized health recommendations
- **Goal Generation**: Creates sustainable health goals based on analysis

## 🎯 Key Workflows

### Patient Health Journey
1. **Login**: Aadhaar + Mobile verification
2. **Health Survey**: Complete comprehensive health assessment
3. **Report Upload**: Upload medical reports and documents
4. **AI Analysis**: Automated health analysis and risk assessment
5. **Pre-Diagnosis**: Preliminary health assessment
6. **Health Goals**: Set and track sustainable health goals
7. **Camp Booking**: Find and book nearby health camps

### Doctor Registration & Verification
1. **Registration**: Complete doctor profile with documents
2. **Admin Review**: Manual verification by admin
3. **Biometric Verification**: Optional biometric authentication
4. **Approval**: Admin approval/rejection
5. **Patient Access**: Access to patient data and management

### Health Camp Management
1. **Camp Creation**: Admin creates health camps with location mapping
2. **Camp Listing**: Patients can view and book camps
3. **Booking Management**: Track bookings and capacity
4. **Camp Analytics**: Monitor camp performance and usage

## 🔧 Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd migrant-health-buddy

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Usage

### For Patients
1. Navigate to Patient Portal
2. Enter Aadhaar number and mobile number
3. Complete health survey
4. Upload medical reports
5. View AI analysis and recommendations
6. Set health goals
7. Book health camps

### For Doctors
1. Navigate to Doctor Portal
2. Complete registration with medical credentials
3. Wait for admin verification
4. Access patient data and assessments
5. Manage prescriptions and consultations

### For Admins
1. Navigate to Admin Portal
2. Verify doctors and patients
3. Create and manage health camps
4. Monitor system analytics
5. Perform biometric verifications

## 🔒 Security Features

- **Aadhaar Verification**: Secure patient identification
- **Biometric Authentication**: Advanced biometric verification
- **Data Encryption**: All sensitive data encrypted in localStorage
- **Role-based Access**: Different access levels for patients, doctors, and admins
- **Audit Trail**: Complete tracking of all user actions

## 📊 Analytics & Reporting

- **Real-time Dashboard**: Live system statistics
- **Health Insights**: Population health analytics
- **Risk Distribution**: Risk level analysis across patients
- **Camp Performance**: Health camp utilization metrics
- **User Engagement**: System usage analytics

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Modern Interface**: Clean, intuitive design
- **Progress Tracking**: Visual progress indicators
- **Real-time Updates**: Live data updates
- **Accessibility**: WCAG compliant interface

## 🚀 Future Enhancements

- **Mobile App**: Native mobile applications
- **Telemedicine**: Video consultation features
- **Blockchain**: Secure health record management
- **Machine Learning**: Advanced health prediction models
- **Integration**: API integration with healthcare systems

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Migrant Health Buddy** - Empowering migrant workers with accessible healthcare through technology.