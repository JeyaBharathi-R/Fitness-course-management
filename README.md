# Fitness Course Management System

A comprehensive web application for managing fitness courses, built with Next.js, React, and Tailwind CSS.

## Features

### For Clients
- Browse available fitness courses with filtering and search
- Enroll in courses with detailed enrollment forms
- Track personal progress and performance
- View upcoming sessions and course completion status
- Manage course enrollments (enroll/cancel)

### For Trainers
- Create, edit, and delete fitness courses
- Manage course details, schedules, and objectives
- Track student attendance for sessions
- View comprehensive reports and analytics
- Monitor student progress and performance
- Generate attendance and performance reports

### Key Features
- **Role-based Access Control**: Separate interfaces for clients and trainers
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Data Management**: State management with React Context and useReducer
- **Interactive Dashboards**: Progress tracking and analytics with charts
- **Form Validation**: Comprehensive validation for all user inputs
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context, useReducer
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Routing**: Next.js App Router

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fitness-course-management
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
fitness-course-management/
├── app/                    # Next.js app directory
│   ├── client/            # Client-side pages
│   ├── trainer/           # Trainer-side pages
│   ├── globals.css        # Global styles
│   └── layout.jsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── course-list.jsx   # Course browsing component
│   ├── enrollment-form.jsx # Enrollment form
│   ├── progress-dashboard.jsx # Progress tracking
│   └── trainer-dashboard.jsx # Trainer management
├── contexts/             # React contexts
│   ├── data-context.jsx  # Data state management
│   └── user-context.jsx  # User state management
├── lib/                  # Utilities and data
│   ├── data.js          # Mock data
│   └── utils.js         # Utility functions
└── public/              # Static assets
```

## Usage

### Switching Roles
The application includes a user context that allows switching between client and trainer roles. By default, it starts as a client (Sarah Johnson). You can switch roles to see different interfaces.

### Client Features
- Navigate to `/client/courses` to browse and enroll in courses
- View progress at `/client/progress`
- Manage enrollments through course details

### Trainer Features
- Access trainer dashboard at `/trainer`
- Manage courses at `/trainer/courses`
- Track attendance at `/trainer/attendance`
- View reports at `/trainer/reports`

## API/Data Structure

The application uses mock data stored in `lib/data.js` with the following entities:

- **Users**: Clients and trainers with roles
- **Courses**: Fitness courses with details, capacity, schedule
- **Sessions**: Individual training sessions with attendance
- **Enrollments**: Client course enrollments with progress
- **Progress Records**: Detailed performance tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.